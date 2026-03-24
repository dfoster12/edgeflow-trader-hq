// ============================================
// Cloudflare Pages Function: /api/journal
// ============================================

import type { Env } from '../lib/db';
import { hasDatabase } from '../lib/db';
import { journalRepo } from '../lib/repositories/journal';

const getUserId = (_ctx: EventContext<Env, string, unknown>) => 'dev';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);
  if (!hasDatabase(context.env)) {
    return Response.json({ data: journalRepo.getMockList(), meta: { mock: true } });
  }
  try {
    const entries = await journalRepo.list(context.env.DB!, userId);
    return Response.json({ data: entries });
  } catch { return Response.json({ error: 'Failed to fetch journal entries' }, { status: 500 }); }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);
  let body: Record<string, unknown>;
  try { body = await context.request.json() as Record<string, unknown>; }
  catch { return Response.json({ error: 'Invalid request body' }, { status: 400 }); }

  if (!body.date || !body.emotionalState || !body.premarketPlan) {
    return Response.json({ error: 'Missing required fields: date, emotionalState, premarketPlan' }, { status: 400 });
  }

  if (!hasDatabase(context.env)) {
    return Response.json({ data: { id: crypto.randomUUID(), ...body }, meta: { mock: true } }, { status: 201 });
  }

  try {
    const entry = await journalRepo.create(context.env.DB!, userId, {
      date: body.date as string,
      emotionalState: body.emotionalState as string,
      premarketPlan: body.premarketPlan as string,
      postmarketReview: (body.postmarketReview as string) || '',
      marketNotes: (body.marketNotes as string) || '',
      lessons: (body.lessons as string) || '',
      tags: body.tags as string[] | undefined,
    });
    return Response.json({ data: entry }, { status: 201 });
  } catch { return Response.json({ error: 'Failed to create journal entry' }, { status: 500 }); }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);
  let body: Record<string, unknown>;
  try { body = await context.request.json() as Record<string, unknown>; }
  catch { return Response.json({ error: 'Invalid request body' }, { status: 400 }); }
  if (!body.id) return Response.json({ error: 'Missing entry ID' }, { status: 400 });

  if (!hasDatabase(context.env)) return Response.json({ data: body, meta: { mock: true } });

  try {
    const entry = await journalRepo.update(context.env.DB!, userId, body.id as string, body);
    if (!entry) return Response.json({ error: 'Entry not found' }, { status: 404 });
    return Response.json({ data: entry });
  } catch { return Response.json({ error: 'Failed to update journal entry' }, { status: 500 }); }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'Missing entry ID' }, { status: 400 });

  if (!hasDatabase(context.env)) return Response.json({ data: { success: true }, meta: { mock: true } });

  try {
    const ok = await journalRepo.delete(context.env.DB!, userId, id);
    if (!ok) return Response.json({ error: 'Entry not found' }, { status: 404 });
    return Response.json({ data: { success: true } });
  } catch { return Response.json({ error: 'Failed to delete journal entry' }, { status: 500 }); }
};
