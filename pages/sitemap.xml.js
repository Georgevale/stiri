import fs from 'fs'
import path from 'path'

export default function Sitemap() {
  // getServerSideProps will handle the response
  return null
}

export async function getServerSideProps({ res }) {
  const postsFile = path.join(process.cwd(), 'data', 'posts.json')
  let posts = []
  try { posts = JSON.parse(fs.readFileSync(postsFile, 'utf8')) } catch (e) { posts = [] }
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000'
  const urls = posts.map(p => `${baseUrl}/posts/${p.slug}`)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}</loc></url>
  ${urls.map(u => `<url><loc>${u}</loc></url>`).join('\n')}
  </urlset>`
  res.setHeader('Content-Type', 'text/xml')
  res.write(xml)
  res.end()
  return { props: {} }
}
