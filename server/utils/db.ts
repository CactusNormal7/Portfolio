import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import Database from 'better-sqlite3'

let db: Database.Database | null = null

const SEED_PROJECTS = [
  {
    title: 'Regna',
    description: 'Chess evolved — cards, powers and evolution mechanics on top of classic chess. Monorepo with a pure TypeScript rules engine, a Nuxt 4 + PixiJS client (PWA) and a Fastify + Socket.IO realtime server.',
    tags: 'TypeScript,Nuxt,PixiJS,Socket.IO,Prisma',
    year: '2026',
    link: 'https://github.com/CactusNormal7/Regna'
  },
  {
    title: 'SmartKink',
    description: 'Full-stack community platform built as a team project. Nuxt 4, TypeScript and SCSS on the front, fully dockerized for deployment.',
    tags: 'Nuxt,TypeScript,SCSS,Docker',
    year: '2025',
    link: 'https://github.com/SmartKink/smartKink'
  },
  {
    title: 'ASCII Generator',
    description: 'A web tool that turns images and text into ASCII art, right in the browser.',
    tags: 'JavaScript,Canvas',
    year: '2025',
    link: 'https://github.com/CactusNormal7/ascii-generator'
  }
]

export function useDb (): Database.Database {
  if (db) return db

  const dir = join(process.cwd(), '.data')
  mkdirSync(dir, { recursive: true })
  db = new Database(join(dir, 'portfolio.db'))
  db.pragma('journal_mode = WAL')

  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '',
      year TEXT NOT NULL DEFAULT '',
      link TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      position INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)

  const count = db.prepare('SELECT COUNT(*) AS n FROM projects').get() as { n: number }
  if (count.n === 0) {
    const insert = db.prepare(
      'INSERT INTO projects (title, description, tags, year, link, position) VALUES (?, ?, ?, ?, ?, ?)'
    )
    SEED_PROJECTS.forEach((p, i) => insert.run(p.title, p.description, p.tags, p.year, p.link, i))
  }

  return db
}
