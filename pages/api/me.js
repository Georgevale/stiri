import crypto from 'crypto'

export default function handler(req, res) {
  const cookie = req.headers?.cookie || ''
  const match = cookie.match(/(?:^|; )admin_auth=([^;]+)/)
  const provided = match ? match[1] : null
  const configured = process.env.ADMIN_PASSWORD || ''
  const expected = crypto.createHash('sha256').update(configured).digest('hex')
  res.status(200).json({ authenticated: !!(provided && provided === expected) })
}
