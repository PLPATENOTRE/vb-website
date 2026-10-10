// Test de src/lib/pipe-tables.ts — pnpm test:unit
//
// Les entrées reproduisent l'arbre réel que le lecteur Keystatic renvoie pour un tableau
// collé en texte brut (relevé le 10 octobre 2026) : un paragraphe, lignes séparées par
// des feuilles « \n », gras et liens déjà convertis à l'intérieur des lignes.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { pipeTablesToTables } from '../src/lib/pipe-tables.ts'

type Node = Record<string, unknown>

const t = (text: string, marks: Node = {}): Node => ({ text, ...marks })
const br = t('\n')
const p = (...children: Node[]): Node => ({ type: 'paragraph', children })

// Lit un nœud tableau produit sous forme de grille de textes, pour des assertions lisibles.
function grille(table: Node): { entete: string[]; lignes: string[][] } {
  const texte = (n: Node): string =>
    typeof n.text === 'string' ? n.text : ((n.children as Node[]) ?? []).map(texte).join('')
  const [head, body] = table.children as Node[]
  const ligne = (row: Node) => (row.children as Node[]).map(texte)
  return {
    entete: ligne((head.children as Node[])[0]),
    lignes: (body.children as Node[]).map(ligne),
  }
}

test('un tableau collé devient un vrai tableau', () => {
  const [table] = pipeTablesToTables([
    p(t('| Indice | Usage |'), br, t('| --- | --- |'), br, t('| ILC | Commerce |'), br, t('| ILAT | Tertiaire |')),
  ])
  assert.equal(table.type, 'table')
  assert.deepEqual(grille(table), {
    entete: ['Indice', 'Usage'],
    lignes: [
      ['ILC', 'Commerce'],
      ['ILAT', 'Tertiaire'],
    ],
  })
})

test('le gras et les liens restent dans leur cellule', () => {
  const lien = { type: 'link', href: '/contact', children: [t('clause')] }
  const [table] = pipeTablesToTables([
    p(t('| Point | Analyse |'), br, t('| --- | --- |'), br, t('| '), t('La pratique', { bold: true }), t(' | Une '), lien, t(' fixe. |')),
  ])
  const ligne = ((table.children as Node[])[1].children as Node[])[0]
  const [c1, c2] = (ligne.children as Node[]).map((c) => c.children as Node[])
  assert.deepEqual(c1, [t('La pratique', { bold: true })])
  assert.deepEqual(c2, [t('Une '), lien, t(' fixe.')])
})

test('un texte collé sans ligne vide avant le tableau est découpé', () => {
  const out = pipeTablesToTables([
    p(t('Voici le comparatif :'), br, t('| A | B |'), br, t('| --- | --- |'), br, t('| 1 | 2 |'), br, t('Et la suite.')),
  ])
  assert.deepEqual(
    out.map((n) => n.type),
    ['paragraph', 'table', 'paragraph'],
  )
  assert.deepEqual(out[0].children, [t('Voici le comparatif :')])
  assert.deepEqual(out[2].children, [t('Et la suite.')])
})

test('séparateur aligné ( :---: ) accepté', () => {
  const [table] = pipeTablesToTables([p(t('| A | B |'), br, t('|:---|:---:|'), br, t('| 1 | 2 |'))])
  assert.equal(table.type, 'table')
})

test('sans ligne de séparation, rien ne change', () => {
  const source = p(t('| A | B |'), br, t('| 1 | 2 |'))
  assert.deepEqual(pipeTablesToTables([source]), [source])
})

test('un paragraphe ordinaire est rendu tel quel', () => {
  const source = p(t('Un texte avec une barre | au milieu.'))
  const titre = { type: 'heading', level: 2, children: [t('| pas | un tableau |')] }
  assert.deepEqual(pipeTablesToTables([source, titre]), [source, titre])
})
