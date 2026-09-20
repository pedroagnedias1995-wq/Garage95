export type Severity = 'info' | 'warning' | 'error';
export type ActionKind = 'inspect' | 'report' | 'propose' | 'edit' | 'delete' | 'install' | 'publish';
export type FindingStatus = 'aplicado' | 'aguardando aprovação' | 'bloqueado' | 'informativo';

export interface Policy {
  readonly version: number;
  readonly mode: 'analysis-only';
  readonly maxPlannedFiles: number;
  readonly protectedPaths: readonly string[];
  readonly checks: readonly string[];
  readonly allowedActions: readonly ActionKind[];
  readonly deniedActions: readonly ActionKind[];
}

export interface Finding {
  readonly id: string;
  readonly agent: string;
  readonly severity: Severity;
  readonly title: string;
  readonly detail: string;
  readonly files: readonly string[];
  readonly plannedAction: ActionKind;
  readonly status?: FindingStatus;
  readonly priority?: 'P0' | 'P1' | 'P2' | 'P3';
  readonly effort?: 'baixo' | 'médio' | 'alto';
  readonly diffSummary?: string;
}

export interface CheckStatus {
  readonly name: string;
  readonly status: 'pass' | 'warn' | 'fail' | 'not-run';
  readonly detail: string;
}

export interface MasReport {
  readonly schemaVersion: 1;
  readonly generatedAt: string;
  readonly root: string;
  readonly policy: { readonly version: number; readonly mode: string; readonly verified: boolean };
  readonly findings: readonly Finding[];
  readonly checks: readonly CheckStatus[];
  readonly plannedFiles: readonly string[];
  readonly actionSummary: Readonly<Record<ActionKind, number>>;
}
