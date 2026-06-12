import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import cloudinary from 'cloudinary'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }

  // store uploads outside the Next.js project to avoid file-watcher reload loops
  const uploadDir = path.join(process.cwd(), '..', 'stiri_uploads')
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
  })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'upload_failed' })
      return
    }
    let file = files.file || files.image
    if (!file) {
      res.status(400).json({ error: 'no_file' })
      return
    }
    if (Array.isArray(file)) file = file[0]
    const filepath = file.filepath || file.path
    const fileName = path.basename(filepath)
    // If Cloudinary is configured, upload there and remove local copy
    try {
      if (process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME) {
        // Configure cloudinary from CLOUDINARY_URL or env vars
        cloudinary.v2.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        })
        const result = await cloudinary.v2.uploader.upload(filepath, { folder: 'stiri' })
        // remove local temporary file
        try { fs.unlinkSync(filepath) } catch (e) {}
        res.status(200).json({ url: result.secure_url })
        return
      }
    } catch (e) {
      // fallthrough to local serve
      console.error('Cloudinary upload failed', e.message || e)
    }

    // serve via API to avoid exposing project file changes
    const url = `/api/uploads/${fileName}`
    res.status(200).json({ url })
  })
}
