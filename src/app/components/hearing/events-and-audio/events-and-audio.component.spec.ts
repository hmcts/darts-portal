import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsAndAudioComponent } from './events-and-audio.component';

describe('EventsAndAudioComponent', () => {
  let component: EventsAndAudioComponent;
  let fixture: ComponentFixture<EventsAndAudioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EventsAndAudioComponent]
    });
    fixture = TestBed.createComponent(EventsAndAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
