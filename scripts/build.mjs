import { readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { build } from 'vite'

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
const appHtml = render('/')
const html = template.replace(
  '<div id="root"></div>',
  `<div id="root">${appHtml}</div>`,
)

await writeFile(indexPath, html)
await rm(serverOutDir, { recursive: true, force: true })
