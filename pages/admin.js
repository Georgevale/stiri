import { useEffect, useState } from 'react'
import Layout from '../components/Layout'

export default function Admin() {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState({ id: '', title: '', excerpt: '', content: '', category: '', tags: '' })

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    const r = await fetch('/api/posts')
    const data = await r.json()
    setPosts(data)
  }

  function editPost(p) {
    setForm({ id: p.id, title: p.title, excerpt: p.excerpt, content: p.content, category: (p.categories && p.categories[0]) || '', tags: (p.tags || []).join(', ') })
  }

  function resetForm() {
    setForm({ id: '', title: '', excerpt: '', content: '' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      id: form.id,
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      categories: form.category ? [form.category] : [],
      tags: form.tags ? form.tags.split(',').map(t=>t.trim()).filter(Boolean) : []
    }
    if (form.id) {
      await fetch('/api/posts', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
    } else {
      await fetch('/api/posts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
    }
    resetForm()
    fetchPosts()
  }

  async function handleDelete(id) {
    if (!confirm('Ștergi acest articol?')) return
    await fetch('/api/posts', { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) })
    fetchPosts()
  }

  return (
    <Layout>
      <h1>Admin — Postări</h1>

      <section style={{ display: 'flex', gap: 40 }}>
        <div style={{ flex: 1 }}>
          <h2>Formular</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Titlu</label>
              <br />
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required style={{ width: '100%' }} />
            </div>
              <div>
                <label>Categorie</label>
                <br />
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ width: '100%' }} />
              </div>
            <div>
              <label>Excerpt</label>
              <br />
              <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} style={{ width: '100%' }} />
            </div>
              <div>
                <label>Tags (comma separated)</label>
                <br />
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} style={{ width: '100%' }} />
              </div>
            <div>
              <label>Conținut</label>
              <br />
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} style={{ width: '100%' }} />
            </div>
            <div style={{ marginTop: 8 }}>
              <button type="submit">{form.id ? 'Salvează' : 'Adaugă'}</button>
              <button type="button" onClick={resetForm} style={{ marginLeft: 8 }}>Reset</button>
            </div>
          </form>
        </div>

        <div style={{ flex: 1 }}>
          <h2>Lista postări</h2>
          <ul>
            {posts.map((p) => (
              <li key={p.id} style={{ marginBottom: 10 }}>
                <strong>{p.title}</strong>
                <div>{p.excerpt}</div>
                <div style={{ marginTop: 6 }}>
                  <button onClick={() => editPost(p)}>Editează</button>
                  <button onClick={() => handleDelete(p.id)} style={{ marginLeft: 8 }}>Șterge</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  )
}

export async function getServerSideProps({ req }) {
  const cookie = req.headers.cookie || ''
  const match = cookie.match(/(?:^|; )admin_auth=([^;]+)/)
  const provided = match ? match[1] : null
  const crypto = require('crypto')
  const configured = process.env.ADMIN_PASSWORD || ''
  const expected = crypto.createHash('sha256').update(configured).digest('hex')
  if (!provided || provided !== expected) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  return { props: {} }
}
