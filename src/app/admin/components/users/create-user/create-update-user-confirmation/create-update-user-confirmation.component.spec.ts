import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateUserFormValues } from '@admin-types/index';
import { By } from '@angular/platform-browser';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { CreateUpdateUserConfirmationComponent } from './create-update-user-confirmation.component';

describe('CreateUpdateUserConfirmationComponent', () => {
  let component: CreateUpdateUserConfirmationComponent;
  let fixture: ComponentFixture<CreateUpdateUserConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateUserConfirmationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateUserConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should update userDetails with mapped form values', () => {
      const values: CreateUpdateUserFormValues = {
        fullName: 'Test User',
        email: 'test@test',
        description: 'A test user',
      };

      const expectedUserDetails = {
        'Full name': 'Test User',
        'Email address': 'test@test',
        Description: 'A test user',
      };

      component.values = values;
      component.ngOnChanges();

      expect(component.userDetails).toEqual(expectedUserDetails);
    });
  });

  describe('output events', () => {
    it('should emit confirm event', () => {
      jest.spyOn(component.confirm, 'emit');
      fixture.nativeElement.querySelector('#confirm-button').click();
      expect(component.confirm.emit).toHaveBeenCalled();
    });

    it('emit back event on change link clicked', () => {
      jest.spyOn(component.back, 'emit');
      fixture.nativeElement.querySelector('#change-link').click();
      expect(component.back.emit).toHaveBeenCalled();
    });

    it('should emit cancel event', () => {
      jest.spyOn(component.cancel, 'emit');
      fixture.nativeElement.querySelector('#cancel-link').click();
      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });

  describe('template', () => {
    it('should render user details', () => {
      const values: CreateUpdateUserFormValues = {
        fullName: 'Test User',
        email: 'test@test',
        description: 'A test user',
      };

      component.values = values;
      component.ngOnChanges();
      fixture.detectChanges();

      const userDetails = fixture.debugElement.query(By.directive(DetailsTableComponent)).nativeElement;
      expect(userDetails.textContent).toContain('Test User');
      expect(userDetails.textContent).toContain('test@test');
      expect(userDetails.textContent).toContain('A test user');
    });
  });
});
