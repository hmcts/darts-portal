import { Region } from '@admin-types/courthouses/region.interface';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navigation, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { EditCourthouseComponent } from './edit-courthouse.component';
import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { DateTime } from 'luxon';
import { CourthouseData } from '@core-types/index';
import { SecurityGroup } from '@admin-types/users/security-group.type';

const mockNavigationExtras = {
  extras: {
    state: { courthouse: { courthouseName: 'Test', displayName: 'Courthouse', regionId: '1' } },
  },
};

describe('EditCourthouseComponent', () => {
  let component: EditCourthouseComponent;
  let fixture: ComponentFixture<EditCourthouseComponent>;
  let fakeCourthouseService: Partial<CourthouseService>;
  let router: Router;

  beforeEach(async () => {
    fakeCourthouseService = {
      updateCourthouse: () => of({} as CourthouseData),
      getCourthouseRegions: () => of([] as Region[]),
      getCourthouseTranscriptionCompanies: () => of([] as SecurityGroup[]),
    };
    await TestBed.configureTestingModule({
      imports: [EditCourthouseComponent, RouterTestingModule],
      providers: [{ provide: CourthouseService, useValue: fakeCourthouseService }],
    }).compileComponents();

    router = TestBed.inject(Router);

    jest.spyOn(router, 'getCurrentNavigation').mockReturnValue(mockNavigationExtras as unknown as Navigation);

    fixture = TestBed.createComponent(EditCourthouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /admin/courthouses if no courthouse is provided', () => {
    component.courthouse = null as unknown as Courthouse;
    jest.spyOn(router, 'navigate');

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/courthouses']);
  });

  it('should save courthouse', () => {
    component.courthouse = {
      id: 0,
      code: 0,
      createdDateTime: DateTime.now(),
      courthouseName: 'Test',
      displayName: 'Courthouse',
      regionId: 1,
      securityGroupIds: [],
    } as Courthouse;
    component.updateCourthouse = {
      courthouseName: 'Test',
      displayName: 'Courthouse',
      regionId: 1,
      securityGroupIds: [],
    };

    jest.spyOn(component, 'saveCourthouse');

    component.onSubmit(component.updateCourthouse);

    expect(component.saveCourthouse).toHaveBeenCalled();
  });

  it('should update displayName if courthouse confirms displayName change', () => {
    component.courthouse = {
      id: 0,
      code: 0,
      createdDateTime: DateTime.now(),
      courthouseName: 'Test',
      displayName: 'Courthouse',
      regionId: 1,
      securityGroupIds: [],
    } as Courthouse;
    component.updateCourthouse = {
      courthouseName: 'Test',
      displayName: 'Courthoos',
      regionId: 1,
      securityGroupIds: [],
    };

    expect(component.updateCourthouse.displayName).toBe('Courthoos');
  });

  it('should save courthouse and navigate to updated courthouse page', () => {
    component.courthouse = {
      id: 1,
      code: 0,
      createdDateTime: DateTime.now(),
      courthouseName: 'Test',
      displayName: 'Courthouse',
      regionId: 1,
      securityGroupIds: [],
    } as Courthouse;
    component.updateCourthouse = {
      courthouseName: 'Test',
      displayName: 'Courthoos',
      regionId: 1,
      securityGroupIds: [],
    };

    jest
      .spyOn(component.courthouseService, 'updateCourthouse')
      .mockReturnValue(of({ id: 1 } as unknown as CourthouseData));
    jest.spyOn(router, 'navigate');

    component.saveCourthouse();

    expect(component.courthouseService.updateCourthouse).toHaveBeenCalledWith(1, component.updateCourthouse);
    expect(router.navigate).toHaveBeenCalledWith(['/admin/courthouses', 1], { queryParams: { updated: true } });
  });

  it('should navigate to courthouse page on cancel', () => {
    component.courthouse = {
      id: 1,
      code: 0,
      createdDateTime: DateTime.now(),
      courthouseName: 'Test',
      displayName: 'Courthouse',
      regionId: 1,
      securityGroupIds: [],
    } as Courthouse;

    jest.spyOn(router, 'navigate');

    component.onCancel();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/courthouses', 1]);
  });
});
