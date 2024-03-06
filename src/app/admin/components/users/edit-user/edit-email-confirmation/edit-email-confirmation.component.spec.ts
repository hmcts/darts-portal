import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderService } from '@services/header/header.service';
import { EditEmailConfirmationComponent } from './edit-email-confirmation.component';

describe('EditEmailConfirmationComponent', () => {
  let component: EditEmailConfirmationComponent;
  let fixture: ComponentFixture<EditEmailConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEmailConfirmationComponent],
      providers: [{ provide: HeaderService, useValue: { hideNavigation: jest.fn(), showNavigation: jest.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(EditEmailConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template', () => {
    it('should display the old and new email', () => {
      component.oldEmail = 'old@email.com';
      component.newEmail = 'new@email.com';

      fixture.detectChanges();

      const oldEmailElement: HTMLElement = fixture.nativeElement.querySelector('#old-email')!;
      const newEmailElement: HTMLElement = fixture.nativeElement.querySelector('#new-email')!;

      expect(oldEmailElement.textContent).toContain('old@email.com');
      expect(newEmailElement.textContent).toContain('new@email.com');
    });
  });

  describe('ngOnInit', () => {
    it('should call headerService.hideNavigation', () => {
      const headerService = TestBed.inject(HeaderService);
      component.ngOnInit();
      expect(headerService.hideNavigation).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call headerService.showNavigation', () => {
      const headerService = TestBed.inject(HeaderService);
      component.ngOnDestroy();
      expect(headerService.showNavigation).toHaveBeenCalled();
    });
  });
});
