import { Resend } from 'resend'
import { z } from 'zod'
import type { ContactApiResponse } from '@/types'

export const runtime = 'nodejs'

const contactSchema = z
  .object({
    // regex anti-CRLF : empêche l'injection d'en-têtes email via le sujet (CWE-93).
    nom: z
      .string()
      .min(2)
      .max(100)
      .regex(/^[^\r\n]+$/),
    prenom: z.string().max(100).optional(),
    email: z.email(),
    // caractères de téléphone plausibles uniquement (formats internationaux tolérés).
    telephone: z
      .string()
      .regex(/^[+0-9 ().-]{0,30}$/)
      .optional(),
    message: z.string().min(10).max(5000),
    token: z.string().min(1),
  })
  .strict()

interface TurnstileOutcome {
  success: boolean
  'error-codes'?: string[]
}

function json(body: ContactApiResponse, status: number): Response {
  return Response.json(body, { status })
}

// Garde-fou anti-flood best-effort, PAR INSTANCE.
// ponytail: Cloud Run scale-to-zero => non global ; la vraie limite est une règle
// Cloudflare WAF sur POST /api/contact (5 req/min/IP) — voir TODO infra.
const RATE_WINDOW_MS = 60_000
const RATE_MAX = 5
const rateHits = new Map<string, number[]>()
function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (rateHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  if (recent.length === 0) rateHits.delete(ip)
  else rateHits.set(ip, recent)
  return recent.length > RATE_MAX
}

export async function POST(req: Request): Promise<Response> {
  // Step 1 — Parse JSON body
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return json({ ok: false, error: 'Requête invalide' }, 400)
  }

  // Step 2 — Validate with Zod
  const parsed = contactSchema.safeParse(raw)
  if (!parsed.success) {
    return json({ ok: false, error: 'Champs invalides' }, 400)
  }
  const data = parsed.data

  // Step 3 — Check required env vars
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
  const resendKey = process.env.RESEND_API_KEY
  const resendTo = process.env.RESEND_TO
  if (!turnstileSecret || !resendKey || !resendTo) {
    console.error('contact: env manquante')
    return json({ ok: false, error: 'Configuration serveur indisponible' }, 500)
  }

  const remoteip =
    req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? undefined

  // Step 3b — Rate limit best-effort par IP
  if (rateLimited(remoteip ?? 'unknown')) {
    return json({ ok: false, error: 'Trop de requêtes, réessayez dans un instant' }, 429)
  }

  // Step 4 — Turnstile verification
  const formBody = new URLSearchParams({
    secret: turnstileSecret,
    response: data.token,
    ...(remoteip !== undefined ? { remoteip } : {}),
  })

  let outcome: TurnstileOutcome
  try {
    const tsRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString(),
    })
    const tsJson: unknown = await tsRes.json()
    if (
      typeof tsJson !== 'object' ||
      tsJson === null ||
      typeof (tsJson as Record<string, unknown>)['success'] !== 'boolean'
    ) {
      throw new Error('Turnstile response shape unexpected')
    }
    outcome = tsJson as TurnstileOutcome
  } catch (err) {
    console.error('contact: Turnstile fetch error', err)
    return json({ ok: false, error: 'Échec de la vérification anti-spam' }, 400)
  }

  if (!outcome.success) {
    return json({ ok: false, error: 'Échec de la vérification anti-spam' }, 400)
  }

  // Step 5 — Send email via Resend
  const bodyLines = [
    `Nom : ${data.nom}`,
    data.prenom ? `Prénom : ${data.prenom}` : null,
    `Email : ${data.email}`,
    data.telephone ? `Téléphone : ${data.telephone}` : null,
    '',
    `Message :`,
    data.message,
  ]
    .filter((line): line is string => line !== null)
    .join('\n')

  const resend = new Resend(resendKey)
  const { error: resendError } = await resend.emails.send({
    from: 'noreply@behaghel-avocat.com',
    to: resendTo,
    replyTo: data.email,
    subject: `Nouveau contact — ${data.nom}`,
    text: bodyLines,
  })

  if (resendError) {
    // log restreint au nom/message — pas l'objet complet (CWE-532).
    console.error('contact: Resend error', resendError.name, resendError.message)
    return json({ ok: false, error: 'Envoi impossible pour le moment' }, 500)
  }

  // Step 6 — Success
  return json({ ok: true }, 200)
}
