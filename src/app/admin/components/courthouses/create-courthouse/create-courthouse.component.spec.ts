import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';
import { CourthouseData } from '@core-types/index';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { HeaderService } from '@services/header/header.service';
import { of } from 'rxjs/internal/observable/of';
import { CreateCourthouseComponent } from './create-courthouse.component';

describe('CreateCourthouseComponent', () => {
  let component: CreateCourthouseComponent;
  let fixture: ComponentFixture<CreateCourthouseComponent>;
  let courthouseService: Partial<CourthouseService>;

  beforeEach(async () => {
    courthouseService = {
      createCourthouse: jest.fn(),
      getCourthouseRegions: jest.fn(),
      getCourthouseTranscriptionCompanies: jest.fn(),
      getCourthouses: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CreateCourthouseComponent],
      providers: [{ provide: CourthouseService, useValue: courthouseService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCourthouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('set isConfirmation to true and hide navigation', () => {
    const headerService = TestBed.inject(HeaderService);
    jest.spyOn(headerService, 'hideNavigation');

    component.isConfirmation = true;

    expect(component.isConfirmation).toBe(true);
    expect(headerService.hideNavigation).toHaveBeenCalled();
  });

  it('set isConfirmation to false and show navigation', () => {
    const headerService = TestBed.inject(HeaderService);
    jest.spyOn(headerService, 'showNavigation');

    component.isConfirmation = false;

    expect(component.isConfirmation).toBe(false);
    expect(headerService.showNavigation).toHaveBeenCalled();
  });

  it('onSubmit should set formValues and isConfirmation to true', () => {
    const formValues = { courthouseName: 'COURTHOUSE', displayName: 'Courthouse', regionId: 1, securityGroupIds: [] };
    component.onSubmit(formValues);

    expect(component.formValues).toEqual(formValues);
    expect(component.isConfirmation).toBe(true);
  });

  it('onConfirmCourthouseDetails should call courthouseService.createCourthouse and navigate to admin/courthouses', () => {
    const router = TestBed.inject(Router);
    const courthouse = { id: 1 } as unknown as CourthouseData;
    jest.spyOn(courthouseService, 'createCourthouse').mockReturnValue(of(courthouse));
    jest.spyOn(router, 'navigate');

    component.formValues = {
      courthouseName: 'COURTHOUSE',
      displayName: 'Courthouse',
      regionId: 1,
      securityGroupIds: [],
    };
    component.onConfirmCourthouseDetails();

    expect(courthouseService.createCourthouse).toHaveBeenCalledWith(component.formValues);
    expect(router.navigate).toHaveBeenCalledWith(['/admin/courthouses', courthouse.id], {
      queryParams: { newCourthouse: true },
    });
  });

  it('onBack should set isConfirmation to false', () => {
    component.isConfirmation = true;
    component.onBack();

    expect(component.isConfirmation).toBe(false);
  });

  it('onCancel should navigate to admin/courthouses', () => {
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');

    component.onCancel();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/courthouses']);
  });
});
