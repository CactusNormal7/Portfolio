import { useDb } from '../utils/db'

export interface ProjectRow {
  id: number
  title: string
  description: string
  tags: string
  year: string
  link: string
  image: string
  position: number
  created_at: string
}

export default defineEventHandler(() => {
  const db = useDb()
  const rows = db
    .prepare('SELECT * FROM projects ORDER BY position ASC, id DESC')
    .all() as ProjectRow[]

  return rows.map(row => ({
    ...row,
    tags: row.tags.split(',').map(t => t.trim()).filter(Boolean)
  }))
})
