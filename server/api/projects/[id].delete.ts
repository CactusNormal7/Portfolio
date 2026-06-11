import { useDb } from '../../utils/db'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler((event) => {
  requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  const result = useDb().prepare('DELETE FROM projects WHERE id = ?').run(id)

  if (result.changes === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }
  return { ok: true }
})
