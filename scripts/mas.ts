import { analyze } from '../.agents/mas/orchestrator';
import { writeReport, toMarkdown } from '../.agents/mas/report';
import { verifyPolicy } from '../.agents/mas/rules';

const command = process.argv[2] ?? 'analyze';
const root = process.cwd();
const cliFiles = process.argv.slice(3).filter((argument) => argument !== '--files');
const parseChangedFiles = (value: string): string[] => value
  .split(/[,\r\n]+/)
  .map((file) => file.trim())
  .filter(Boolean);
const selectedFiles = cliFiles.length
  ? cliFiles
  : (process.env.MAS_CHANGED_FILES ? parseChangedFiles(process.env.MAS_CHANGED_FILES) : undefined);
const runAnalysis = () => analyze(root, selectedFiles);
if (command === 'verify-policy') {
  const valid = verifyPolicy(root);
  console.log(valid ? 'MAS policy verified.' : 'MAS policy verification failed.');
  process.exitCode = valid ? 0 : 1;
} else if (command === 'report') {
  const report = runAnalysis();
  const paths = writeReport(report, root);
  console.log(`Wrote ${paths.markdown} and ${paths.json}`);
} else if (command === 'analyze') {
  console.log(toMarkdown(runAnalysis()));
} else if (command === 'test') {
  const report = runAnalysis();
  console.log(JSON.stringify(report, null, 2));
  const blockingChecks = report.checks.filter((check) => check.name === 'tests-status' || check.name === 'build-status');
  process.exitCode = blockingChecks.some((check) => check.status === 'fail') ? 1 : 0;
} else {
  console.error('Usage: mas analyze|report|verify-policy|test');
  process.exitCode = 2;
}
