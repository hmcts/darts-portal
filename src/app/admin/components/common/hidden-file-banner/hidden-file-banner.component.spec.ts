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

  describe('onHideOrDelete', () => {
    it('should navigate to the hide-or-delete page with the correct state', () => {
      const routerSpy = jest.spyOn(component.router, 'navigate');
      component.onHideOrDelete();
      expect(routerSpy).toHaveBeenCalledWith(['admin/file', 1, 'hide-or-delete'], {
        state: { fileType: 'audio_file' },
      });
    });
  });

  describe('is not hidden', () => {
    beforeEach(() => {
      if (component.file) {
        component.file.isHidden = false;
      }
      fixture.detectChanges();
    });

    it('should not render the banner', () => {
      const banner = fixture.nativeElement.querySelector('app-notification-banner');
      expect(banner).toBeNull();
    });
  });

  describe('is hidden and not marked for deletion', () => {
    beforeEach(() => {
      if (component.file) {
        component.file.isHidden = true;
        component.file.isMarkedForManualDeletion = false;
      }
      fixture.detectChanges();
    });

    it('should render the banner', () => {
      const banner = fixture.nativeElement.querySelector('app-notification-banner');
      expect(banner).toBeTruthy();
    });

    it('render title', () => {
      const title = fixture.nativeElement.querySelector('app-notification-banner');
      expect(title.textContent).toContain('This file is hidden in DARTS');
    });

    it('should render the correct message', () => {
      const message = fixture.nativeElement.querySelector('app-notification-banner');
      expect(message.textContent).toContain('DARTS users cannot view this file. You can unhide the file');
    });

    it('should render the correct details', () => {
      const details = fixture.nativeElement.querySelector('app-notification-banner');
      expect(details.textContent).toContain('Reason - because');
      expect(details.textContent).toContain('refy ref - commenty comment');
    });
  });

  describe('is hidden and marked for deletion', () => {
    beforeEach(() => {
      if (component.file) {
        component.file.isHidden = true;
        component.file.isMarkedForManualDeletion = true;
      }
      fixture.detectChanges();
    });

    it('render banner', () => {
      const banner = fixture.nativeElement.querySelector('app-notification-banner');
      expect(banner).toBeTruthy();
    });

    it('render title', () => {
      const title = fixture.nativeElement.querySelector('app-notification-banner');
      expect(title.textContent).toContain('This file is hidden in DARTS and is marked for manual deletion');
    });

    it('should render the correct message', () => {
      const message = fixture.nativeElement.querySelector('app-notification-banner');
      expect(message.textContent).toContain(
        'DARTS user cannot view this file. You can unmark for deletion and it will no longer be hidden.'
      );
    });

    it('should render the correct details', () => {
      const details = fixture.nativeElement.querySelector('app-notification-banner');
      expect(details.textContent).toContain('Marked for manual deletion by - me');
      expect(details.textContent).toContain('Reason - because');
      expect(details.textContent).toContain('refy ref - commenty comment');
    });
  });
});
