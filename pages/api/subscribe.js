import fs from 'fs'
import path from 'path'

const subsFile = path.join(process.cwd(), 'data', 'subscribers.json')

function readSubs() {
  try { return JSON.parse(fs.readFileSync(subsFile, 'utf8')) } catch (e) { return [] }
}
function writeSubs(s) { fs.writeFileSync(subsFile, JSON.stringify(s, null, 2), 'utf8') }

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }
  const { email } = req.body || {}
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'invalid_email' })
    return
  }
  const subs = readSubs()
  if (!subs.includes(email)) subs.unshift(email)
  writeSubs(subs.slice(0, 10000))
  res.status(200).json({ ok: true })
}
