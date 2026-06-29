import { makeRouteHandler } from '@keystatic/next/route-handler'
import { NextRequest } from 'next/server'
import config from '../../../../../keystatic.config'

// Garde : en mode `local` l'API n'a pas d'auth → coupée en prod.
// Inerte en mode `github` (kind !== 'local'), où l'OAuth fait l'auth.
const blockedInProd = process.env.NODE_ENV === 'production' && config.storage.kind === 'local'

const handlers = makeRouteHandler({ config })
const notFound = () => new Response('Not found', { status: 404 })

// Derrière le proxy App Hosting (Cloud Run), le conteneur reçoit `Host: 0.0.0.0:8080`
// et l'URL publique arrive dans `x-forwarded-host` — port interne `:8080` inclus.
// Or Keystatic construit le redirect_uri OAuth à partir de `new URL(req.url).origin`.
// On réécrit donc l'origine : hostname depuis l'en-tête forwarded, port forcé à vide
// (le site public est en https/443). `KEYSTATIC_URL` peut forcer la valeur si besoin.
function publicOrigin(req: NextRequest): URL | null {
  if (process.env.KEYSTATIC_URL) return new URL(process.env.KEYSTATIC_URL)
  const fwdHost = req.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  if (!fwdHost) return null
  const proto = req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() ?? 'https'
  return new URL(`${proto}://${fwdHost}`)
}

function getWithPublicOrigin(req: NextRequest): Promise<Response> {
  const pub = publicOrigin(req)
  if (!pub) return handlers.GET(req)
  const url = new URL(req.url)
  url.protocol = pub.protocol
  url.hostname = pub.hostname
  url.port = '' // ne pas laisser fuiter le port interne 8080
  return handlers.GET(new NextRequest(url, { headers: req.headers }))
}

// ⚠️ DIAGNOSTIC TEMPORAIRE — à retirer. Refait le token exchange et renvoie la
// réponse brute de GitHub (sans dumper access_token/refresh_token).
async function diagnoseCallback(code: string): Promise<Response> {
  const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID ?? ''
  const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET ?? ''
  const u = new URL('https://github.com/login/oauth/access_token')
  u.searchParams.set('client_id', clientId)
  u.searchParams.set('client_secret', clientSecret)
  u.searchParams.set('code', code)
  const res = await fetch(u, { method: 'POST', headers: { Accept: 'application/json' } })
  const text = await res.text()
  const info: Record<string, unknown> = {
    githubStatus: res.status,
    clientIdPrefix: clientId.slice(0, 7),
    clientSecretLen: clientSecret.length,
    keystaticSecretLen: (process.env.KEYSTATIC_SECRET ?? '').length,
  }
  try {
    const o: unknown = JSON.parse(text)
    if (o && typeof o === 'object') {
      const rec = o as Record<string, unknown>
      info.responseKeys = Object.keys(rec) // refresh_token présent ? expires_in ?
      if ('error' in rec) {
        info.error = rec.error
        info.error_description = rec.error_description
      }
    }
  } catch {
    info.rawNonJson = text.slice(0, 200)
  }
  return Response.json(info)
}

function getHandler(req: NextRequest): Promise<Response> {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  if (url.pathname.endsWith('/github/oauth/callback') && code) {
    return diagnoseCallback(code)
  }
  return getWithPublicOrigin(req)
}

export const GET = blockedInProd ? notFound : getHandler
export const POST = blockedInProd ? notFound : handlers.POST
