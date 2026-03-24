// ============================================
// Cloudflare Pages Function: /api/journal
// ============================================

import { type Env, hasDatabase, ok, err } from '../lib/db';
import { journalRepo, validateCreateJournal } from '../lib/repositories/journal';

const getUserId = (_ctx: EventContext<Env, string, unknown>) => 'dev';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);
  if (!hasDatabase(context.env)) return ok(journalRepo.getMockList(), { mock: true });

  try {
    const entries = await journalRepo.list(context.env.DB!, userId);
    return ok(entries);
  } catch (e) {
    console.error('[/api/journal GET]', e);
    return err('Failed to fetch journal entries');
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);
  let body: Record<string, unknown>;
  try { body = await context.request.json() as Record<string, unknown>; }
  catch { return err('Invalid JSON body', 400); }

  const validationError = validateCreateJournal(body);
  if (validationError) return err(validationError, 400);

  if (!hasDatabase(context.env)) {
    return ok({ id: crypto.randomUUID(), ...body }, { mock: true }, 201);
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
    return ok(entry, undefined, 201);
  } catch (e) {
    console.error('[/api/journal POST]', e);
    return err('Failed to create journal entry');
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);
  let body: Record<string, unknown>;
  try { body = await context.request.json() as Record<string, unknown>; }
  catch { return err('Invalid JSON body', 400); }

  if (!body.id || typeof body.id !== 'string') return err('Missing or invalid entry ID', 400);
  if (!hasDatabase(context.env)) return ok(body, { mock: true });

  try {
    const entry = await journalRepo.update(context.env.DB!, userId, body.id as string, body);
    if (!entry) return err('Journal entry not found', 404);
    return ok(entry);
  } catch (e) {
    console.error('[/api/journal PUT]', e);
    return err('Failed to update journal entry');
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return err('Missing entry ID query parameter', 400);
  if (!hasDatabase(context.env)) return ok({ success: true }, { mock: true });

  try {
    const success = await journalRepo.delete(context.env.DB!, userId, id);
    if (!success) return err('Journal entry not found', 404);
    return ok({ success: true });
  } catch (e) {
    console.error('[/api/journal DELETE]', e);
    return err('Failed to delete journal entry');
  }
};
