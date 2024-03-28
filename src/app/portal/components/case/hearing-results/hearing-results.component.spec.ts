import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Hearing } from '@portal-types/index';
import { AnnotationService } from '@services/annotation/annotation.service';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { HearingResultsComponent } from './hearing-results.component';

describe('HearingResultsComponent', () => {
  let component: HearingResultsComponent;
  let fixture: ComponentFixture<HearingResultsComponent>;

  const mockSingleCaseTwoHearings: Hearing[] = [
    {
      id: 1,
      date: DateTime.fromISO('2023-09-01'),
      judges: ['HHJ M. Hussain KC'],
      courtroom: '3',
      transcriptCount: 1,
    },
  ];

  const blob = new Blob();

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HearingResultsComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: DatePipe },
        {
          provide: AnnotationService,
          useValue: {
            downloadAnnotationDocument: jest.fn().mockReturnValue(of(blob)),
          },
        },
        {
          provide: FileDownloadService,
          useValue: {
            saveAs: jest.fn(),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(HearingResultsComponent);
    component = fixture.componentInstance;
    component.hearings = mockSingleCaseTwoHearings;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#downloadAnnotation', () => {
    it('calls downloadAnnotationDocument', () => {
      component.downloadAnnotation(1, 1, 'testDoc.docx');
      expect(component.AnnotationService.downloadAnnotationDocument).toHaveBeenCalledWith(1, 1);
      expect(component.fileDownloadService.saveAs).toHaveBeenCalledWith(blob, 'testDoc.docx');
    });
  });

  describe('#onDeleteClicked', () => {
    it('should emit when delete is clicked', () => {
      jest.spyOn(component.deleteAnnotationEvent, 'emit');
      component.onDeleteClicked(123);
      expect(component.deleteAnnotationEvent.emit).toHaveBeenCalledWith(123);
    });
  });
});
