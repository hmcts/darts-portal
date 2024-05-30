import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { ViewTranscriptionDocumentComponent } from './view-transcription-document.component';

describe('ViewTranscriptionDocumentComponent', () => {
  let component: ViewTranscriptionDocumentComponent;
  let fixture: ComponentFixture<ViewTranscriptionDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTranscriptionDocumentComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                transcriptionDocumentId: 1,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTranscriptionDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
