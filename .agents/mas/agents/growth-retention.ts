import type { Finding } from '../contracts';
export const growthRetentionAgent = {
  name: 'growth-retention',
  inspect(files: readonly string[], contents: Readonly<Record<string, string>>): Finding[] {
    const matches = files.filter((file) => /onboarding|retention|referral/i.test(contents[file] ?? ''));
    return matches.length ? [{ id: 'growth-touchpoint', agent: this.name, severity: 'info', title: 'Growth touchpoint detected', detail: 'Review the user journey and measurement plan.', files: matches.slice(0, 3), plannedAction: 'propose' }] : [];
  },
};
