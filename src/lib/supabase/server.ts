import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Server client for use in Server Components, Route Handlers, and Server Actions
// Manages session via httpOnly cookies through next/headers
export async function createClient() {
  const cookieStore = await cookies();

  // Server-side uses SUPABASE_URL (Docker internal) if available, falls back to public URL
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;

  return createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll is called from a Server Component where cookies can't be set.
            // This is safe to ignore if middleware is refreshing the session.
          }
        },
      },
    },
  );
}
