import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from '@services/header/header.service';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let mockHeaderService: Partial<HeaderService>;

  const mockActivatedRoute = {};

  beforeEach(() => {
    // convert mockHeaderService to jest instead of jasmine
    mockHeaderService = {
      hideNavigation: jest.fn(),
      showNavigation: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HeaderService, useValue: mockHeaderService },
      ],
    });
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call hideNavigation on ngOnInit', () => {
    component.ngOnInit();
    expect(mockHeaderService.hideNavigation).toHaveBeenCalled();
  });

  it('should call showNavigation on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(mockHeaderService.showNavigation).toHaveBeenCalled();
  });
});
