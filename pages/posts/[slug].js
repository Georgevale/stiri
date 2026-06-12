import Layout from '../../components/Layout'
import fs from 'fs'
import path from 'path'

export default function PostPage({ post }) {
  if (!post) {
    return (
      <Layout>
        <h1>Articolul nu a fost găsit</h1>
      </Layout>
    )
  }

  return (
    <Layout>
      <article>
        <h1>{post.title}</h1>
        <div style={{ color: '#666', marginBottom: 10 }}>{(post.categories||[]).join(', ')} {post.tags && post.tags.length ? '· Tags: ' + post.tags.join(', ') : ''}</div>
        <p><em>{post.excerpt}</em></p>
        <div style={{ whiteSpace: 'pre-wrap' }}>{post.content}</div>
      </article>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { slug } = context.params
  const dataFile = path.join(process.cwd(), 'data', 'posts.json')
  let posts = []
  try {
    const raw = fs.readFileSync(dataFile, 'utf8')
    posts = JSON.parse(raw)
  } catch (e) {
    posts = []
  }

  const post = posts.find(p => p.slug === slug) || null

  if (!post) {
    return { props: { post: null } }
  }

  return { props: { post } }
}
