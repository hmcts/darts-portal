import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourthouseRecordComponent } from './courthouse-record.component';
import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { DateTime } from 'luxon';
import { CourthouseService } from '@services/courthouses/courthouses.service';

describe('CourthouseRecordComponent', () => {
  let component: CourthouseRecordComponent;
  let fixture: ComponentFixture<CourthouseRecordComponent>;
  let fakeCourthouseAdminService: Partial<CourthouseService>;
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
          provide: CourthouseService,
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

  it('should format security groups to string', () => {
    const groups = [
      { id: 1, security_role_id: 1, name: 'Group 1' },
      { id: 2, security_role_id: 2, name: 'Group 2' },
    ];
    expect(component.formatSecurityGroupLinks(groups)).toStrictEqual([
      { value: 'Group 1', href: '/admin/groups/1' },
      { value: 'Group 2', href: '/admin/groups/2' },
    ]);
  });
});