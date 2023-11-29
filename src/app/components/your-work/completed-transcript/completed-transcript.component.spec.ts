import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { CompletedTranscriptComponent } from './completed-transcript.component';

describe('CompletedTranscriptComponent', () => {
  let component: CompletedTranscriptComponent;
  let fixture: ComponentFixture<CompletedTranscriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedTranscriptComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
