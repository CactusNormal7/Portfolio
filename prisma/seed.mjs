// Seeds the database with the portfolio projects.
// Run with: node --env-file=.env prisma/seed.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PROJECTS = [
  {
    title: 'Regna',
    description: 'Chess evolved — cards, powers and evolution mechanics on top of classic chess. Monorepo with a pure TypeScript rules engine, a Nuxt 4 + PixiJS client (PWA) and a Fastify + Socket.IO realtime server.',
    tags: 'TypeScript,Nuxt,PixiJS,Socket.IO,Prisma',
    year: '2026',
    link: 'https://github.com/CactusNormal7/Regna',
    position: 0
  },
  {
    title: 'SmartKink',
    description: 'Full-stack community platform built as a team project. Nuxt 4, TypeScript and SCSS on the front, fully dockerized for deployment.',
    tags: 'Nuxt,TypeScript,SCSS,Docker',
    year: '2025',
    link: 'https://github.com/SmartKink/smartKink',
    position: 1
  },
  {
    title: 'ASCII Generator',
    description: 'A web tool that turns images and text into ASCII art, right in the browser.',
    tags: 'JavaScript,Canvas',
    year: '2025',
    link: 'https://github.com/CactusNormal7/ascii-generator',
    position: 2
  }
]

const existing = await prisma.project.count()
if (existing > 0) {
  console.log(`Skipping seed: ${existing} project(s) already in the database.`)
} else {
  await prisma.project.createMany({ data: PROJECTS })
  console.log(`Seeded ${PROJECTS.length} projects.`)
}

await prisma.$disconnect()
