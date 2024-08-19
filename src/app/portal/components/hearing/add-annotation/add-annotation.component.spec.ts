import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Navigation, Router } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { AnnotationService } from '@services/annotation/annotation.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { AddAnnotationComponent } from './add-annotation.component';

describe('AddAnnotationComponent', () => {
  let component: AddAnnotationComponent;
  let fixture: ComponentFixture<AddAnnotationComponent>;
  let fakeAnnotationService: AnnotationService;
  let router: Router;

  const mockActivatedRoute = {
    snapshot: {
      params: {
        requestId: 12378,
      },
    },
  };

  const mockNavigationExtras = {
    extras: {
      state: {
        caseId: '1',
        caseNumber: 'C20220620001',
        hearingDate: DateTime.fromISO('2023-10-11T00:00:00.000Z'),
        hearingId: 3,
      },
    },
  };

  beforeEach(async () => {
    fakeAnnotationService = {
      uploadAnnotationDocument: jest.fn().mockReturnValue(of({})),
    } as unknown as AnnotationService;

    await TestBed.configureTestingModule({
      imports: [AddAnnotationComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        LuxonDatePipe,
        DatePipe,
        { provide: AnnotationService, useValue: fakeAnnotationService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    jest.spyOn(router, 'getCurrentNavigation').mockReturnValue(mockNavigationExtras as unknown as Navigation);

    fixture = TestBed.createComponent(AddAnnotationComponent);
    fixture.componentRef.setInput('caseId', 1);
    fixture.componentRef.setInput('hearingId', 3);
    fixture.componentRef.setInput('caseNumber', 'C20220620001');

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onComplete', () => {
    it('should upload a document with comments', () => {
      component.annotationComments.setValue('test');
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      component.fileControl.setValue(file);
      component.onComplete();
      expect(fakeAnnotationService.uploadAnnotationDocument).toHaveBeenCalledWith(file, 3, 'test');
    });
    it('should upload a document without comments ', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      component.fileControl.setValue(file);
      component.onComplete();
      expect(fakeAnnotationService.uploadAnnotationDocument).toHaveBeenCalledWith(file, 3, null);
    });
    it('does not upload if form is invalid', () => {
      component.fileControl.setValue(null);
      component.onComplete();
      expect(fakeAnnotationService.uploadAnnotationDocument).not.toHaveBeenCalled();
    });
  });

  describe('#goToSuccessScreen', () => {
    it('should go to success screen by incrementing the step counter', () => {
      component.step = 1;
      component.goToSuccessScreen();
      expect(component.step).toEqual(2);
    });
  });

  describe('#fileControl', () => {
    it('should set fileControl value when a file is selected', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const fileControl = component.fileControl;
      fileControl.setValue(file);
      expect(fileControl.value).toEqual(file);
    });

    it('should mark fileControl as invalid when no file is selected', () => {
      const fileControl = component.fileControl;
      fileControl.setValue(null);
      expect(fileControl.invalid).toBe(true);
    });

    it('should mark fileControl as valid when a file is selected', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const fileControl = component.fileControl;
      fileControl.setValue(file);
      expect(fileControl.valid).toBe(true);
    });

    it('should mark fileControl as required', () => {
      const fileControl = component.fileControl;
      fileControl.setValue(null);
      expect(fileControl.hasError('required')).toBe(true);
    });

    it('should mark fileControl as invalid when file size exceeds the maximum limit', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(file, 'size', { value: 22 * 1024 * 1024 }); // 22MB file size
      const fileControl = component.fileControl;
      fileControl.setValue(file);
      expect(fileControl.hasError('maxFileSize')).toBe(true);
    });

    it('should mark fileControl as valid when file size is within the maximum limit', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const fileControl = component.fileControl;
      fileControl.setValue(file);
      expect(fileControl.valid).toBe(true);
    });

    describe('Error messages', () => {
      it('set error message when fileControl is required', () => {
        component.fileControl.setValue(null);
        expect(component.errors()[0].message).toBe('You need to upload a file');
      });

      it('set error message when filesize is too large', () => {
        const file = new File(['test'], 'test.txt', { type: 'text/plain' });
        Object.defineProperty(file, 'size', { value: 22 * 1024 * 1024 }); // 22MB file size
        component.fileControl.setValue(file);

        expect(component.errors()[0].message).toBe('The selected file must be smaller than 20MB.');
      });

      it('does not set error message when fileControl is valid', () => {
        const file = new File(['test'], 'test.txt', { type: 'text/plain' });
        component.fileControl.setValue(file);
        expect(component.errors()).toEqual([]);
      });
    });
  });
});
