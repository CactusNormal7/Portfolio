import { requireAdmin } from '../../utils/auth'
import { fetchUserRepos, GITHUB_USER } from '../../utils/github'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const { user } = getQuery(event)
  return fetchUserRepos(String(user || GITHUB_USER).trim())
})
