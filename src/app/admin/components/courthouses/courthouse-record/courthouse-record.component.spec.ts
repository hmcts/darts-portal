import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourthouseRecordComponent } from './courthouse-record.component';
import { CourthouseAdminService } from '@services/courthouse-admin.service';
import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { DateTime } from 'luxon';

describe('CourthouseRecordComponent', () => {
  let component: CourthouseRecordComponent;
  let fixture: ComponentFixture<CourthouseRecordComponent>;
  let fakeCourthouseAdminService: Partial<CourthouseAdminService>;
  let fakeActivatedRoute: ActivatedRoute;

  const TEST_COURTHOUSE: Courthouse = {
    id: 123,
    code: 1,
    courthouseName: 'COURTHOUSE',
    displayName: 'Courthouse',
    createdDateTime: DateTime.fromISO('2024-01-01'),
    lastModifiedDateTime: DateTime.fromISO('2024-01-01'),
    regionName: 'Region',
  };

  beforeEach(async () => {
    fakeCourthouseAdminService = {
      getCourthouseWithRegionsAndSecurityGroups: jest.fn().mockReturnValue(of(TEST_COURTHOUSE)),
    };
    fakeActivatedRoute = {
      snapshot: {
        params: {
          courthouseId: 123,
        },
      },
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      imports: [CourthouseRecordComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        {
          provide: CourthouseAdminService,
          useValue: fakeCourthouseAdminService,
        },
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourthouseRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
