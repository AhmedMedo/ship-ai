import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Creates a Supabase client for use in Next.js middleware
// Handles session refresh by reading/writing cookies on the request/response
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Middleware runs server-side — use internal Docker URL if available
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const supabase = createServerClient(
    supabaseUrl,
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
    },
  );

  // Refresh the session — this keeps the auth cookie alive
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes: redirect to /login if not authenticated
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin routes: redirect non-admins to /dashboard
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role !== 'admin') {
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
