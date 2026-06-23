import { makeRouteHandler } from '@keystatic/next/route-handler'
import config from '../../../../../keystatic.config'

// Même garde que la page /keystatic : en mode `local` l'API n'a pas d'auth,
// on la coupe en prod. Repasse en service automatiquement en mode `github`.
const blockedInProd = process.env.NODE_ENV === 'production' && config.storage.kind === 'local'

const handlers = makeRouteHandler({ config })
const notFound = () => new Response('Not found', { status: 404 })

export const GET = blockedInProd ? notFound : handlers.GET
export const POST = blockedInProd ? notFound : handlers.POST
