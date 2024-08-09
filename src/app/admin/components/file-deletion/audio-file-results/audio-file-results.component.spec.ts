import { AudioFileMarkedDeletion } from '@admin-types/file-deletion/audio-file-marked-deletion.type';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { AudioFileResultsComponent } from './audio-file-results.component';

describe('AudioFileResultsComponent', () => {
  let component: AudioFileResultsComponent;
  let fixture: ComponentFixture<AudioFileResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioFileResultsComponent],
      providers: [
        { provide: UserAdminService, useValue: { hasMatchingUserId: jest.fn().mockReturnValue(false) } },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioFileResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the correct URL with the correct state', () => {
    const audioFile: AudioFileMarkedDeletion = {
      mediaId: 123,
      hiddenById: 1,
      startAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
      endAt: DateTime.fromISO('2022-01-01T01:00:00.000Z'),
      courthouse: '',
      courtroom: '',
      channel: 11,
      comments: '',
      ticketReference: '',
      reasonId: 3,
    };

    jest.spyOn(component.router, 'navigate');

    component.deleteAudioFile(audioFile);

    expect(component.router.navigate).toHaveBeenCalledWith(['/admin/file-deletion/audio-file', audioFile.mediaId], {
      state: { isPermitted: true },
    });
  });
});
