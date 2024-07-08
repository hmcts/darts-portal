import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { CompletedTranscriptComponent } from './completed-transcript.component';

describe('CompletedTranscriptComponent', () => {
  let component: CompletedTranscriptComponent;
  let fixture: ComponentFixture<CompletedTranscriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedTranscriptComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
