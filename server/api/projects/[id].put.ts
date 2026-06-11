import { useDb } from '../../utils/db'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  if (!body?.title?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  }

  const db = useDb()
  const result = db
    .prepare(
      `UPDATE projects
       SET title = ?, description = ?, tags = ?, year = ?, link = ?, image = ?, position = ?
       WHERE id = ?`
    )
    .run(
      String(body.title).trim(),
      String(body.description ?? ''),
      String(body.tags ?? ''),
      String(body.year ?? ''),
      String(body.link ?? ''),
      String(body.image ?? ''),
      Number(body.position ?? 0),
      id
    )

  if (result.changes === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }
  return { ok: true }
})
