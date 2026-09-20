import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { POLICY, classifyAction, isProtectedPath, verifyPolicy } from './rules';
import type { ActionKind, CheckStatus, Finding, MasReport } from './contracts';
import { codeQualityAgent } from './agents/code-quality';
import { performanceAgent } from './agents/performance';
import { uxDesignAgent } from './agents/ux-design';
import { dataSecurityAgent } from './agents/data-security';
import { growthRetentionAgent } from './agents/growth-retention';
import { testsAgent } from './agents/tests';

const ignored = new Set(['node_modules', '.git', 'www', 'platforms', 'dist', 'coverage', '.agents']);
const agents = [codeQualityAgent, performanceAgent, uxDesignAgent, dataSecurityAgent, growthRetentionAgent, testsAgent];

function sourceFiles(root: string): string[] {
  const output: string[] = [];
  const visit = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (ignored.has(entry.name) || entry.name.startsWith('.')) continue;
      const absolute = join(directory, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else if (/\.(ts|tsx|js|jsx|json|css|html|yaml|yml)$/.test(entry.name)) output.push(relative(root, absolute).replace(/\\/g, '/'));
    }
  };
  visit(root);
  return output.sort();
}

function gitDiffFiles(root: string, args: readonly string[]): string[] {
  try {
    return execFileSync('git', ['diff', '--name-only', ...args], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .split(/\r?\n/)
      .map((file) => file.trim().replace(/\\/g, '/'))
      .filter(Boolean);
  } catch {
    return [];
  }
}

function inferChangedFiles(root: string): { files: string[]; source: string } {
  const baseRef = process.env.GITHUB_BASE_REF;
  if (baseRef) {
    const files = gitDiffFiles(root, [`origin/${baseRef}...HEAD`]);
    if (files.length) return { files, source: `origin/${baseRef}...HEAD` };
  }

  const stagedFiles = gitDiffFiles(root, ['--cached']);
  if (stagedFiles.length) return { files: stagedFiles, source: 'staged changes' };

  const workingTreeFiles = gitDiffFiles(root, ['HEAD']);
  if (workingTreeFiles.length) return { files: workingTreeFiles, source: 'working tree changes' };

  return { files: [], source: 'no diff inferred' };
}

export function analyze(root: string = process.cwd(), selectedFiles?: readonly string[]): MasReport {
  const hasExplicitSelection = Boolean(selectedFiles?.length);
  const inferred = hasExplicitSelection ? null : inferChangedFiles(root);
  const candidateFiles = hasExplicitSelection
    ? [...selectedFiles!]
    : inferred!.files.length
      ? inferred!.files
      : sourceFiles(root).filter((file) => !isProtectedPath(file));
  const files = candidateFiles.filter((file) => existsSync(join(root, file)));
  const contents: Record<string, string> = {};
  for (const file of files) contents[file] = readFileSync(join(root, file), 'utf8');
  const findings: Finding[] = [];
  for (const agent of agents) findings.push(...agent.inspect(files, contents));
  const neutralFiles = files.filter((file) => /\bNEUTRAL_USER\b|neutral-demo-user|Conteúdo de demonstração/.test(contents[file] ?? ''));
  const avatarFiles = files.filter((file) => /avatar\s*[:=]\s*['"]['"]|generic avatar|default avatar/i.test(contents[file] ?? ''));
  const mockFiles = files.filter((file) => /mockData|mock data|fixture/i.test(contents[file] ?? ''));
  const protectedTouched = files.filter(isProtectedPath);
  if (neutralFiles.length) findings.push({ id: 'neutral-user', agent: 'policy', severity: 'warning', title: 'Neutral user or demo identity detected', detail: 'Replace generic identity in production paths or explicitly gate it to demo mode.', files: neutralFiles.slice(0, 3), plannedAction: 'propose' });
  if (avatarFiles.length) findings.push({ id: 'generic-avatar', agent: 'policy', severity: 'warning', title: 'Generic avatar fallback detected', detail: 'Ensure fallback avatars are intentional and accessible.', files: avatarFiles.slice(0, 3), plannedAction: 'propose' });
  if (mockFiles.length) findings.push({ id: 'mock-data', agent: 'policy', severity: 'info', title: 'Mock data detected', detail: 'Confirm mock data cannot reach production builds.', files: mockFiles.slice(0, 3), plannedAction: 'propose' });
  if (protectedTouched.length) findings.push({ id: 'protected-paths', agent: 'policy', severity: 'error', title: 'Protected paths are in the analysis set', detail: 'No autonomous action may target protected paths.', files: protectedTouched, plannedAction: 'inspect' });
  const packageJson = existsSync(join(root, 'package.json')) ? JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) : {};
  const scripts = packageJson.scripts ?? {};
  const allPlannedFiles = [...new Set(findings.flatMap((finding) => finding.files).filter((file) => !isProtectedPath(file)))].sort();
  const normalizedFindings = findings.map((finding) => ({
    ...finding,
    status: finding.severity === 'error'
      ? 'aguardando aprovação' as const
      : finding.plannedAction === 'propose'
        ? 'aguardando aprovação' as const
        : 'informativo' as const,
    priority: finding.severity === 'error' ? 'P0' as const : finding.severity === 'warning' ? 'P1' as const : 'P2' as const,
    effort: finding.files.length > 2 ? 'alto' as const : finding.files.length ? 'médio' as const : 'baixo' as const,
    diffSummary: finding.plannedAction === 'propose'
      ? 'Nenhuma alteração aplicada; revisão manual necessária.'
      : 'Nenhuma alteração aplicada.',
  }));
  const checks: CheckStatus[] = [
    { name: 'policy', status: verifyPolicy(root) ? 'pass' : 'fail', detail: verifyPolicy(root) ? 'Policy hash verified.' : 'policy.yaml differs from the immutable policy.' },
    {
      name: 'diff-inference',
      status: hasExplicitSelection || inferred!.files.length ? 'pass' : 'warn',
      detail: hasExplicitSelection
        ? 'Changed files supplied explicitly.'
        : inferred!.files.length
          ? `${files.length} changed file(s) inferred from ${inferred!.source}.`
          : 'No diff was inferred; falling back to supported source files for compatibility.',
    },
    { name: 'protected-paths', status: protectedTouched.length ? 'fail' : 'pass', detail: protectedTouched.length ? `${protectedTouched.length} protected path(s) found.` : 'No protected paths selected.' },
    { name: 'file-limit', status: allPlannedFiles.length > POLICY.maxPlannedFiles ? 'fail' : 'pass', detail: `${allPlannedFiles.length} planned file(s); limit is ${POLICY.maxPlannedFiles}.` },
    { name: 'tests-status', status: scripts.test ? 'not-run' : 'warn', detail: scripts.test ? `Available: ${scripts.test}` : 'No test script configured.' },
    { name: 'build-status', status: scripts.build ? 'not-run' : 'warn', detail: scripts.build ? `Available: ${scripts.build}` : 'No build script configured.' },
  ];
  const actionSummary = { inspect: 0, report: 0, propose: 0, edit: 0, delete: 0, install: 0, publish: 0 } as Record<ActionKind, number>;
  normalizedFindings.forEach((finding) => { actionSummary[classifyAction(finding.plannedAction)] += 1; });
  return { schemaVersion: 1, generatedAt: new Date().toISOString(), root, policy: { version: POLICY.version, mode: POLICY.mode, verified: checks[0].status === 'pass' }, findings: normalizedFindings, checks, plannedFiles: allPlannedFiles.slice(0, POLICY.maxPlannedFiles), actionSummary };
}
