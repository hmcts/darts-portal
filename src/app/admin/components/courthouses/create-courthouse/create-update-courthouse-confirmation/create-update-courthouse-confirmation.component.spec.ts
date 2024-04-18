import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateCourthouseFormValues, SecurityGroup } from '@admin-types/index';
import { Router } from '@angular/router';
import { CreateUpdateCourthouseConfirmationComponent } from './create-update-courthouse-confirmation.component';

describe('CreateUpdateCourthouseConfirmationComponent', () => {
  let component: CreateUpdateCourthouseConfirmationComponent;
  let fixture: ComponentFixture<CreateUpdateCourthouseConfirmationComponent>;
  const fakeRouter = {
    navigate: jest.fn(),
    url: 'test#',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateCourthouseConfirmationComponent],
      providers: [{ provide: Router, useValue: fakeRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateCourthouseConfirmationComponent);
    component = fixture.componentInstance;
    component.companies = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should update courthouseDetails with mapped form values', () => {
    it('when regionId is included', () => {
      component.companies = [
        { id: 0, name: 'Company 1' },
        { id: 1, name: 'Company 2' },
      ] as SecurityGroup[];
      component.regions = [
        { id: 0, name: 'Region 1' },
        { id: 1, name: 'Region 2' },
      ];
      const values: CreateUpdateCourthouseFormValues = {
        courthouseName: 'TEST',
        displayName: 'Test',
        regionId: 0,
        securityGroupIds: ['0'],
      };

      const expectedUserDetails = {
        'Courthouse name': 'TEST',
        'Display name': 'Test',
        Region: 'Region 1',
        'Transcription companies': 'Company 1',
      };

      component.values = values;

      expect(component.courthouseDetails).toEqual(expectedUserDetails);
    });
    it('when regionId is NOT included', () => {
      component.companies = [
        { id: 0, name: 'Company 1' },
        { id: 1, name: 'Company 2' },
      ] as SecurityGroup[];
      component.regions = [
        { id: 0, name: 'Region 1' },
        { id: 1, name: 'Region 2' },
      ];
      const values: CreateUpdateCourthouseFormValues = {
        courthouseName: 'TEST',
        displayName: 'Test',
        regionId: undefined,
        securityGroupIds: ['0'],
      };

      const expectedUserDetails = {
        'Courthouse name': 'TEST',
        'Display name': 'Test',
        Region: 'No region',
        'Transcription companies': 'Company 1',
      };

      component.values = values;

      expect(component.courthouseDetails).toEqual(expectedUserDetails);
    });
  });

  describe('onReturnCourthouseName', () => {
    it('should emit a back event and call router with appropriate fragment', () => {
      const stateChangeSpy = jest.spyOn(component.back, 'emit');

      component.onReturnCourthouseName();

      expect(stateChangeSpy).toHaveBeenCalled();
      expect(fakeRouter.navigate).toHaveBeenCalledWith(['test'], { fragment: 'courthouseName' });
    });
  });

  describe('onReturnDisplayName', () => {
    it('should emit a back event and call router with appropriate fragment', () => {
      const stateChangeSpy = jest.spyOn(component.back, 'emit');

      component.onReturnDisplayName();

      expect(stateChangeSpy).toHaveBeenCalled();
      expect(fakeRouter.navigate).toHaveBeenCalledWith(['test'], { fragment: 'displayName' });
    });
  });

  describe('onReturnRegion', () => {
    it('should emit a back event and call router with appropriate fragment', () => {
      const stateChangeSpy = jest.spyOn(component.back, 'emit');

      component.onReturnRegion();

      expect(stateChangeSpy).toHaveBeenCalled();
      expect(fakeRouter.navigate).toHaveBeenCalledWith(['test'], { fragment: 'regionId' });
    });
  });

  describe('onReturnCompanies', () => {
    it('should emit a back event and call router with appropriate fragment', () => {
      const stateChangeSpy = jest.spyOn(component.back, 'emit');

      component.onReturnCompanies();

      expect(stateChangeSpy).toHaveBeenCalled();
      expect(fakeRouter.navigate).toHaveBeenCalledWith(['test'], { fragment: 'transcriptionCompanies' });
    });
  });
});
