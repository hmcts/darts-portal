// import the utils as before
import {
  installGlobalErrorListenersOnce,
  isChunkOrDynamicImportFailure,
  looksLikeHashedScript,
} from '@utils/global-error-listeners';

describe('installGlobalErrorListenersOnce', () => {
  let handlers: Record<string, Array<(ev: Event) => void>>;

  beforeEach(() => {
    sessionStorage.clear();

    // safely reset the global flag
    (window as unknown as { __chunkErrListenersInstalled?: boolean }).__chunkErrListenersInstalled = undefined;

    handlers = {};

    jest
      .spyOn(window, 'addEventListener')
      .mockImplementation((type: string, listener: EventListenerOrEventListenerObject): void => {
        const fn: (ev: Event) => void =
          typeof listener === 'function' ? (ev: Event) => listener(ev) : (ev: Event) => listener.handleEvent(ev);

        if (!handlers[type]) handlers[type] = [];
        handlers[type].push(fn);
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('is idempotent (adds listeners only once)', () => {
    const addSpy = jest.spyOn(window, 'addEventListener');

    const cb = jest.fn();
    installGlobalErrorListenersOnce(cb);
    installGlobalErrorListenersOnce(cb); // should no-op

    const errorAdds = addSpy.mock.calls.filter((c) => c[0] === 'error');
    const rejectionAdds = addSpy.mock.calls.filter((c) => c[0] === 'unhandledrejection');
    expect(errorAdds.length).toBe(1);
    expect(rejectionAdds.length).toBe(1);
  });

  it('triggers onDetected once when an ErrorEvent matches', () => {
    const cb = jest.fn();
    installGlobalErrorListenersOnce(cb);

    // Manually invoke the captured error handler
    const errEv = new ErrorEvent('error', { message: 'ChunkLoadError: Loading chunk 123 failed.' });
    handlers['error'][0](errEv);

    expect(cb).toHaveBeenCalledTimes(1);

    const guard = JSON.parse(sessionStorage.getItem('chunkReloadGuard') || '{"count":0,"ts":0}');
    expect(guard.count).toBe(1);
    expect(typeof guard.ts).toBe('number');
  });

  it('respects the 60s guard: after two quick triggers, third call does not increment count', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1_000_000);

    const msg = 'Failed to fetch dynamically imported module';

    const getLastHandler = (type: keyof WindowEventMap): ((ev: Event) => void) =>
      handlers[type][handlers[type].length - 1] as (ev: Event) => void;

    // 1st install + trigger
    const cb1 = jest.fn();
    installGlobalErrorListenersOnce(cb1);
    getLastHandler('error')(new ErrorEvent('error', { message: msg }));
    expect(cb1).toHaveBeenCalledTimes(1);

    let guard = JSON.parse(sessionStorage.getItem('chunkReloadGuard') || '{"count":0,"ts":0}');
    expect(guard.count).toBe(1);

    // 2nd install + trigger within 60s
    (window as unknown as { __chunkErrListenersInstalled?: boolean }).__chunkErrListenersInstalled = undefined;

    const cb2 = jest.fn();
    installGlobalErrorListenersOnce(cb2);
    getLastHandler('error')(new ErrorEvent('error', { message: msg }));
    expect(cb2).toHaveBeenCalledTimes(1);

    guard = JSON.parse(sessionStorage.getItem('chunkReloadGuard') || '{"count":0,"ts":0}');
    expect(guard.count).toBe(2);

    // 3rd install + trigger within 60s, should not increment
    (window as unknown as { __chunkErrListenersInstalled?: boolean }).__chunkErrListenersInstalled = undefined;

    const cb3 = jest.fn();
    installGlobalErrorListenersOnce(cb3);
    getLastHandler('error')(new ErrorEvent('error', { message: msg }));
    expect(cb3).toHaveBeenCalledTimes(1);

    guard = JSON.parse(sessionStorage.getItem('chunkReloadGuard') || '{"count":0,"ts":0}');
    expect(guard.count).toBe(2); // unchanged
  });

  it('installGlobalErrorListenersOnce: triggers on unhandledrejection', () => {
    const cb = jest.fn();
    installGlobalErrorListenersOnce(cb);

    // Simulate a Promise rejection event-like object;
    const rejectionLike = { reason: new Error('net::ERR_CONNECTION_ABORTED') };

    // invoke the captured unhandledrejection handler
    const lastUnhandled = handlers['unhandledrejection'][handlers['unhandledrejection'].length - 1];
    lastUnhandled(rejectionLike as unknown as Event);

    expect(cb).toHaveBeenCalledTimes(1);
    const guard = JSON.parse(sessionStorage.getItem('chunkReloadGuard') || '{"count":0,"ts":0}');
    expect(guard.count).toBe(1);
  });

  it('installGlobalErrorListenersOnce: readGuard catches bad JSON', () => {
    // Write malformed JSON so readGuard hits the catch path
    sessionStorage.setItem('chunkReloadGuard', '{not-json');

    const cb = jest.fn();
    installGlobalErrorListenersOnce(cb);

    // Fire an error that matches a covered pattern
    const errEv = new ErrorEvent('error', { message: 'Loading chunk 42 failed.' });
    // invoke the captured handler
    (handlers['error'][handlers['error'].length - 1] as (e: Event) => void)(errEv);

    expect(cb).toHaveBeenCalledTimes(1);
    const guard = JSON.parse(sessionStorage.getItem('chunkReloadGuard') || '{"count":0,"ts":0}');
    expect(guard.count).toBe(1);
    expect(typeof guard.ts).toBe('number');
  });

  it('looksLikeHashedScript: negative query/hash variants', () => {
    expect(looksLikeHashedScript('/main.js?ver=abc')).toBe(false);
    expect(looksLikeHashedScript('/vendor.js#123')).toBe(false);
  });

  it('isChunkOrDynamicImportFailure: event has target but not a hashed <script>', () => {
    // target is a SCRIPT but src doesn't look hashed -> false
    const script = document.createElement('script');
    script.src = '/scripts/app.js';
    const eventWithPlainScript = { target: script } as unknown as Event;
    expect(isChunkOrDynamicImportFailure(eventWithPlainScript)).toBe(false);

    // target is not a script (e.g., IMG) -> false
    const img = document.createElement('img');
    img.src = '/assets/pic.png';
    const eventWithImg = { target: img } as unknown as Event;
    expect(isChunkOrDynamicImportFailure(eventWithImg)).toBe(false);
  });
});
