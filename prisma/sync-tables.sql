-- Brings the public schema in line with prisma/schema.prisma. Safe to re-run.
--   1. drops every public table that is NOT listed in `wanted` (⚠ their data is lost)
--   2. creates missing tables
--   3. adds missing columns to existing tables
--   4. enables RLS (no policies → Supabase anon/REST key has no access; Prisma is unaffected)
--
-- Run it either in Supabase Dashboard → SQL Editor, or with `npm run db:sync`.
-- When adding a model to schema.prisma: add its name to `wanted` and its DDL below.

BEGIN;

-- 1. Drop tables that are no longer needed
DO $$
DECLARE
  wanted text[] := ARRAY['projects', 'messages', '_prisma_migrations'];
  t record;
BEGIN
  FOR t IN
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND NOT (tablename = ANY (wanted))
  LOOP
    RAISE NOTICE 'Dropping table public.%', t.tablename;
    EXECUTE format('DROP TABLE public.%I CASCADE', t.tablename);
  END LOOP;
END $$;

-- 2. Create missing tables
CREATE TABLE IF NOT EXISTS public.projects (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tags        TEXT NOT NULL DEFAULT '',
  year        TEXT NOT NULL DEFAULT '',
  link        TEXT NOT NULL DEFAULT '',
  image       TEXT NOT NULL DEFAULT '',
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.messages (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Add columns missing from tables created by an older version
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS tags        TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS year        TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS link        TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS image       TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS position    INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at  TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- 4. Lock down the Supabase REST API
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

COMMIT;
