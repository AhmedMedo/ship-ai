// TODO: Auth middleware — see AUTH_AND_BILLING.md
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/signup'],
};
