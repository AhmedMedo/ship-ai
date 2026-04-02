import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Server client for use in Server Components, Route Handlers, and Server Actions
// Manages session via httpOnly cookies through next/headers
//
// IMPORTANT: Uses NEXT_PUBLIC_SUPABASE_URL so cookie names match the browser client.
// Overrides fetch to route requests to the internal Docker URL (SUPABASE_URL) when
// available, so the container doesn't need to reach localhost ports on the host.
export async function createClient() {
  const cookieStore = await cookies();

  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const internalUrl = process.env.SUPABASE_URL;

  return createServerClient(
    publicUrl,
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
      // Route requests to internal Docker URL while keeping cookie names consistent
      ...(internalUrl && internalUrl !== publicUrl
        ? {
            global: {
              fetch: (input: RequestInfo | URL, init?: RequestInit) => {
                const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
                const rewritten = url.replace(publicUrl, internalUrl);
                return fetch(rewritten, init);
              },
            },
          }
        : {}),
    },
  );
}
