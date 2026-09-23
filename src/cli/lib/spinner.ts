/**
 * Lightweight CLI spinner / step progress for long-running update tasks.
 * Falls back to plain log lines when stdout is not a TTY.
 */

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export class Spinner {
  private timer: ReturnType<typeof setInterval> | null = null;
  private frame = 0;
  private label = '';
  private startedAt = 0;
  private readonly isTty: boolean;

  constructor() {
    this.isTty = Boolean(process.stdout.isTTY);
  }

  start(label: string): void {
    this.stopSilent();
    this.label = label;
    this.startedAt = Date.now();
    this.frame = 0;
    if (!this.isTty) {
      process.stdout.write(`… ${label}\n`);
      return;
    }
    this.timer = setInterval(() => {
      const elapsed = ((Date.now() - this.startedAt) / 1000).toFixed(1);
      const spin = FRAMES[this.frame % FRAMES.length];
      this.frame += 1;
      process.stdout.write(`\r\x1b[K${spin} ${this.label}  (${elapsed}s)`);
    }, 80);
  }

  /** Update label while spinning */
  text(label: string): void {
    this.label = label;
    if (!this.isTty) {
      process.stdout.write(`… ${label}\n`);
    }
  }

  succeed(msg?: string): void {
    const elapsed = ((Date.now() - this.startedAt) / 1000).toFixed(1);
    this.stopSilent();
    const line = msg ?? this.label;
    process.stdout.write(`\r\x1b[K✓ ${line}  (${elapsed}s)\n`);
  }

  fail(msg?: string): void {
    const elapsed = ((Date.now() - this.startedAt) / 1000).toFixed(1);
    this.stopSilent();
    const line = msg ?? this.label;
    process.stderr.write(`\r\x1b[K✗ ${line}  (${elapsed}s)\n`);
  }

  stopSilent(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.isTty) {
      process.stdout.write('\r\x1b[K');
    }
  }
}

export function stepBanner(step: number, total: number, title: string): void {
  const bar = '─'.repeat(40);
  console.log('');
  console.log(`${bar}`);
  console.log(`  [${step}/${total}] ${title}`);
  console.log(`${bar}`);
}
