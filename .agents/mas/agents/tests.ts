import type { Finding } from '../contracts';
export const testsAgent = {
  name: 'tests',
  inspect(files: readonly string[], contents: Readonly<Record<string, string>>): Finding[] {
    const hasTests = files.some((file) => /\.(test|spec)\.[jt]sx?$/.test(file));
    return hasTests ? [] : [{ id: 'tests-missing', agent: this.name, severity: 'warning', title: 'No test files detected', detail: 'Add focused tests for critical behavior.', files: [], plannedAction: 'propose' }];
  },
};
