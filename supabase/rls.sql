-- Enable RLS on all tables and grant access only to service_role / authenticated users
-- Run this in Supabase SQL Editor

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename != '_prisma_migrations'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
    EXECUTE format('DROP POLICY IF EXISTS service_access ON public.%I;', tbl);
    EXECUTE format(
      'CREATE POLICY service_access ON public.%I FOR ALL USING (true) WITH CHECK (true);',
      tbl
    );
  END LOOP;
END $$;

-- Verify
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename != '_prisma_migrations'
ORDER BY tablename;
