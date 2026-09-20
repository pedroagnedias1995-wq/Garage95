import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Policy, ActionKind } from './contracts';

export const POLICY_SHA256 = '4efe5d559af573ea39005d5b8950ef09a4b5991d9f27af75138de4638ae8f668';
export const POLICY: Policy = Object.freeze({
  version: 1,
  mode: 'analysis-only',
  maxPlannedFiles: 3,
  protectedPaths: Object.freeze(['.agents/mas/policy.yaml', '.env', '.env.*', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']),
  checks: Object.freeze(['neutral-user', 'generic-avatar-fallback', 'mock-data', 'protected-paths', 'file-limit', 'tests-status', 'build-status']),
  allowedActions: Object.freeze(['inspect', 'report', 'propose'] as ActionKind[]),
  deniedActions: Object.freeze(['edit', 'delete', 'install', 'publish'] as ActionKind[]),
});

export function verifyPolicy(root: string): boolean {
  const current = readFileSync(join(root, '.agents', 'mas', 'policy.yaml'), 'utf8');
  return createHash('sha256').update(current).digest('hex') === POLICY_SHA256;
}

export function isProtectedPath(path: string): boolean {
  return POLICY.protectedPaths.some((pattern) => pattern.endsWith('.*')
    ? path === pattern.slice(0, -2) || path.startsWith(`${pattern.slice(0, -1)}`)
    : path === pattern);
}

export function classifyAction(action: ActionKind): ActionKind {
  return POLICY.deniedActions.includes(action) ? 'propose' : action;
}
