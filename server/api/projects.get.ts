import { usePrisma, handleDbError } from '../utils/prisma'
import { isGenericRepoCard } from '../utils/github'

export default defineEventHandler(async () => {
  const projects = await usePrisma().project.findMany({
    orderBy: [{ position: 'asc' }, { id: 'desc' }]
  }).catch(handleDbError)

  return projects.map(project => ({
    ...project,
    // older imports stored GitHub's generic card; the site's own fallback looks better
    image: isGenericRepoCard(project.image) ? '' : project.image,
    tags: project.tags.split(',').map(t => t.trim()).filter(Boolean)
  }))
})
