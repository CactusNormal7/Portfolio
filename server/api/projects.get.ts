import { usePrisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  const projects = await usePrisma().project.findMany({
    orderBy: [{ position: 'asc' }, { id: 'desc' }]
  })

  return projects.map(project => ({
    ...project,
    tags: project.tags.split(',').map(t => t.trim()).filter(Boolean)
  }))
})
