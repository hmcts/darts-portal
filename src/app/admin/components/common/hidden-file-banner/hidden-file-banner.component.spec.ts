import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenFileBanner } from '@admin-types/common/hidden-file-banner';
import { HiddenFileBannerComponent } from './hidden-file-banner.component';

describe('HiddenFileBannerComponent', () => {
  let component: HiddenFileBannerComponent;
  let fixture: ComponentFixture<HiddenFileBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiddenFileBannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HiddenFileBannerComponent);
    component = fixture.componentInstance;
    component.file = {
      id: 1,
      isHidden: true,
      isMarkedForManualDeletion: true,
      markedForManualDeletionBy: 'me',
      hiddenReason: 'because',
      ticketReference: 'refy ref',
      comments: 'commenty comment',
      fileType: 'audio_file',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('heading', () => {
    it('should return the correct heading when the file is marked for manual deletion', () => {
      component.file = { isMarkedForManualDeletion: true } as HiddenFileBanner;
      expect(component.heading).toBe('This file is hidden in DARTS and is marked for manual deletion');
    });

    it('should return the correct heading when the file is not marked for manual deletion', () => {
      component.file = { isMarkedForManualDeletion: false } as HiddenFileBanner;
      expect(component.heading).toBe('This file is hidden in DARTS');
    });
  });
});
