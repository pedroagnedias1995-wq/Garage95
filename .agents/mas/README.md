# Multi-Agent System (MAS)

MAS is a deterministic, dependency-free review layer for Garage 95. It is **analysis-only**: agents inspect source, classify proposed actions, and produce reports; they never edit, delete, install, or publish.

```bash
npm run mas:analyze       # print a markdown report
npm run mas:report        # write .agents/mas/reports/latest.{md,json}
npm run mas:verify-policy # verify the immutable policy fingerprint
npm run mas:test          # emit JSON and fail when test/build checks fail
```

CI should pass the PR file list through `MAS_CHANGED_FILES` as a comma-separated
list (or pass paths after the command with `--files`). Without that input, the
local fallback scans supported source files so the agents remain useful outside
Git-based CI.

The policy checks neutral/demo users (`NEUTRAL_USER`), generic avatars, mock data, protected paths, a three-file planning limit, and test/build script availability. `policy.yaml` is fingerprinted by `rules.ts`; intentional policy changes require updating the architecture review and fingerprint together. CI can invoke `npm run mas:analyze` through the adapter command in `policy.yaml`; no repository metadata is assumed.
