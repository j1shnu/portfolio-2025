export interface TerminalLine {
  readonly id: string;
  readonly type: 'input' | 'output' | 'error' | 'system';
  readonly content: string;
}

export interface CommandResult {
  readonly type: 'output' | 'error' | 'clear' | 'navigate' | 'open';
  readonly lines: readonly string[];
  readonly target?: string;
  readonly url?: string;
}
