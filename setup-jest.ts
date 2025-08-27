import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

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

setupZoneTestEnv();
