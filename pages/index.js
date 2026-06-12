import { useEffect, useState } from 'react'
import Layout from '../components/Layout'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts(params = {}) {
    const query = new URLSearchParams(params).toString()
    const url = '/api/posts' + (query ? `?${query}` : '')
    const r = await fetch(url)
    const data = await r.json()
    setPosts(data)
  }

  function handleSearch(e) {
    e.preventDefault()
    const params = {}
    if (q) params.q = q
    if (category) params.category = category
    fetchPosts(params)
  }

  const categories = Array.from(new Set(posts.flatMap(p => (p.categories||[]))))

  return (
    <Layout>
      <h1 className="site-hero">ȘtiriAcum</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
        <input placeholder="Caută..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Toate categoriile</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="primary" type="submit">Caută</button>
        <button className="ghost" type="button" onClick={() => { setQ(''); setCategory(''); fetchPosts() }}>Reset</button>
      </form>

      <div className="posts-grid">
        {posts.map((p) => (
          <article key={p.id} className="card">
            {p.image ? <img src={p.image} alt="thumb" /> : null}
            <div className="card-title"><a href={`/posts/${p.slug}`}>{p.title}</a></div>
            <div className="card-meta">{(p.categories||[]).join(', ')} {p.author ? '· ' + p.author : ''} {p.date ? '· ' + (new Date(p.date)).toLocaleDateString() : ''}</div>
            <div className="card-excerpt">{p.excerpt}</div>
          </article>
        ))}
      </div>
    </Layout>
  )
}
