-- Set passwords for Supabase service roles
-- This runs after the built-in init scripts via /etc/postgresql.schema.sql
ALTER ROLE supabase_auth_admin WITH LOGIN PASSWORD 'postgres';
ALTER ROLE authenticator WITH LOGIN PASSWORD 'postgres';
ALTER ROLE supabase_storage_admin WITH LOGIN PASSWORD 'postgres';
ALTER ROLE supabase_admin WITH PASSWORD 'postgres';
