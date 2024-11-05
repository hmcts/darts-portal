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

  it('should emit deletion event when deleteAudioFile is called', () => {
    const audioFile: AudioFileMarkedDeletion = {
      mediaId: 123,
      courthouse: 'Courthouse A',
      startAt: DateTime.fromISO('2023-01-01'),
      endAt: DateTime.fromISO('2023-01-03'),
      courtroom: 'Room 1',
      channel: 11,
      markedHiddenBy: 'User A',
      comments: 'Test comment',
      hiddenById: 0,
      ticketReference: '',
      reasonId: 0,
    };

    jest.spyOn(component.deletion, 'emit');

    component.deleteAudioFile(audioFile);

    expect(component.deletion.emit).toHaveBeenCalledWith(audioFile);
  });
});
