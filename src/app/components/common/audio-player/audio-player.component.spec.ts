import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AudioPlayerComponent } from './audio-player.component';
import { By } from '@angular/platform-browser';

describe('AudioPlayerComponent', () => {
  let fixture: ComponentFixture<AudioPlayerComponent>;
  let component: AudioPlayerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AudioPlayerComponent],
    });

    fixture = TestBed.createComponent(AudioPlayerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('set audioSource when mediaId is provided', () => {
    component.mediaId = 123;

    fixture.detectChanges();

    const audioPlayerSource = fixture.debugElement.query(By.css('source'));

    expect(audioPlayerSource.nativeElement.getAttribute('src')).toBe('/api/audio/preview/123');
  });

  it('display loading message while waiting for canplay event', () => {
    component.mediaId = 123;

    fixture.detectChanges();

    const loadingMessage = fixture.debugElement.query(By.css('#loading'));

    expect(loadingMessage.nativeElement.textContent).toContain('Loading Audio Preview');
  });

  it('not display loading message if canplay is true', () => {
    component.mediaId = 123;
    component.canPlay = true;

    fixture.detectChanges();
    const loadingMessage = fixture.debugElement.query(By.css('#loading'));

    expect(loadingMessage).toBeFalsy();
  });

  it('hide the audio player until canplay event is fired', () => {
    component.mediaId = 123;
    fixture.detectChanges();
    const audioPlayer = fixture.debugElement.query(By.css('audio'));

    expect(audioPlayer.nativeElement.hasAttribute('hidden')).toBeTruthy();

    component.canPlay = true;

    fixture.detectChanges();

    expect(audioPlayer.nativeElement.hasAttribute('hidden')).toBeFalsy();
  });
});
