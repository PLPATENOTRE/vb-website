import { makeRouteHandler } from '@keystatic/next/route-handler'
import { NextRequest } from 'next/server'
import config from '../../../../../keystatic.config'

// Garde : en mode `local` l'API n'a pas d'auth → coupée en prod.
// Inerte en mode `github` (kind !== 'local'), où l'OAuth fait l'auth.
const blockedInProd = process.env.NODE_ENV === 'production' && config.storage.kind === 'local'

const handlers = makeRouteHandler({ config })
const notFound = () => new Response('Not found', { status: 404 })

// Derrière le proxy App Hosting (Cloud Run), le conteneur reçoit `Host: 0.0.0.0:8080`
// et l'URL publique arrive dans `x-forwarded-host`. Or Keystatic construit le
// redirect_uri OAuth à partir de `new URL(req.url).origin` → sans correction il
// envoie https://0.0.0.0:8080/... que GitHub rejette ("redirect_uri not associated").
// On réécrit l'origine à partir des en-têtes forwarded (domain-agnostic : marche
// aussi pour un futur sous-domaine). `KEYSTATIC_URL` peut forcer la valeur si besoin.
function publicOrigin(req: NextRequest): string | null {
  if (process.env.KEYSTATIC_URL) return process.env.KEYSTATIC_URL
  const fwdHost = req.headers.get('x-forwarded-host')
  if (!fwdHost) return null
  const proto = req.headers.get('x-forwarded-proto') ?? 'https'
  return `${proto}://${fwdHost}`
}

function getWithPublicOrigin(req: NextRequest): Promise<Response> {
  const origin = publicOrigin(req)
  if (!origin) return handlers.GET(req)
  const url = new URL(req.url)
  const pub = new URL(origin)
  url.protocol = pub.protocol
  url.host = pub.host
  return handlers.GET(new NextRequest(url, { headers: req.headers }))
}

export const GET = blockedInProd ? notFound : getWithPublicOrigin
export const POST = blockedInProd ? notFound : handlers.POST
