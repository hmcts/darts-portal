import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { of } from 'rxjs';
import { AudioViewComponent } from './audio-view.component';

describe('AudioViewComponent', () => {
  let component: AudioViewComponent;
  let fixture: ComponentFixture<AudioViewComponent>;

  const mockActivatedRoute = {
    snapshot: {
      params: {
        requestId: 111,
      },
    },
  };

  const fakeAudioRequestService = {
    audioRequestView: {
      caseId: 6,
      caseNumber: 'T20200331',
      courthouse: 'Liverpool',
      hearingDate: '2023-10-04Z',
      startTime: '2023-08-21T09:00:00Z',
      endTime: '2023-08-21T10:00:00Z',
      requestId: 12378,
      expiry: '2023-08-23T09:00:00Z',
      status: 'COMPLETED',
    },
    patchAudioRequestLastAccess: () => of(),
    getDownloadUrl: () => 'api/download',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AudioViewComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AudioRequestService, useValue: fakeAudioRequestService },
      ],
    });
    fixture = TestBed.createComponent(AudioViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
