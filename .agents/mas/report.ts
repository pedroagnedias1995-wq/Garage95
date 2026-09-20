import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { MasReport } from './contracts';

export function toMarkdown(report: MasReport): string {
  const lines = [`# MAS analysis report`, '', `- Generated: ${report.generatedAt}`, `- Mode: **${report.policy.mode}**`, `- Policy verified: **${report.policy.verified ? 'yes' : 'no'}**`, '', '## Checks', ''];
  report.checks.forEach((check) => lines.push(`- **${check.status.toUpperCase()}** ${check.name}: ${check.detail}`));
  lines.push('', '## Findings', '');
  if (!report.findings.length) lines.push('No findings.');
  lines.push('| Problema | Agente | Ação/status | Prioridade | Esforço | Evidência |', '|---|---|---|---|---|---|');
  report.findings.forEach((finding) => lines.push(`| ${finding.title} — ${finding.detail} | ${finding.agent} | ${finding.plannedAction} / ${finding.status ?? 'informativo'} | ${finding.priority ?? 'P2'} | ${finding.effort ?? 'baixo'} | ${finding.files.length ? finding.files.join(', ') : 'nenhuma'} |`));
  if (report.findings.length) lines.push('', '### Diff e ações', '', ...report.findings.map((finding) => `- \`${finding.id}\`: ${finding.diffSummary ?? 'Nenhuma alteração registrada.'}`));
  lines.push('', '## Planned files', '', report.plannedFiles.length ? report.plannedFiles.map((file) => `- \`${file}\``).join('\n') : 'None');
  return `${lines.join('\n')}\n`;
}

export function writeReport(report: MasReport, root: string): { markdown: string; json: string } {
  const directory = join(root, '.agents', 'mas', 'reports');
  mkdirSync(directory, { recursive: true });
  const markdown = join(directory, 'latest.md');
  const json = join(directory, 'latest.json');
  writeFileSync(markdown, toMarkdown(report), 'utf8');
  writeFileSync(json, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return { markdown, json };
}
