import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  }
})

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
})

export function parseJsonFields(fields: string[]) {
  return (req: any, _res: any, next: any) => {
    for (const field of fields) {
      if (typeof req.body[field] === 'string') {
        try {
          req.body[field] = JSON.parse(req.body[field])
        } catch {
          /* keep as string */
        }
      }
    }
    if (req.files && Array.isArray(req.files)) {
      req.body.images = (req.files as Express.Multer.File[]).map(
        f => `/uploads/${f.filename}`
      )
    }
    next()
  }
}
