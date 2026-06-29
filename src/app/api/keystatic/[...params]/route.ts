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

export const GET = blockedInProd ? notFound : getWithPublicOrigin
export const POST = blockedInProd ? notFound : handlers.POST
