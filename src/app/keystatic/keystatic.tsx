'use client'

import { makePage } from '@keystatic/next/ui/app'
import config from '../../../keystatic.config'

// UI d'admin Keystatic (client). Montée sur /keystatic, bloquée dans robots.ts.
export default makePage(config)
