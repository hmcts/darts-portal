jest.mock('@ministryofjustice/frontend', () => {
  class MockDatePicker {
    constructor(el: HTMLElement) {
      el.setAttribute('data-initialised', 'true');
    }
  }

  return {
    DatePicker: MockDatePicker,
    initAll: jest.fn(),
  };
});

async function setupTests(): Promise<void> {
  // Node server tests must not load Angular's browser-specific Zone setup.
  if (typeof window !== 'undefined') {
    const { setupZoneTestEnv } = await import('jest-preset-angular/setup-env/zone');
    setupZoneTestEnv();
  }
}

// Jest awaits CommonJS setup functions before running each test file.
export = setupTests;
