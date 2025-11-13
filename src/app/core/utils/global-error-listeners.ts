interface WindowWithChunkFlag extends Window {
  __chunkErrListenersInstalled?: boolean;
}

export const CHUNK_ERROR_PATTERNS: ReadonlyArray<RegExp> = [
  /ChunkLoadError/i,
  /Loading chunk [\w-]+ failed/i,
  /error loading dynamically imported module/i,
  /Failed to fetch dynamically imported module/i,
  /Failed to load module script:.*MIME type/i,
  /net::ERR_(ABORTED|CONNECTION|NETWORK|FAILED|HTTP2.*)/i,
];

export function looksLikeHashedScript(src: string): boolean {
  return /(\/|^)(main|polyfills|runtime|vendor|chunk)-[A-Z0-9]+\.m?js(\?.*)?$/i.test(src);
}

export function extractEventOrErrorMessage(input: unknown): string {
  if (typeof input === 'string') return input;

  // Error / ErrorEvent
  if (input && typeof input === 'object') {
    const asAnyObj = input as { message?: unknown; reason?: { message?: unknown } };
    if (typeof asAnyObj.message === 'string') return asAnyObj.message;
    if (asAnyObj.reason && typeof asAnyObj.reason.message === 'string') return asAnyObj.reason.message;
  }
  try {
    return JSON.stringify(input);
  } catch {
    return String(input);
  }
}

export function isChunkOrDynamicImportFailure(errOrEvent: unknown): boolean {
  const msg = extractEventOrErrorMessage(errOrEvent);
  if (CHUNK_ERROR_PATTERNS.some((rx) => rx.test(msg))) return true;

  // Check for <script> target on Event shapes
  if (
    errOrEvent &&
    typeof errOrEvent === 'object' &&
    'target' in errOrEvent &&
    (errOrEvent as Event).target instanceof HTMLScriptElement
  ) {
    const script = (errOrEvent as Event).target as HTMLScriptElement;
    if (typeof script.src === 'string' && looksLikeHashedScript(script.src)) {
      return true;
    }
  }
  return false;
}

interface ReloadGuard {
  count: number;
  ts: number;
}

function readGuard(): ReloadGuard {
  try {
    const raw = sessionStorage.getItem('chunkReloadGuard');
    if (!raw) return { count: 0, ts: 0 };
    const parsed = JSON.parse(raw) as Partial<ReloadGuard>;
    return {
      count: typeof parsed.count === 'number' ? parsed.count : 0,
      ts: typeof parsed.ts === 'number' ? parsed.ts : 0,
    };
  } catch {
    return { count: 0, ts: 0 };
  }
}

function writeGuard(value: ReloadGuard): void {
  try {
    sessionStorage.setItem('chunkReloadGuard', JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function installGlobalErrorListenersOnce(onDetected: () => void): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const w = window as WindowWithChunkFlag;
  if (w.__chunkErrListenersInstalled) return;
  w.__chunkErrListenersInstalled = true;

  let reloading = false;
  const trigger = (): void => {
    if (reloading) return;
    reloading = true;

    const now = Date.now();
    const guard = readGuard();
    if (now - guard.ts < 60_000 && guard.count >= 2) {
      onDetected();
      return;
    }
    writeGuard({ count: guard.count + 1, ts: now });
    onDetected();
  };

  const onWindowError = (ev: ErrorEvent): void => {
    if (isChunkOrDynamicImportFailure(ev)) trigger();
  };
  const onRejection = (ev: PromiseRejectionEvent): void => {
    if (isChunkOrDynamicImportFailure(ev)) trigger();
  };

  window.addEventListener('error', onWindowError, true);
  window.addEventListener('unhandledrejection', onRejection);
}
