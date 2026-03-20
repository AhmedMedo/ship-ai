import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Runs on every matched request to protect routes and refresh sessions
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/signup'],
};
