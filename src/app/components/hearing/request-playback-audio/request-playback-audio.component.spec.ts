import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPlaybackAudioComponent } from './request-playback-audio.component';

describe('RequestPlaybackAudioComponent', () => {
  let component: RequestPlaybackAudioComponent;
  let fixture: ComponentFixture<RequestPlaybackAudioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RequestPlaybackAudioComponent]
    });
    fixture = TestBed.createComponent(RequestPlaybackAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
