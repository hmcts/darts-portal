import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicAudioFileDetailsComponent } from './basic-audio-file-details.component';

describe('BasicAudioFileDetailsComponent', () => {
  let component: BasicAudioFileDetailsComponent;
  let fixture: ComponentFixture<BasicAudioFileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicAudioFileDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BasicAudioFileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
