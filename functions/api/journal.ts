// ============================================
// Cloudflare Pages Function: /api/journal
// ============================================

interface Env {
  // DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  // TODO: SELECT * FROM journal_entries WHERE user_id = ? ORDER BY date DESC
  return Response.json({ data: [] });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json();
    if (!body.date || !body.emotionalState || !body.premarketPlan) {
      return Response.json(
        { error: 'Missing required fields: date, emotionalState, premarketPlan' },
        { status: 400 }
      );
    }
    // TODO: INSERT INTO journal_entries ...
    return Response.json({ data: { id: crypto.randomUUID(), ...body } }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json();
    if (!body.id) return Response.json({ error: 'Missing entry ID' }, { status: 400 });
    // TODO: UPDATE journal_entries SET ... WHERE id = ? AND user_id = ?
    return Response.json({ data: body });
  } catch (error) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'Missing entry ID' }, { status: 400 });
  // TODO: DELETE FROM journal_entries WHERE id = ? AND user_id = ?
  return Response.json({ data: { success: true } });
};
