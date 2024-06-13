import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedAudioFileDetailsComponent } from './advanced-audio-file-details.component';

describe('AdvancedAudioFileDetailsComponent', () => {
  let component: AdvancedAudioFileDetailsComponent;
  let fixture: ComponentFixture<AdvancedAudioFileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedAudioFileDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdvancedAudioFileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
