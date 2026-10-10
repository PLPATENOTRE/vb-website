// Tableaux collés dans Keystatic → vrais tableaux, au moment du rendu.
//
// Le collage en texte brut (Cmd+Shift+V) convertit titres, listes, gras et liens, mais
// pas les tableaux : un tableau markdown arrive comme UN paragraphe dont les lignes sont
// séparées par des sauts de ligne forcés (feuilles de texte « \n »). Le gras et les liens
// à l'intérieur des cellules, eux, sont déjà convertis. Un tableau écrit directement dans
// le fichier (cas de la veille) est déjà lu comme un vrai tableau : rien à faire pour lui.
//
// On reconnaît ces lignes et on les remplace par un nœud `table` de la même forme que
// celui que produit le lecteur Keystatic — forme que DocumentRenderer sait afficher.
// Le fichier source n'est jamais modifié : Victoire publie d'un clic, le site affiche
// le tableau. Un texte collé sans ligne vide avant le tableau est découpé proprement.
//
// Limites assumées : seuls les paragraphes de premier niveau sont examinés (un tableau
// dans une citation ou une liste reste du texte), et un tableau sans ligne de séparation
// `| --- |` n'est pas reconnu. Le test : scripts/pipe-tables.test.mts.

interface Leaf {
  text: string
  [mark: string]: unknown
}

interface Element {
  type: string
  children: Node[]
  [attribute: string]: unknown
}

type Node = Leaf | Element

const isLeaf = (n: unknown): n is Leaf =>
  typeof n === 'object' && n !== null && typeof (n as Leaf).text === 'string'

const isElement = (n: unknown): n is Element =>
  typeof n === 'object' &&
  n !== null &&
  typeof (n as Element).type === 'string' &&
  Array.isArray((n as Element).children)

const plainText = (nodes: Node[]): string =>
  nodes.map((n) => (isLeaf(n) ? n.text : plainText(n.children))).join('')

const ROW = /^\|.*\|$/
const SEPARATOR = /^\|(\s*:?-{3,}:?\s*\|)+$/

const isRow = (line: Node[]): boolean => ROW.test(plainText(line).trim())
const isSeparator = (line: Node[]): boolean => SEPARATOR.test(plainText(line).trim())

/** Découpe une suite de feuilles sur un caractère, en conservant gras et liens. */
function splitOn(nodes: Node[], char: string): Node[][] {
  const parts: Node[][] = [[]]
  for (const node of nodes) {
    if (!isLeaf(node)) {
      parts[parts.length - 1].push(node)
      continue
    }
    node.text.split(char).forEach((piece, i) => {
      if (i > 0) parts.push([])
      if (piece) parts[parts.length - 1].push({ ...node, text: piece })
    })
  }
  return parts
}

/** Retire les espaces de bord d'une cellule ; jamais vide (Slate exige une feuille). */
function trimCell(cell: Node[]): Node[] {
  const out = [...cell]
  while (out.length > 0 && isLeaf(out[0]) && !out[0].text.trim()) out.shift()
  while (out.length > 0) {
    const last = out[out.length - 1]
    if (!isLeaf(last) || last.text.trim()) break
    out.pop()
  }
  if (out.length === 0) return [{ text: '' }]
  const first = out[0]
  if (isLeaf(first)) out[0] = { ...first, text: first.text.trimStart() }
  const last = out[out.length - 1]
  if (isLeaf(last)) out[out.length - 1] = { ...last, text: last.text.trimEnd() }
  return out
}

/** Une ligne `| a | b |` → ses cellules (segments de bord, vides, retirés). */
const cellsOf = (line: Node[]): Node[][] => splitOn(line, '|').slice(1, -1).map(trimCell)

function table(header: Node[], rows: Node[][]): Element {
  return {
    type: 'table',
    children: [
      {
        type: 'table-head',
        children: [
          {
            type: 'table-row',
            children: cellsOf(header).map((c) => ({
              type: 'table-cell',
              header: true,
              children: c,
            })),
          },
        ],
      },
      {
        type: 'table-body',
        children: rows.map((row) => ({
          type: 'table-row',
          children: cellsOf(row).map((c) => ({ type: 'table-cell', children: c })),
        })),
      },
    ],
  }
}

/** Reconstruit un paragraphe à partir de lignes ; null s'il ne reste que du vide. */
function paragraph(model: Element, lines: Node[][]): Element | null {
  const kept = [...lines]
  while (kept.length > 0 && !plainText(kept[0]).trim()) kept.shift()
  while (kept.length > 0 && !plainText(kept[kept.length - 1]).trim()) kept.pop()
  if (kept.length === 0) return null
  return {
    ...model,
    children: kept.flatMap((line, i) => (i > 0 ? [{ text: '\n' }, ...line] : line)),
  }
}

function convert(node: unknown): unknown[] {
  if (!isElement(node) || node.type !== 'paragraph') return [node]

  let rest = splitOn(node.children, '\n')
  const out: Element[] = []
  for (;;) {
    const start = rest.findIndex(
      (line, i) => isRow(line) && i + 1 < rest.length && isSeparator(rest[i + 1]),
    )
    if (start === -1) break
    let end = start + 2
    while (end < rest.length && isRow(rest[end])) end++

    const before = paragraph(node, rest.slice(0, start))
    if (before) out.push(before)
    out.push(table(rest[start], rest.slice(start + 2, end)))
    rest = rest.slice(end)
  }

  if (out.length === 0) return [node] // aucun tableau : nœud rendu tel quel
  const after = paragraph(node, rest)
  if (after) out.push(after)
  return out
}

/** Remplace les tableaux collés par de vrais tableaux. Garde le type d'entrée de l'appelant. */
export function pipeTablesToTables<T>(content: T[]): T[] {
  return content.flatMap((node) => convert(node) as T[])
}
