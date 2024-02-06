import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserAdminService } from '../../services/user-admin.service';
import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let userAdminService: UserAdminService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [{ provide: UserAdminService, useValue: { searchUsers: jest.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    userAdminService = TestBed.inject(UserAdminService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start loading when search is triggered', () => {
    jest.spyOn(component, 'startLoading');
    component.search$.next({}); // Trigger search
    expect(component.startLoading).toHaveBeenCalled();
  });

  it('should stop loading after search is completed', () => {
    jest.spyOn(component, 'stopLoading');
    jest.spyOn(userAdminService, 'searchUsers').mockReturnValue(of([]));
    component.search$.next({}); // Trigger search
    expect(component.stopLoading).toHaveBeenCalled();
  });

  it('should call searchUsers when search is triggered', () => {
    jest.spyOn(userAdminService, 'searchUsers').mockReturnValue(of([]));
    component.search$.next({}); // Trigger search
    expect(userAdminService.searchUsers).toHaveBeenCalled();
  });

  it('should call searchUsers with correct values', () => {
    const searchValues = { fullName: 'test', email: 'admin', active: true };
    jest.spyOn(userAdminService, 'searchUsers').mockReturnValue(of([]));
    component.search$.next(searchValues); // Trigger search
    fixture.detectChanges();
    expect(userAdminService.searchUsers).toHaveBeenCalledWith(searchValues);
  });

  it('should clear the search when onClear is called', () => {
    jest.spyOn(component.search$, 'next');
    component.onClear();
    expect(component.search$.next).toHaveBeenCalledWith(null);
  });

  it('should set isSubmitted to true when onSubmit is called', () => {
    component.onSubmit({}); // Trigger submit
    expect(component.isSubmitted$.value).toBe(true);
  });

  it('should set isSubmitted to false when onClear is called', () => {
    component.onClear();
    expect(component.isSubmitted$.value).toBe(false);
  });
});
