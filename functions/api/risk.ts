// ============================================
// Cloudflare Pages Function: /api/risk
// ============================================

import type { Env } from '../lib/db';
import { hasDatabase } from '../lib/db';
import { riskRepo } from '../lib/repositories/risk';

const getUserId = (_ctx: EventContext<Env, string, unknown>) => 'dev';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);
  if (!hasDatabase(context.env)) {
    return Response.json({ data: riskRepo.getMock(), meta: { mock: true } });
  }
  try {
    const settings = await riskRepo.get(context.env.DB!, userId);
    return Response.json({ data: settings });
  } catch { return Response.json({ error: 'Failed to fetch risk settings' }, { status: 500 }); }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);
  let body: Record<string, unknown>;
  try { body = await context.request.json() as Record<string, unknown>; }
  catch { return Response.json({ error: 'Invalid request body' }, { status: 400 }); }

  if (!hasDatabase(context.env)) return Response.json({ data: { ...riskRepo.getMock(), ...body }, meta: { mock: true } });

  try {
    const settings = await riskRepo.upsert(context.env.DB!, userId, body as any);
    return Response.json({ data: settings });
  } catch { return Response.json({ error: 'Failed to update risk settings' }, { status: 500 }); }
};
