import { useEffect, useState } from 'react'
import Layout from '../components/Layout'

export default function Admin() {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState({ id: '', title: '', excerpt: '', content: '', category: '', tags: '', author: '', date: '', image: '' })

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    const r = await fetch('/api/posts')
    const data = await r.json()
    setPosts(data)
  }

  function editPost(p) {
    setForm({ id: p.id, title: p.title, excerpt: p.excerpt, content: p.content, category: (p.categories && p.categories[0]) || '', tags: (p.tags || []).join(', '), author: p.author || '', date: p.date ? (new Date(p.date)).toISOString().slice(0,10) : '', image: p.image || '' })
  }

  function resetForm() {
    setForm({ id: '', title: '', excerpt: '', content: '', category: '', tags: '', author: '', date: '', image: '' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      id: form.id,
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      image: form.image,
      categories: form.category ? [form.category] : [],
      tags: form.tags ? form.tags.split(',').map(t=>t.trim()).filter(Boolean) : [],
      author: form.author,
      date: form.date
    }
    if (form.id) {
      await fetch('/api/posts', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload), credentials: 'same-origin' })
    } else {
      await fetch('/api/posts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload), credentials: 'same-origin' })
    }
    resetForm()
    fetchPosts()
  }

  async function handleFileChange(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    const r = await fetch('/api/upload', { method: 'POST', body: fd })
    if (!r.ok) return alert('Upload failed')
    const data = await r.json()
    setForm({ ...form, image: data.url })
  }

  async function handleDelete(id) {
    if (!confirm('Ștergi acest articol?')) return
    const r = await fetch('/api/posts', { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }), credentials: 'same-origin' })
    if (!r.ok) {
      const err = await r.json().catch(()=>({ error: 'Unknown' }))
      return alert('Ștergere eșuată: ' + (err.error || r.status))
    }
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
              <label>Autor</label>
              <br />
              <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} style={{ width: '100%' }} />
            </div>
            <div>
              <label>Data publicării</label>
              <br />
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={{ width: '100%' }} />
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
            <div>
              <label>Imagine (optional)</label>
              <br />
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {form.image ? <div style={{ marginTop: 6 }}><img src={form.image} alt="preview" style={{ maxWidth: 200 }} /></div> : null}
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
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {p.image ? <img src={p.image} alt="thumb" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6 }} /> : null}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{p.title}</div>
                    <div style={{ color: '#9aa4b2' }}>{p.excerpt}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button className="primary" onClick={() => editPost(p)}>Editează</button>
                    <button className="ghost" onClick={() => handleDelete(p.id)}>Șterge</button>
                  </div>
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
