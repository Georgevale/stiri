import Head from 'next/head'

export default function Layout({ children }) {
  return (
    <div className="site-container">
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
          <img src="/logo.svg" alt="ȘtiriAcum" style={{ height: 48, width: 'auto', display: 'block' }} />
        </a>
        <nav className="site-nav">
          <a href="/">Acasă</a>
          <a href="/admin">Admin</a>
        </nav>
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        © {new Date().getFullYear()} ȘtiriAcum
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
