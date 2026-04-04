import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { contacts } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (user.app_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const rows = await db
    .select()
    .from(contacts)
    .orderBy(desc(contacts.createdAt))
    .limit(100);

  return NextResponse.json({
    contacts: rows.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    })),
  });
}
