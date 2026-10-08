# Portfolio — Jules Besson

Personal portfolio built with Nuxt 4, Prisma and Supabase Postgres.
Projects and contact messages live in the database and are managed from a password-protected backoffice at `/admin`.

## Setup

```bash
npm install
cp .env.example .env   # then fill in the values
```

`.env` needs:

- `DATABASE_URL` / `DIRECT_URL` — from Supabase Dashboard → Connect → ORMs → Prisma
- `NUXT_ADMIN_PASSWORD` — backoffice password (defaults to `admin` if unset — always set it in production)

Create the tables and seed the projects:

```bash
npx prisma migrate deploy
node --env-file=.env prisma/seed.mjs
```

## Development

```bash
npm run dev       # http://localhost:3000
```

## Production

```bash
npm run build
node --env-file=.env .output/server/index.mjs
```
