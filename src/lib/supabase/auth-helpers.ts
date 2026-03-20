import { redirect } from 'next/navigation';
import { createClient } from './server';

// Get the currently authenticated user (server-side)
// Returns null if not authenticated
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Get the current user's profile with plan data
// Returns null if not authenticated
export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, plan:plans(*)')
    .eq('id', user.id)
    .single();

  return profile;
}

// Require authentication — redirects to /login if not authenticated
// Use in Server Components and Server Actions
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

// Require admin role — redirects to /dashboard if not admin
// Use in admin Server Components and Server Actions
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return user;
}
