import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateCourthouseFormValues, SecurityGroup } from '@admin-types/index';
import { CreateUpdateCourthouseConfirmationComponent } from './create-update-courthouse-confirmation.component';

describe('CreateUpdateCourthouseConfirmationComponent', () => {
  let component: CreateUpdateCourthouseConfirmationComponent;
  let fixture: ComponentFixture<CreateUpdateCourthouseConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateCourthouseConfirmationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateCourthouseConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
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
          regionId: '0',
          securityGroupIds: ['0'],
        };

        const expectedUserDetails = {
          'Courthouse name': 'TEST',
          'Display name': 'Test',
          Region: 'Region 1',
          'Transcription companies': 'Company 1',
        };

        component.values = values;
        component.ngOnChanges();

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
        component.ngOnChanges();

        expect(component.courthouseDetails).toEqual(expectedUserDetails);
      });
    });
  });
});
