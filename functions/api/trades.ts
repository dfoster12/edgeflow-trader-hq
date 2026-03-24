// ============================================
// Cloudflare Pages Function: /api/trades
// ============================================
// D1 Binding: DB (see functions/lib/db.ts for setup instructions)
// Auth: TODO — replace getUserId() with real auth

import { type Env, hasDatabase, ok, err } from '../lib/db';
import { tradesRepo, validateCreateTrade } from '../lib/repositories/trades';

// AUTH TODO: Extract authenticated user ID from request headers / JWT
const getUserId = (_ctx: EventContext<Env, string, unknown>) => 'dev';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);

  if (!hasDatabase(context.env)) {
    return ok(tradesRepo.getMockList(), { mock: true });
  }

  try {
    const trades = await tradesRepo.list(context.env.DB!, userId);
    return ok(trades, { total: trades.length });
  } catch (e) {
    console.error('[/api/trades GET]', e);
    return err('Failed to fetch trades');
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);

  let body: Record<string, unknown>;
  try { body = await context.request.json() as Record<string, unknown>; }
  catch { return err('Invalid JSON body', 400); }

  const validationError = validateCreateTrade(body);
  if (validationError) return err(validationError, 400);

  if (!hasDatabase(context.env)) {
    const pnl = (Number(body.exit) - Number(body.entry)) * Number(body.size) * (body.side === 'Long' ? 1 : -1);
    return ok({ id: crypto.randomUUID(), ...body, pnl, status: 'Closed' }, { mock: true }, 201);
  }

  try {
    const trade = await tradesRepo.create(context.env.DB!, userId, {
      symbol: body.symbol as string,
      setup: (body.setup as string) || '',
      side: body.side as 'Long' | 'Short',
      entry: Number(body.entry),
      exit: Number(body.exit),
      size: Number(body.size),
      stopLoss: body.stopLoss != null ? Number(body.stopLoss) : undefined,
      target: body.target != null ? Number(body.target) : undefined,
      session: (body.session as string) || '',
      notes: (body.notes as string) || '',
      tags: body.tags as string[] | undefined,
    });
    return ok(trade, undefined, 201);
  } catch (e) {
    console.error('[/api/trades POST]', e);
    return err('Failed to create trade');
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);

  let body: Record<string, unknown>;
  try { body = await context.request.json() as Record<string, unknown>; }
  catch { return err('Invalid JSON body', 400); }

  if (!body.id || typeof body.id !== 'string') return err('Missing or invalid trade ID', 400);

  if (!hasDatabase(context.env)) return ok({ ...body }, { mock: true });

  try {
    const trade = await tradesRepo.update(context.env.DB!, userId, body.id as string, body);
    if (!trade) return err('Trade not found', 404);
    return ok(trade);
  } catch (e) {
    console.error('[/api/trades PUT]', e);
    return err('Failed to update trade');
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return err('Missing trade ID query parameter', 400);

  if (!hasDatabase(context.env)) return ok({ success: true }, { mock: true });

  try {
    const success = await tradesRepo.delete(context.env.DB!, userId, id);
    if (!success) return err('Trade not found', 404);
    return ok({ success: true });
  } catch (e) {
    console.error('[/api/trades DELETE]', e);
    return err('Failed to delete trade');
  }
};
