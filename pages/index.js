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
      <h1>ȘtiriAcum</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input placeholder="Caută..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ marginLeft: 8 }}>
          <option value="">Toate categoriile</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button style={{ marginLeft: 8 }} type="submit">Caută</button>
        <button type="button" onClick={() => { setQ(''); setCategory(''); fetchPosts() }} style={{ marginLeft: 8 }}>Reset</button>
      </form>

      <p>Lista de articole:</p>
      <ul>
        {posts.map((p) => (
          <li key={p.id} style={{ marginBottom: 10 }}>
            <strong><a href={`/posts/${p.slug}`}>{p.title}</a></strong> — {p.excerpt}
            <div style={{ fontSize: 12, color: '#666' }}>{(p.categories||[]).join(', ')} {p.tags && p.tags.length ? '· Tags: ' + p.tags.join(', ') : ''} {p.author ? '· ' + p.author : ''} {p.date ? '· ' + (new Date(p.date)).toLocaleDateString() : ''}</div>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
