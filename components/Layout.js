import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Layout({ children }) {
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(j => setAuth(!!j.authenticated)).catch(()=>setAuth(false))
  }, [])

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' }).catch(()=>{})
    // refresh to clear server-side auth checks
    window.location.href = '/'
  }

  return (
    <div className="container">
      <Head>
        <title>ȘtiriAcum — cele mai noi știri</title>
        <meta name="description" content="ȘtiriAcum — publicăm cele mai proaspete știri locale și internaționale." />
        <meta property="og:title" content="ȘtiriAcum" />
        <meta property="og:description" content="ȘtiriAcum — publicăm cele mai proaspete știri locale și internaționale." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <header className="site-header">
        <a className="brand" href="/">
          <img src="/logo.svg" alt="ȘtiriAcum" />
        </a>
        <nav className="site-nav">
          <a href="/">Acasă</a>
          {auth ? <a href="/admin">Admin</a> : <a href="/login">Admin</a>}
          {auth ? <button className="primary" onClick={handleLogout}>Logout</button> : null}
        </nav>
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>© {new Date().getFullYear()} ȘtiriAcum</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href="https://www.buymeacoffee.com/" target="_blank" rel="noreferrer" className="ghost">Donate</a>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input id="subscribeEmail" placeholder="Abonează-te (email)" style={{ padding: '8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)', background: 'transparent', color: 'inherit' }} />
              <button className="primary" onClick={async () => {
                const el = document.getElementById('subscribeEmail')
                if (!el) return
                const email = el.value && el.value.trim()
                if (!email) return alert('Introdu un email valid')
                try {
                  const r = await fetch('/api/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }) })
                  if (r.ok) { el.value=''; alert('Mulțumim! Te-ai abonat.') } else { alert('Eroare abonare') }
                } catch (e) { alert('Eroare abonare') }
              }}>Subscribe</button>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .site-container { max-width: 960px; margin: 0 auto; padding: 16px; }
        .site-header { display:flex; align-items:center; justify-content:space-between; gap:12px; }
        .brand { display:flex; align-items:center; gap:10px; text-decoration:none; color:inherit }
        .brand-title { font-weight:700; font-size:18px }
        .site-nav a { margin-left:12px; color:#0070f3; text-decoration:none }
        .site-main { margin-top:18px }
        .site-footer { margin-top:40px; border-top:1px solid #eee; padding-top:10px; color:#555 }
        @media (max-width:600px) {
          .site-container { padding:12px }
          .brand-title { font-size:16px }
          .site-nav { display:none }
        }
      `}</style>
    </div>
  )
}
