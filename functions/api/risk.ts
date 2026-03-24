// ============================================
// Cloudflare Pages Function: /api/risk
// ============================================

import { type Env, hasDatabase, ok, err } from '../lib/db';
import { riskRepo, validateRiskUpdate } from '../lib/repositories/risk';

const getUserId = (_ctx: EventContext<Env, string, unknown>) => 'dev';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);
  if (!hasDatabase(context.env)) return ok(riskRepo.getMock(), { mock: true });

  try {
    const settings = await riskRepo.get(context.env.DB!, userId);
    return ok(settings);
  } catch (e) {
    console.error('[/api/risk GET]', e);
    return err('Failed to fetch risk settings');
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);
  let body: Record<string, unknown>;
  try { body = await context.request.json() as Record<string, unknown>; }
  catch { return err('Invalid JSON body', 400); }

  const validationError = validateRiskUpdate(body);
  if (validationError) return err(validationError, 400);

  if (!hasDatabase(context.env)) return ok({ ...riskRepo.getMock(), ...body }, { mock: true });

  try {
    const settings = await riskRepo.upsert(context.env.DB!, userId, body as any);
    return ok(settings);
  } catch (e) {
    console.error('[/api/risk PUT]', e);
    return err('Failed to update risk settings');
  }
};
