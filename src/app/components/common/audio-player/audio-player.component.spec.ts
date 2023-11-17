import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppConfigService } from '@services/app-config/app-config.service';
import { AudioPlayerComponent } from './audio-player.component';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AudioPlayerComponent],
      providers: [{ provide: AppConfigService, useValue: appConfigServiceMock }],
    });

    fixture = TestBed.createComponent(AudioPlayerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('set audioSource when mediaId is provided', () => {
    component.audioSource = 'api/audio/preview/123';

    fixture.detectChanges();

    const audioPlayerSource = fixture.debugElement.query(By.css('source'));

    expect(audioPlayerSource.nativeElement.getAttribute('src')).toBe('api/audio/preview/123');
  });

  it('display loading message while waiting for canplay event', () => {
    component.audioSource = 'api/audio/preview/123';

    fixture.detectChanges();

    const loadingMessage = fixture.debugElement.query(By.css('#loading'));

    expect(loadingMessage.nativeElement.textContent).toContain('Loading audio... Please wait');
  });

  it('not display loading message if canplay is true', () => {
    component.audioSource = 'api/audio/preview/123';
    component.canPlay = true;

    fixture.detectChanges();
    const loadingMessage = fixture.debugElement.query(By.css('#loading'));

    expect(loadingMessage).toBeFalsy();
  });

  it('hide the audio player until canplay event is fired', () => {
    component.audioSource = 'api/audio/preview/123';

    fixture.detectChanges();
    const audioPlayer = fixture.debugElement.query(By.css('audio'));

    expect(audioPlayer.nativeElement.hasAttribute('hidden')).toBeTruthy();

    audioPlayer.triggerEventHandler('canplay', null);
    fixture.detectChanges();

    expect(audioPlayer.nativeElement.hasAttribute('hidden')).toBeFalsy();
  });

  describe('#setPlayTime', () => {
    it('should set the play time', () => {
      component.audioSource = 'api/audio/preview/123';
      component.canPlay = true;

      fixture.detectChanges();
      const audioPlayer = fixture.debugElement.query(By.css('audio'));

      audioPlayer.triggerEventHandler('canplay', null);
      component.setPlayTime(10, true);

      expect(audioPlayer.nativeElement.currentTime).toEqual(10);
    });

    it('should play the audio if shouldPlay is true', () => {
      component.audioSource = 'api/audio/preview/123';
      component.canPlay = true;

      fixture.detectChanges();
      const audioPlayer = fixture.debugElement.query(By.css('audio'));

      jest.spyOn(audioPlayer.nativeElement, 'play');

      audioPlayer.triggerEventHandler('canplay', null);
      component.setPlayTime(10, true);

      fixture.detectChanges();

      expect(audioPlayer.nativeElement.play).toBeCalled();
    });
  });

  describe('#onTimeUpdate', () => {
    it('should emit the play time', () => {
      jest.spyOn(component.playTime, 'emit');
      component.audioSource = 'api/audio/preview/123';
      component.canPlay = true;

      fixture.detectChanges();
      const audioPlayer = fixture.debugElement.query(By.css('audio'));

      audioPlayer.triggerEventHandler('canplay', null);
      audioPlayer.nativeElement.currentTime = 10;
      audioPlayer.triggerEventHandler('timeupdate', null);

      expect(component.playTime.emit).toHaveBeenCalledWith(10);
    });
  });

  describe('#onError', () => {
    it('should set errorMsg to true on error event', () => {
      component.audioSource = 'api/audio/preview/123';

      fixture.detectChanges();
      const audioPlayer = fixture.debugElement.query(By.css('audio'));

      audioPlayer.triggerEventHandler('error', null);

      expect(component.errorMsg).toBeTruthy();
    });
  });
});
