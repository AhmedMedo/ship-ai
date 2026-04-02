#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════
# Seed demo users via Supabase GoTrue Admin API
# Run: bash scripts/seed-demo-users.sh
#
# Creates:
#   admin@ignitra.dev / admin123  (Admin, Pro plan)
#   user@ignitra.dev  / user123   (User, Free plan)
# ═══════════════════════════════════════════════════════════

set -euo pipefail

GOTRUE_URL="${GOTRUE_URL:-http://localhost:54321}"
SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU}"

echo "Creating demo users..."

# Create admin user
ADMIN_RESULT=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$GOTRUE_URL/admin/users" \
  -H "Content-Type: application/json" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -d '{"email":"admin@ignitra.dev","password":"admin123","email_confirm":true,"role":"authenticated","user_metadata":{"full_name":"Admin User"}}')

if [ "$ADMIN_RESULT" = "200" ]; then
  echo "✓ Admin user created: admin@ignitra.dev / admin123"
elif [ "$ADMIN_RESULT" = "422" ]; then
  echo "→ Admin user already exists, skipping"
else
  echo "✗ Failed to create admin user (HTTP $ADMIN_RESULT)"
fi

# Create regular user
USER_RESULT=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$GOTRUE_URL/admin/users" \
  -H "Content-Type: application/json" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -d '{"email":"user@ignitra.dev","password":"user123","email_confirm":true,"role":"authenticated","user_metadata":{"full_name":"Demo User"}}')

if [ "$USER_RESULT" = "200" ]; then
  echo "✓ Demo user created: user@ignitra.dev / user123"
elif [ "$USER_RESULT" = "422" ]; then
  echo "→ Demo user already exists, skipping"
else
  echo "✗ Failed to create demo user (HTTP $USER_RESULT)"
fi

# Ensure auth.users have correct role/aud (GoTrue Admin API sometimes leaves them empty)
echo "Setting auth roles..."
docker compose exec -T db psql -U postgres -d postgres -c "
  UPDATE auth.users SET role = 'authenticated', aud = 'authenticated' WHERE email IN ('admin@ignitra.dev', 'user@ignitra.dev') AND (role = '' OR role IS NULL);
  UPDATE profiles SET role = 'admin', plan_id = (SELECT id FROM plans WHERE slug = 'pro' LIMIT 1) WHERE email = 'admin@ignitra.dev';
" 2>/dev/null

echo ""
echo "Done! Test credentials:"
echo "  Admin:  admin@ignitra.dev / admin123  → /admin"
echo "  User:   user@ignitra.dev  / user123   → /dashboard"
