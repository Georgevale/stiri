import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

function getAuthHash() {
  const pwd = process.env.ADMIN_PASSWORD || ''
  return crypto.createHash('sha256').update(pwd).digest('hex')
}

function cookieAuthHash(req) {
  const cookie = req.headers?.cookie || ''
  const match = cookie.match(/(?:^|; )admin_auth=([^;]+)/)
  return match ? match[1] : null
}

function requireAuth(req, res) {
  const provided = cookieAuthHash(req)
  if (!provided || provided !== getAuthHash()) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
  return true
}

const dataFile = path.join(process.cwd(), 'data', 'posts.json')

function readData() {
  try {
    const raw = fs.readFileSync(dataFile, 'utf8')
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8')
}

export default function handler(req, res) {
  const method = req.method
  const posts = readData()

  if (method === 'GET') {
    const { q, category, tag } = req.query
    let out = posts
    if (q) {
      const qq = q.toLowerCase()
      out = out.filter((p) => (p.title||'').toLowerCase().includes(qq) || (p.excerpt||'').toLowerCase().includes(qq) || (p.content||'').toLowerCase().includes(qq))
    }
    if (category) {
      out = out.filter((p) => Array.isArray(p.categories) && p.categories.map(c=>c.toLowerCase()).includes(category.toLowerCase()))
    }
    if (tag) {
      out = out.filter((p) => Array.isArray(p.tags) && p.tags.map(t=>t.toLowerCase()).includes(tag.toLowerCase()))
    }
    res.status(200).json(out)
    return
  }

  if (method === 'POST') {
    if (!requireAuth(req, res)) return
    const { title, excerpt, content, categories, tags, author, date, image } = req.body
    const id = Date.now().toString()
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const newPost = {
      id,
      slug,
      title,
      excerpt,
      content,
      image: image || '',
      categories: Array.isArray(categories) ? categories : (categories ? [categories] : []),
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t=>t.trim()).filter(Boolean) : []),
      author: author || 'Redacția ȘtiriAcum',
      date: date || new Date().toISOString()
    }
    const updated = [newPost, ...posts]
    writeData(updated)
    res.status(201).json(newPost)
    return
  }

  if (method === 'PUT') {
    if (!requireAuth(req, res)) return
    const { id, title, excerpt, content, categories, tags, author, date, image } = req.body
    const updated = posts.map((p) => (p.id === id ? {
      ...p,
      title,
      excerpt,
      content,
      image: typeof image !== 'undefined' ? image : p.image,
      categories: Array.isArray(categories) ? categories : (categories ? [categories] : []),
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t=>t.trim()).filter(Boolean) : p.tags),
      author: author || p.author,
      date: date || p.date
    } : p))
    writeData(updated)
    res.status(200).json({ ok: true })
    return
  }

  if (method === 'DELETE') {
    if (!requireAuth(req, res)) return
    const { id } = req.body
    const updated = posts.filter((p) => p.id !== id)
    writeData(updated)
    res.status(200).json({ ok: true })
    return
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  res.status(405).end(`Method ${method} Not Allowed`)
}
