import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handle(e) {
    e.preventDefault()
    setError('')
    const r = await fetch('/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) })
    if (r.ok) {
      router.push('/admin')
    } else {
      const j = await r.json().catch(()=>({}))
      setError(j.error || 'Eroare autentificare')
    }
  }

  return (
    <Layout>
      <h1>Login admin</h1>
      <form onSubmit={handle}>
        <div>
          <label>Parolă</label>
          <br />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div style={{ marginTop: 8 }}>
          <button type="submit">Login</button>
        </div>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
    </Layout>
  )
}
