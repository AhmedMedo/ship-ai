import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Creates a Supabase client for use in Next.js middleware
// Handles session refresh by reading/writing cookies on the request/response
//
// IMPORTANT: Uses NEXT_PUBLIC_SUPABASE_URL so cookie names match the browser client.
// Overrides fetch to route requests to the internal Docker URL (SUPABASE_URL).
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const internalUrl = process.env.SUPABASE_URL;

  const supabase = createServerClient(
    publicUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
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

  // Refresh the session — this keeps the auth cookie alive
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes: redirect to /login if not authenticated
  // TODO: Remove DEV_SKIP_AUTH bypass before production
  const skipAuth = process.env.DEV_SKIP_AUTH === 'true';
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user && !skipAuth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin routes: redirect non-admins to /dashboard
  // Role is stored in app_metadata (set via GoTrue Admin API, included in JWT)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (user.app_metadata?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Redirect logged-in users away from auth pages
  if (
    (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') &&
    user
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}
