import { notFound } from 'next/navigation'
import config from '../../../../keystatic.config'
import Keystatic from '../keystatic'

// En mode storage `local`, l'éditeur Keystatic n'a AUCUNE authentification.
// On le réserve donc au dev local : 404 en prod tant qu'on est en `local`.
// Le jour où l'on bascule en `github` (OAuth géré par Keystatic), la condition
// devient fausse et l'accès se rouvre automatiquement — rien à retirer.
const blockedInProd = process.env.NODE_ENV === 'production' && config.storage.kind === 'local'

export default function Page() {
  if (blockedInProd) notFound()
  return <Keystatic />
}
