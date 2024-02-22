import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Navigation, Router } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { AnnotationService } from '@services/annotation/annotation.service';
import { DateTime } from 'luxon';
import { AddAnnotationComponent } from './add-annotation.component';

describe('AddAnnotationComponent', () => {
  let component: AddAnnotationComponent;
  let fixture: ComponentFixture<AddAnnotationComponent>;
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
    await TestBed.configureTestingModule({
      imports: [AddAnnotationComponent, HttpClientTestingModule],
      providers: [
        AnnotationService,
        LuxonDatePipe,
        DatePipe,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    jest.spyOn(router, 'getCurrentNavigation').mockReturnValue(mockNavigationExtras as unknown as Navigation);

    fixture = TestBed.createComponent(AddAnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
