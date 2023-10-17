import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioDeleteComponent } from './audio-delete.component';

describe('AudioDeleteComponent', () => {
  let component: AudioDeleteComponent;
  let fixture: ComponentFixture<AudioDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AudioDeleteComponent]
    });
    fixture = TestBed.createComponent(AudioDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
