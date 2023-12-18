import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppConfigService } from '@services/app-config/app-config.service';
import { AudioPlayerComponent } from './audio-player.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { of } from 'rxjs';
import { ErrorMessageService } from '@services/error/error-message.service';

describe('AudioPlayerComponent', () => {
  let fixture: ComponentFixture<AudioPlayerComponent>;
  let component: AudioPlayerComponent;

  const appConfigServiceMock = {
    getAppConfig: () => ({
      appInsightsKey: 'XXXXXXXX',
      support: {
        name: 'DARTS support',
        emailAddress: 'support@darts',
      },
    }),
  };

  const audioRequestServiceMock = {
    getAudioPreview: jest.fn(() => of(new Blob(['audio data'], { type: 'audio/wav' }))),
    downloadAudio: jest.fn(() => of(new Blob(['audio data'], { type: 'audio/wav' }))),
  };

  describe('No Errors', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AudioPlayerComponent, HttpClientTestingModule],
        providers: [
          { provide: AppConfigService, useValue: appConfigServiceMock },
          { provide: AudioRequestService, useValue: audioRequestServiceMock },
        ],
      });

      fixture = TestBed.createComponent(AudioPlayerComponent);
      component = fixture.componentInstance;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('display loading message while waiting for canplay event', () => {
      component.id = 1;

      fixture.detectChanges();

      const loadingMessage = fixture.debugElement.query(By.css('#loading'));

      expect(loadingMessage.nativeElement.textContent).toContain('Loading audio... Please wait');
    });

    it('hide the audio player until canplay event is fired', () => {
      component.id = 1;

      fixture.detectChanges();
      const audioPlayer = fixture.debugElement.query(By.css('audio'));

      expect(audioPlayer.nativeElement.hasAttribute('hidden')).toBeTruthy();

      audioPlayer.triggerEventHandler('canplay', null);
      fixture.detectChanges();

      expect(audioPlayer.nativeElement.hasAttribute('hidden')).toBeFalsy();
    });

    describe('#setPlayTime', () => {
      it('should set the play time', () => {
        component.id = 1;
        component.canPlay = true;

        fixture.detectChanges();
        const audioPlayer = fixture.debugElement.query(By.css('audio'));

        audioPlayer.triggerEventHandler('canplay', null);
        component.setPlayTime(10, true);

        expect(audioPlayer.nativeElement.currentTime).toEqual(10);
      });

      it('should play the audio if shouldPlay is true', () => {
        component.id = 1;
        component.canPlay = true;

        fixture.detectChanges();
        const audioPlayer = fixture.debugElement.query(By.css('audio'));

        jest.spyOn(audioPlayer.nativeElement, 'play');

        audioPlayer.triggerEventHandler('canplay', null);
        component.setPlayTime(10, true);

        fixture.detectChanges();

        expect(audioPlayer.nativeElement.play).toHaveBeenCalled();
      });

      it('should pause the audio if shouldPlay is false', () => {
        component.id = 1;
        component.canPlay = true;

        fixture.detectChanges();
        const audioPlayer = fixture.debugElement.query(By.css('audio'));

        jest.spyOn(audioPlayer.nativeElement, 'pause');

        audioPlayer.triggerEventHandler('canplay', null);
        component.setPlayTime(10, false);

        fixture.detectChanges();

        expect(audioPlayer.nativeElement.pause).toHaveBeenCalled();
      });

      it('should pause the audio if pausePlayer function called', () => {
        component.id = 1;

        fixture.detectChanges();
        const audioPlayer = fixture.debugElement.query(By.css('audio'));

        jest.spyOn(audioPlayer.nativeElement, 'pause');

        component.pausePlayer();
        expect(audioPlayer.nativeElement.pause).toHaveBeenCalled();
      });
    });

    describe('#onTimeUpdate', () => {
      it('should emit the play time', () => {
        jest.spyOn(component.playTime, 'emit');
        component.id = 1;
        component.canPlay = true;

        fixture.detectChanges();
        const audioPlayer = fixture.debugElement.query(By.css('audio'));

        audioPlayer.triggerEventHandler('canplay', null);
        audioPlayer.nativeElement.currentTime = 10;
        audioPlayer.triggerEventHandler('timeupdate', null);

        expect(component.playTime.emit).toHaveBeenCalledWith(10);
      });
    });
  });
  describe('On Errors', () => {
    it('should set error message on 403', () => {
      // Set ErrorMessageService to return 403
      TestBed.configureTestingModule({
        imports: [AudioPlayerComponent, HttpClientTestingModule],
        providers: [
          { provide: AppConfigService, useValue: appConfigServiceMock },
          { provide: AudioRequestService, useValue: audioRequestServiceMock },
          {
            provide: ErrorMessageService,
            useValue: {
              errorMessage$: of({ status: 403 }),
              clearErrorMessage: jest.fn(),
            },
          },
        ],
      });
      fixture = TestBed.createComponent(AudioPlayerComponent);
      component = fixture.componentInstance;

      component.id = 1;
      fixture.detectChanges();

      const expectedName = appConfigServiceMock.getAppConfig().support.name;
      const errorPermission = fixture.debugElement.query(By.css('#permission-error'));
      expect(errorPermission).toBeTruthy();
      expect(errorPermission.nativeElement.textContent).toContain(
        ` You do not have permission to preview. If you believe you should have permission contact ${expectedName}`
      );
    });

    it('should set error message on 404', () => {
      // Set ErrorMessageService to return 404
      TestBed.configureTestingModule({
        imports: [AudioPlayerComponent, HttpClientTestingModule],
        providers: [
          { provide: AppConfigService, useValue: appConfigServiceMock },
          { provide: AudioRequestService, useValue: audioRequestServiceMock },
          {
            provide: ErrorMessageService,
            useValue: {
              errorMessage$: of({ status: 404 }),
              clearErrorMessage: jest.fn(),
            },
          },
        ],
      });
      fixture = TestBed.createComponent(AudioPlayerComponent);
      component = fixture.componentInstance;

      component.id = 1;
      fixture.detectChanges();

      const errorPermission = fixture.debugElement.query(By.css('#not-found-error'));
      expect(errorPermission).toBeTruthy();
      expect(errorPermission.nativeElement.textContent).toContain('Preview not found');
    });

    it('should set error message on 500', () => {
      // Set ErrorMessageService to return 500
      TestBed.configureTestingModule({
        imports: [AudioPlayerComponent, HttpClientTestingModule],
        providers: [
          { provide: AppConfigService, useValue: appConfigServiceMock },
          { provide: AudioRequestService, useValue: audioRequestServiceMock },
          {
            provide: ErrorMessageService,
            useValue: {
              errorMessage$: of({ status: 500 }),
              clearErrorMessage: jest.fn(),
            },
          },
        ],
      });
      fixture = TestBed.createComponent(AudioPlayerComponent);
      component = fixture.componentInstance;

      component.id = 1;
      fixture.detectChanges();

      component.id = 1;
      fixture.detectChanges();

      const expectedName = appConfigServiceMock.getAppConfig().support.name;
      const errorPermission = fixture.debugElement.query(By.css('#server-error'));
      expect(errorPermission).toBeTruthy();
      expect(errorPermission.nativeElement.textContent).toContain(
        ` An error has occurred. Try again or contact ${expectedName} if the problem persists `
      );
    });

    it('hide the audio player on error event', () => {
      component.audioSource = 'api/audio/preview/123';

      fixture.detectChanges();
      const audioPlayer = fixture.debugElement.query(By.css('audio'));

      audioPlayer.triggerEventHandler('error', null);

      expect(audioPlayer.nativeElement.style.display === 'none').toBeTruthy();
    });
  });
});
