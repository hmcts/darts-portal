import { ActiveTabService } from './active-tab.service';

describe('ActiveTabService', () => {
  let service: ActiveTabService;

  beforeEach(() => {
    service = new ActiveTabService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setActiveTab', () => {
    it('should set the active tab for the given screenId', () => {
      service.setActiveTab('testScreenId', 'testTabName');
      expect(service.activeTabs()).toEqual({ testScreenId: 'testTabName' });
    });
  });

  describe('clearActiveTab', () => {
    it('should remove the tab for the given screenId', () => {
      service.setActiveTab('screen1', 'tab1');
      service.setActiveTab('screen2', 'tab2');

      expect(service.activeTabs()).toEqual({
        screen1: 'tab1',
        screen2: 'tab2',
      });

      service.clearActiveTab('screen1');

      expect(service.activeTabs()).toEqual({
        screen2: 'tab2',
      });
    });

    it('should do nothing if screenId does not exist', () => {
      service.setActiveTab('screen1', 'tab1');

      service.clearActiveTab('nonExistent');

      expect(service.activeTabs()).toEqual({
        screen1: 'tab1',
      });
    });
  });
});
