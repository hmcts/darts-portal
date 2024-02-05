import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderService } from 'src/app/core/services/header/header.service';
import { ConflictComponent } from './conflict.component';

describe('ForbiddenComponent', () => {
  let component: ConflictComponent;
  let fixture: ComponentFixture<ConflictComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConflictComponent, RouterTestingModule],
    });
    fixture = TestBed.createComponent(ConflictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hide nav on init', () => {
    const headerService = TestBed.inject(HeaderService);
    const hideNavSpy = jest.spyOn(headerService, 'hideNavigation');
    component.ngOnInit();
    expect(hideNavSpy).toHaveBeenCalled();
  });

  it('show nav on destroy', () => {
    const headerService = TestBed.inject(HeaderService);
    const showNavSpy = jest.spyOn(headerService, 'showNavigation');
    component.ngOnDestroy();
    expect(showNavSpy).toHaveBeenCalled();
  });
});
