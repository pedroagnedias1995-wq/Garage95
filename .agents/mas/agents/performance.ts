import type { Finding } from '../contracts';
export const performanceAgent = {
  name: 'performance',
  inspect(files: readonly string[], contents: Readonly<Record<string, string>>): Finding[] {
    const matches = files.filter((file) => /setInterval\([^;]+,\s*0\)|while\s*\(\s*true\s*\)/.test(contents[file] ?? ''));
    return matches.length ? [{ id: 'performance-hot-loop', agent: this.name, severity: 'warning', title: 'Potential hot loop', detail: 'Inspect unbounded timer or loop usage.', files: matches.slice(0, 3), plannedAction: 'propose' }] : [];
  },
};
