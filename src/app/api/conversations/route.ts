// TODO: List/create conversations
export async function GET() {
  return Response.json({ conversations: [], total: 0, page: 1, limit: 20 });
}

export async function POST() {
  return Response.json({ error: 'Not implemented' }, { status: 501 });
}
