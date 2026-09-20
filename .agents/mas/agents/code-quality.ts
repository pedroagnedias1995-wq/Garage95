import type { Finding } from '../contracts';

export const codeQualityAgent = {
  name: 'code-quality',
  inspect(files: readonly string[], contents: Readonly<Record<string, string>>): Finding[] {
    const findings: Finding[] = [];
    const matches = files.filter((file) => /\bTODO\b|\bFIXME\b/.test(contents[file] ?? ''));
    if (matches.length) findings.push({ id: 'code-quality-todos', agent: this.name, severity: 'info', title: 'Deferred code markers found', detail: 'Review TODO/FIXME markers before release.', files: matches.slice(0, 3), plannedAction: 'propose' });
    return findings;
  },
};
