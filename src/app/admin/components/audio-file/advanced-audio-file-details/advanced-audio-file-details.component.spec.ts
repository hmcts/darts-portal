import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { mockAudioFile } from '../basic-audio-file-details/basic-audio-file-details.component.spec';
import { AdvancedAudioFileDetailsComponent } from './advanced-audio-file-details.component';

describe('AdvancedAudioFileDetailsComponent', () => {
  let component: AdvancedAudioFileDetailsComponent;
  let fixture: ComponentFixture<AdvancedAudioFileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedAudioFileDetailsComponent],
      providers: [DatePipe, { provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedAudioFileDetailsComponent);
    component = fixture.componentInstance;
    component.audioFile = mockAudioFile;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
