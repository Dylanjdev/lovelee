import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { build } from 'vite'
import { canonicalUrlForPath, seoPages } from '../src/lib/seo.js'

const root = resolve(import.meta.dirname, '..')
const serverOutDir = resolve(root, '.ssr-build')

await build({ root })

await build({
  root,
  build: {
    ssr: resolve(root, 'src/entry-server.jsx'),
    outDir: serverOutDir,
    emptyOutDir: true,
  },
})

const serverEntry = pathToFileURL(resolve(serverOutDir, 'entry-server.js'))
const { render } = await import(serverEntry.href)
const indexPath = resolve(root, 'dist/index.html')
const template = await readFile(indexPath, 'utf8')

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function replaceRequired(html, pattern, replacement, label) {
  const hasMatch = typeof pattern === 'string' ? html.includes(pattern) : pattern.test(html)

  if (!hasMatch) {
    throw new Error(`Could not find ${label} in the built HTML template.`)
  }

  return html.replace(pattern, replacement)
}

function renderPage(page) {
  const canonicalUrl = canonicalUrlForPath(page.path)
  const renderUrl = new URL(canonicalUrl).pathname
  const appHtml = render(renderUrl)
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  const robots = page.index ? 'index, follow' : 'noindex, follow'

  let html = replaceRequired(
    template,
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`,
    'app root',
  )

  html = replaceRequired(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`, 'title')
  html = replaceRequired(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`, 'meta description')
  html = replaceRequired(html, /<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${robots}" />`, 'robots meta tag')
  html = replaceRequired(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonicalUrl}" />`, 'canonical link')
  html = replaceRequired(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`, 'Open Graph title')
  html = replaceRequired(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`, 'Open Graph description')
  html = replaceRequired(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonicalUrl}" />`, 'Open Graph URL')
  html = replaceRequired(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`, 'Twitter title')
  html = replaceRequired(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${description}" />`, 'Twitter description')

  return html
}

await Promise.all(seoPages.map(async (page) => {
  const routeName = page.path.slice(1)
  const routeDirectory = routeName ? resolve(root, 'dist', routeName) : resolve(root, 'dist')
  await mkdir(routeDirectory, { recursive: true })
  await writeFile(resolve(routeDirectory, 'index.html'), renderPage(page))
}))

const sitemapUrls = seoPages
  .filter((page) => page.index)
  .map((page) => `  <url>\n    <loc>${canonicalUrlForPath(page.path)}</loc>\n  </url>`)
  .join('\n')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`

await writeFile(resolve(root, 'dist/sitemap.xml'), sitemap)

await rm(serverOutDir, { recursive: true, force: true })
