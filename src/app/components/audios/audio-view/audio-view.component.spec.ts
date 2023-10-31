import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { of } from 'rxjs';
import { AudioViewComponent } from './audio-view.component';

describe('AudioViewComponent', () => {
  let component: AudioViewComponent;
  let fixture: ComponentFixture<AudioViewComponent>;
  let router: Router;

  const mockActivatedRoute = {
    snapshot: {
      params: {
        requestId: 12378,
      },
    },
  };

  describe('With audioRequestView', () => {
    const audioRequestService = {
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
      patchAudioRequestLastAccess: () => of(new HttpResponse<Response>({ status: 200 })),
      deleteAudioRequests: jest.fn(),
      downloadAudio: jest.fn(),
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AudioViewComponent, HttpClientTestingModule],
        providers: [
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: AudioRequestService, useValue: audioRequestService },
          { provide: Router, useValue: { navigate: jest.fn() } },
        ],
      });
      fixture = TestBed.createComponent(AudioViewComponent);
      component = fixture.componentInstance;
      router = TestBed.inject(Router) as jest.Mocked<Router>;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should navigate to /audios on successful deletion', () => {
      audioRequestService.deleteAudioRequests.mockReturnValue(of(null));
      component.requestId = 123;

      component.onDeleteConfirmed();

      expect(audioRequestService.deleteAudioRequests).toHaveBeenCalledWith(123);

      expect(router.navigate).toHaveBeenCalledWith(['/audios']);
    });

    it('should set isDeleting to false on deletion error', () => {
      const error = new HttpErrorResponse({ status: 500 });
      audioRequestService.deleteAudioRequests.mockReturnValue(of(error));
      component.requestId = 123;

      component.onDeleteConfirmed();

      expect(audioRequestService.deleteAudioRequests).toHaveBeenCalledWith(123);
      expect(component.isDeleting).toBe(false);
    });

    it('should download audio and call saveAs', () => {
      const mockBlob = new Blob(['audio data'], { type: 'audio/wav' });
      audioRequestService.downloadAudio.mockReturnValue(of(mockBlob));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const saveAsSpy = jest.spyOn(component as any, 'saveAs');

      component.onDownloadClicked();

      expect(audioRequestService.downloadAudio).toHaveBeenCalledWith(12378);

      expect(saveAsSpy).toHaveBeenCalledWith(mockBlob, 'T20200331.zip');
    });
  });

  describe('With audioRequestView set to null', () => {
    const audioRequestService = {
      audioRequestView: null,
      patchAudioRequestLastAccess: () => of(new HttpResponse<Response>({ status: 200 })),
      deleteAudioRequests: jest.fn(),
      downloadAudio: jest.fn(),
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AudioViewComponent, HttpClientTestingModule],
        providers: [
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: AudioRequestService, useValue: audioRequestService },
          { provide: Router, useValue: { navigate: jest.fn() } },
        ],
      });
      fixture = TestBed.createComponent(AudioViewComponent);
      component = fixture.componentInstance;
      router = TestBed.inject(Router) as jest.Mocked<Router>;
      fixture.detectChanges();
    });

    it('should navigate to /audios on null audioRequestView', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      fixture.detectChanges();

      expect(navigateSpy).toHaveBeenCalledWith(['/audios']);
    });
  });
});
