// Génère l'image d'aperçu social unique : public/assets/og-default.jpg (1200x630).
//
// Pourquoi un script et pas un fichier déposé à la main : l'image doit rester
// régénérable quand la charte bouge (couleurs §3 de CLAUDE.md, portrait, wording).
// Le rendu passe par Chromium (déjà installé pour Playwright) sur du HTML inline ;
// les fontes sont injectées en base64 parce que la page n'est servie par aucun
// serveur — un `url(/fonts/…)` ne résoudrait pas.
//
// Usage : node scripts/og-image.mjs
//
// ponytail: une seule image pour tout le site. Une image par page quand une page
// aura un visuel qui lui est propre — pas avant.

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const ROOT = join(import.meta.dirname, '..')
const OUT = join(ROOT, 'public', 'assets', 'og-default.jpg')

const b64 = (...segments) => readFileSync(join(ROOT, ...segments)).toString('base64')

// Sous-ensembles latin uniquement : le rendu ne contient que du français.
const CORMORANT_600 = b64('public', 'fonts', 'co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff2')
const MULISH_400 = b64('public', 'fonts', '1Ptvg83HX_SGhgqk3wot.woff2')
const PORTRAIT = b64('public', 'assets', 'photo_accueil_portrait_2x.webp')

const html = `<!doctype html>
<meta charset="utf-8">
<style>
  @font-face { font-family: Cormorant; font-weight: 600;
    src: url(data:font/woff2;base64,${CORMORANT_600}) format('woff2'); }
  @font-face { font-family: Mulish; font-weight: 400;
    src: url(data:font/woff2;base64,${MULISH_400}) format('woff2'); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; display: flex; background: #FCFBF8; }
  .texte { flex: 1; padding: 72px 64px; display: flex; flex-direction: column;
           justify-content: center; gap: 28px; }
  .label { font: 400 20px Mulish; letter-spacing: 4px; text-transform: uppercase;
           color: #CE899E; border-left: 5px solid #CE899E; padding-left: 18px; }
  h1 { font: 600 94px Cormorant; line-height: 1.02; color: #2E4739; }
  .sous { font: 400 29px Mulish; line-height: 1.5; color: #2E4739; opacity: .78; }
  .pied { font: 400 22px Mulish; letter-spacing: 1px; color: #2E4739; margin-top: 10px; }
  img { width: 400px; height: 630px; object-fit: cover; object-position: 50% 4%; }
</style>
<div class="texte">
  <p class="label">Avocate · Barreau de Lyon</p>
  <h1>Baux<br>commerciaux</h1>
  <p class="sous">Conseil et contentieux, partout en France.</p>
  <p class="pied">Victoire Behaghel — behaghel-avocat.com</p>
</div>
<img src="data:image/webp;base64,${PORTRAIT}" alt="">
`

const navigateur = await chromium.launch()
const page = await navigateur.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
writeFileSync(OUT, await page.screenshot({ type: 'jpeg', quality: 88 }))
await navigateur.close()

console.log(`écrit : ${OUT}`)
