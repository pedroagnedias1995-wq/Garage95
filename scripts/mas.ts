import { analyze } from '../.agents/mas/orchestrator';
import { writeReport, toMarkdown } from '../.agents/mas/report';
import { verifyPolicyDetails } from '../.agents/mas/rules';

const command = process.argv[2] ?? 'analyze';
const root = process.cwd();
const cliFiles = process.argv.slice(3).filter((argument) => argument !== '--files');
// Validation-only change for the GitHub Actions workflow.
const parseChangedFiles = (value: string): string[] => value
  .split(/[,\r\n]+/)
  .map((file) => file.trim())
  .filter(Boolean);
const selectedFiles = cliFiles.length
  ? cliFiles
  : (process.env.MAS_CHANGED_FILES ? parseChangedFiles(process.env.MAS_CHANGED_FILES) : undefined);
const runAnalysis = () => analyze(root, selectedFiles);
if (command === 'verify-policy') {
  const verification = verifyPolicyDetails(root);
  if (verification.valid) {
    console.log(`MAS policy verified. SHA-256: ${verification.actualHash}`);
  } else {
    console.error(`MAS policy verification failed: ${verification.error
      ? `unable to read ${verification.path}: ${verification.error}`
      : `SHA-256 mismatch for ${verification.path}. Expected ${verification.expectedHash}, got ${verification.actualHash}.`}`);
    process.exitCode = 1;
  }
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
