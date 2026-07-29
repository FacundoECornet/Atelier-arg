// Build-time static HTML generator for blog articles, sitemap, and robots.txt.
// Runs after `vite build` (`npm run build` → postbuild hook).
// Reads Firestore via firebase-admin (service account), writes to dist/.
// Build runs locally; dist/ deployed to Hostinger (Apache) via FTP.

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const DIST = join(process.cwd(), 'dist')
const SITE_URL = 'https://atelierarg.com'
const BUILD_TIME = new Date().toISOString()

function escapeHtml(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function renderArticleHTML(data) {
  const description = (data.descripcion || '').substring(0, 160)
  const dateFormatted = data.fecha
    ? new Date(data.fecha).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''
  const slug = encodeURIComponent(data.slug || '')

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(data.titulo)} | Atelier Homes Argentina</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta property="og:title" content="${escapeHtml(data.titulo)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(data.img || '')}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${SITE_URL}/blog/${slug}" />
  <link rel="canonical" href="${SITE_URL}/blog/${slug}" />
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 0 auto; padding: 2rem 1rem; line-height: 1.7; color: #1a1a1a; }
    img { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1.5rem 0; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    time { color: #666; font-size: 0.9rem; }
    .hero-img { width: 100%; max-height: 400px; object-fit: cover; border-radius: 1rem; margin-bottom: 1.5rem; }
  </style>
</head>
<body>
  <article>
    ${data.img ? `<img class="hero-img" src="${escapeHtml(data.img)}" alt="${escapeHtml(data.titulo)}" />` : ''}
    <h1>${escapeHtml(data.titulo)}</h1>
    ${dateFormatted ? `<time datetime="${data.fecha}">${dateFormatted}</time>` : ''}
    <div>${data.contenido || ''}</div>
  </article>
</body>
</html>`
}

function renderSitemap(articles, properties) {
  const urls = []

  urls.push(`  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`)

  urls.push(`  <url>
    <loc>${SITE_URL}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`)

  for (const article of articles) {
    if (!article.slug) continue
    const slug = encodeURIComponent(article.slug)
    const lastmod = article.fecha
      ? new Date(article.fecha).toISOString()
      : BUILD_TIME
    urls.push(`  <url>
    <loc>${SITE_URL}/blog/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`)
  }

  for (const prop of properties) {
    const path = prop.codigo ? encodeURIComponent(prop.codigo) : prop.id
    urls.push(`  <url>
    <loc>${SITE_URL}/propiedades/${path}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`)
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`
}

function renderRobotsTxt() {
  return `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml`
}

function renderHtaccess() {
  return `RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]`
}

async function main() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64
  if (!b64) {
    console.error('FIREBASE_SERVICE_ACCOUNT_B64 not set — skipping static HTML generation')
    process.exit(1)
  }

  const serviceAccount = JSON.parse(
    Buffer.from(b64, 'base64').toString('utf8')
  )
  initializeApp({ credential: cert(serviceAccount) })
  const db = getFirestore()

  const articlesSnap = await db.collection('Noticias').where('publicado', '==', true).get()
  const articles = []
  let generated = 0

  for (const doc of articlesSnap.docs) {
    const data = { id: doc.id, ...doc.data() }
    articles.push(data)

    if (!data.slug) continue

    const dir = join(DIST, 'blog', data.slug)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

    writeFileSync(join(dir, 'index.html'), renderArticleHTML(data))
    console.log(`Generated: /blog/${data.slug}/index.html`)
    generated++
  }

  console.log(`Blog articles: ${generated} static HTML files generated`)

  const propsSnap = await db.collection('propiedades').get()
  const properties = propsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))

  writeFileSync(join(DIST, 'sitemap.xml'), renderSitemap(articles, properties))
  console.log('Generated: dist/sitemap.xml')

  writeFileSync(join(DIST, 'robots.txt'), renderRobotsTxt())
  console.log('Generated: dist/robots.txt')

  writeFileSync(join(DIST, '.htaccess'), renderHtaccess())
  console.log('Generated: dist/.htaccess (Apache SPA fallback for Hostinger)')

  console.log('Postbuild complete.')
}

main().catch((err) => {
  console.error('Postbuild failed:', err)
  process.exit(1)
})
