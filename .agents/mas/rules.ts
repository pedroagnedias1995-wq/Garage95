import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Policy, ActionKind } from './contracts';

export const POLICY_SHA256 = '1ca19b6e3210e4cb13c73b8565ba85874a4993bd5d6079826f17cf54d3d42c90';
export const POLICY: Policy = Object.freeze({
  version: 1,
  mode: 'analysis-only',
  maxPlannedFiles: 3,
  protectedPaths: Object.freeze(['.agents/mas/policy.yaml', '.env', '.env.*', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']),
  checks: Object.freeze(['neutral-user', 'generic-avatar-fallback', 'mock-data', 'protected-paths', 'file-limit', 'tests-status', 'build-status']),
  allowedActions: Object.freeze(['inspect', 'report', 'propose'] as ActionKind[]),
  deniedActions: Object.freeze(['edit', 'delete', 'install', 'publish'] as ActionKind[]),
});

export interface PolicyVerification {
  readonly valid: boolean;
  readonly path: string;
  readonly expectedHash: string;
  readonly actualHash?: string;
  readonly error?: string;
}

export function verifyPolicyDetails(root: string): PolicyVerification {
  const path = join(root, '.agents', 'mas', 'policy.yaml');
  try {
    const current = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
    const actualHash = createHash('sha256').update(current).digest('hex');
    return { valid: actualHash === POLICY_SHA256, path, expectedHash: POLICY_SHA256, actualHash };
  } catch (error) {
    return {
      valid: false,
      path,
      expectedHash: POLICY_SHA256,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function verifyPolicy(root: string): boolean {
  return verifyPolicyDetails(root).valid;
}

export function isProtectedPath(path: string): boolean {
  return POLICY.protectedPaths.some((pattern) => pattern.endsWith('.*')
    ? path === pattern.slice(0, -2) || path.startsWith(`${pattern.slice(0, -1)}`)
    : path === pattern);
}

export function classifyAction(action: ActionKind): ActionKind {
  return POLICY.deniedActions.includes(action) ? 'propose' : action;
}
