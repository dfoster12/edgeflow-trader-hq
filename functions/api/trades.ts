// ============================================
// Cloudflare Pages Function: /api/trades
// ============================================
// Real CRUD via D1, with mock fallback when DB binding is absent.
//
// Cloudflare Binding Required:
//   DB: D1Database — set in wrangler.toml [[d1_databases]] or Dashboard

import type { Env } from '../lib/db';
import { hasDatabase } from '../lib/db';
import { tradesRepo } from '../lib/repositories/trades';

// TODO: Replace with real authenticated user ID from your auth system
const getUserId = (_context: EventContext<Env, string, unknown>) => 'dev';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);

  if (!hasDatabase(context.env)) {
    return Response.json({ data: tradesRepo.getMockList(), meta: { mock: true } });
  }

  try {
    const trades = await tradesRepo.list(context.env.DB!, userId);
    return Response.json({ data: trades, meta: { total: trades.length } });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch trades' }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);

  let body: Record<string, unknown>;
  try {
    body = await context.request.json() as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.symbol || !body.side || !body.entry || !body.exit || !body.size) {
    return Response.json(
      { error: 'Missing required fields: symbol, side, entry, exit, size' },
      { status: 400 },
    );
  }

  if (!hasDatabase(context.env)) {
    const pnl = (Number(body.exit) - Number(body.entry)) * Number(body.size) * (body.side === 'Long' ? 1 : -1);
    return Response.json({
      data: { id: crypto.randomUUID(), ...body, pnl, status: 'Closed' },
      meta: { mock: true },
    }, { status: 201 });
  }

  try {
    const trade = await tradesRepo.create(context.env.DB!, userId, {
      symbol: body.symbol as string,
      setup: (body.setup as string) || '',
      side: body.side as string,
      entry: Number(body.entry),
      exit: Number(body.exit),
      size: Number(body.size),
      stopLoss: body.stopLoss ? Number(body.stopLoss) : undefined,
      target: body.target ? Number(body.target) : undefined,
      session: (body.session as string) || '',
      notes: (body.notes as string) || '',
      tags: body.tags as string[] | undefined,
    });
    return Response.json({ data: trade }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to create trade' }, { status: 500 });
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);

  let body: Record<string, unknown>;
  try {
    body = await context.request.json() as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.id) {
    return Response.json({ error: 'Missing trade ID' }, { status: 400 });
  }

  if (!hasDatabase(context.env)) {
    return Response.json({ data: body, meta: { mock: true } });
  }

  try {
    const trade = await tradesRepo.update(context.env.DB!, userId, body.id as string, body);
    if (!trade) return Response.json({ error: 'Trade not found' }, { status: 404 });
    return Response.json({ data: trade });
  } catch (error) {
    return Response.json({ error: 'Failed to update trade' }, { status: 500 });
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');

  if (!id) return Response.json({ error: 'Missing trade ID' }, { status: 400 });

  if (!hasDatabase(context.env)) {
    return Response.json({ data: { success: true }, meta: { mock: true } });
  }

  try {
    const success = await tradesRepo.delete(context.env.DB!, userId, id);
    if (!success) return Response.json({ error: 'Trade not found' }, { status: 404 });
    return Response.json({ data: { success: true } });
  } catch (error) {
    return Response.json({ error: 'Failed to delete trade' }, { status: 500 });
  }
};
