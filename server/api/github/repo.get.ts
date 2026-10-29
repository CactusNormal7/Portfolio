import { requireAdmin } from '../../utils/auth'
import { fetchRepo, parseRepoUrl } from '../../utils/github'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const { url } = getQuery(event)
  const parsed = parseRepoUrl(String(url ?? ''))
  if (!parsed) {
    throw createError({ statusCode: 400, statusMessage: 'Not a valid GitHub repository link' })
  }
  return fetchRepo(parsed.owner, parsed.repo)
})
