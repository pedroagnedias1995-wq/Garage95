import type { Finding } from '../contracts';
export const dataSecurityAgent = {
  name: 'data-security',
  inspect(files: readonly string[], contents: Readonly<Record<string, string>>): Finding[] {
    const matches = files.filter((file) => /(api[_-]?key|secret|password)\s*[:=]\s*['"][^'"]+['"]/i.test(contents[file] ?? ''));
    return matches.length ? [{ id: 'security-inline-secret', agent: this.name, severity: 'error', title: 'Possible inline secret', detail: 'Move credentials to a protected runtime configuration.', files: matches.slice(0, 3), plannedAction: 'propose' }] : [];
  },
};
