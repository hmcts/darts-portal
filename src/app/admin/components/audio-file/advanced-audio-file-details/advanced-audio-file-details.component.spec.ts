import { AudioFile } from '@admin-types/index';
import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { AdvancedAudioFileDetailsComponent } from './advanced-audio-file-details.component';

describe('AdvancedAudioFileDetailsComponent', () => {
  let component: AdvancedAudioFileDetailsComponent;
  let fixture: ComponentFixture<AdvancedAudioFileDetailsComponent>;

  const mockAudioFile = {
    mediaObjectId: 'media_12345',
    contentObjectId: 'content_67890',
    clipId: 'clip_101112',
    checksum: 'checksum_abcdef',
    mediaStatus: 'Available',
    isCurrent: true,
    isHidden: false,
    isDeleted: false,
    adminAction: {
      hiddenById: 1,
      hiddenByName: 'Admin User',
      hiddenAt: '2024-06-11T07:55:18.404Z',
      markedForManualDeletionAt: '2024-06-11T07:55:18.404Z',
      markedForManualDeletionById: 2,
      markedForManualDeletionBy: 'Another Admin',
    },
    version: 'v1.0',
    chronicleId: 'chronicle_456',
    antecedentId: 'antecedent_789',
    retainUntil: '2024-12-31T23:59:59.000Z',
    createdAt: '2024-06-01T12:30:00.000Z',
    createdBy: 'John Doe',
    createdById: 100,
    lastModifiedAt: '2024-06-02T14:00:00.000Z',
    lastModifiedBy: 'Jane Smith',
    lastModifiedById: 101,
  } as unknown as AudioFile;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedAudioFileDetailsComponent, RouterLink],
      providers: [DatePipe, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedAudioFileDetailsComponent);
    component = fixture.componentInstance;
    component.audioFile = mockAudioFile;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('isAdmin check', () => {
    it('should show "Show Versions" link when isAdmin is true', () => {
      component.isAdmin = true;
      fixture.detectChanges();

      const link = fixture.debugElement.query(By.css('#version-link'));
      expect(link).toBeTruthy();
      expect(link.nativeElement.textContent.trim()).toBe('Show versions');
    });

    it('should not show "Show Versions" link when isAdmin is false', () => {
      component.isAdmin = false;
      fixture.detectChanges();

      const link = fixture.debugElement.query(By.css('#version-link'));
      expect(link).toBeNull();
    });
  });
});
