import crypto from 'crypto'

function hashPwd(pwd) {
  return crypto.createHash('sha256').update(pwd || '').digest('hex')
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }

  const { password } = req.body || {}
  const configured = process.env.ADMIN_PASSWORD || ''
  if (!configured) {
    res.status(500).json({ error: 'Admin password not configured' })
    return
  }

  if (password === configured) {
    // set cookie with hash
    const h = hashPwd(configured)
    res.setHeader('Set-Cookie', `admin_auth=${h}; HttpOnly; Path=/; SameSite=Lax`)
    res.status(200).json({ ok: true })
    return
  }

  res.status(401).json({ error: 'Invalid password' })
}
