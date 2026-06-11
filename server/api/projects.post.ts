import { useDb } from '../utils/db'
import { requireAdmin } from '../utils/auth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  if (!body?.title?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  }

  const db = useDb()
  const result = db
    .prepare(
      `INSERT INTO projects (title, description, tags, year, link, image, position)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      String(body.title).trim(),
      String(body.description ?? ''),
      String(body.tags ?? ''),
      String(body.year ?? ''),
      String(body.link ?? ''),
      String(body.image ?? ''),
      Number(body.position ?? 0)
    )

  return { id: Number(result.lastInsertRowid) }
})
