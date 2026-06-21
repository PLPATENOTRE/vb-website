import { expect, test } from '@playwright/test'

const ROUTES = [
  '/',
  '/a-propos',
  '/baux-commerciaux',
  '/baux-commerciaux/negociation',
  '/baux-commerciaux/vie-du-bail',
  '/baux-commerciaux/contentieux',
  '/baux-commerciaux/fin-de-bail',
  '/baux-commerciaux/cession-fonds-actions',
  '/baux-commerciaux/formations',
  '/bail-commercial-commercant',
  '/bail-commercial-hotelier',
  '/bail-commercial-industriel',
  '/bail-commercial-investisseur',
  '/bail-commercial-entrepot-logistique',
  '/bail-commercial-profession-liberale',
  '/bail-commercial-restaurateur',
  '/honoraires',
  '/contact',
  '/actualites',
  '/actualites/la-clause-d-indexation',
  '/mentions-legales',
  '/confidentialite',
]

test.describe('Routes publiques', () => {
  for (const path of ROUTES) {
    test(`200 + H1 visible — ${path}`, async ({ page }) => {
      const res = await page.goto(path)
      expect(res?.status()).toBe(200)
      await expect(page.locator('h1').first()).toBeVisible()
    })
  }

  test('slug secteur inconnu -> 404', async ({ page }) => {
    const res = await page.goto('/bail-commercial-inexistant')
    expect(res?.status()).toBe(404)
  })
})

test('Navigation principale : Services -> hub baux commerciaux', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Services', exact: true }).first().click()
  await expect(page).toHaveURL(/\/baux-commerciaux$/)
  await expect(page.locator('h1').first()).toBeVisible()
})

test('Formulaire de contact : la validation anti-spam bloque sans token', async ({ page }) => {
  await page.goto('/contact')
  await page.fill('#nom', 'Dupont')
  await page.fill('#email', 'test@exemple.fr')
  await page.fill('#message', 'Bonjour, une question sur mon bail commercial.')
  await page.getByRole('button', { name: /envoyer/i }).click()
  await expect(page.getByText(/anti-spam/i)).toBeVisible()
})

test('Formulaire de contact : confirmation au succès (API mockée)', async ({ page }) => {
  // Token Turnstile injecté côté page pour ne pas dépendre du widget externe.
  await page.route('**/api/contact', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    }),
  )
  await page.goto('/contact')
  await page.fill('#nom', 'Dupont')
  await page.fill('#email', 'test@exemple.fr')
  await page.fill('#message', 'Bonjour, une question sur mon bail commercial.')
  // Le widget Turnstile (clé de test) appelle onVerify automatiquement.
  await page.waitForTimeout(4000)
  await page.getByRole('button', { name: /envoyer/i }).click()
  await expect(page.getByText(/Message envoyé/i)).toBeVisible({ timeout: 15_000 })
})

test('JSON-LD Service + FAQPage + BreadcrumbList sur une page service', async ({ page }) => {
  await page.goto('/baux-commerciaux/negociation')
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
  const joined = blocks.join(' ')
  expect(joined).toContain('"Service"')
  expect(joined).toContain('"FAQPage"')
  expect(joined).toContain('"BreadcrumbList"')
})

test('Fonts auto-hébergées : aucune requête Google Fonts', async ({ page }) => {
  const googleFontHits: string[] = []
  page.on('request', (req) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(req.url())) googleFontHits.push(req.url())
  })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  expect(googleFontHits).toHaveLength(0)
})
