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
});
