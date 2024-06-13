import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioFileComponent } from './audio-file.component';

describe('AudioFileComponent', () => {
  let component: AudioFileComponent;
  let fixture: ComponentFixture<AudioFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AudioFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
