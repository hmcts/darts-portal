import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeaderService } from 'src/app/core/services/header/header.service';
import { DeleteComponent } from './delete.component';

describe('DeleteComponent', () => {
  let component: DeleteComponent;
  let fixture: ComponentFixture<DeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteComponent],
      providers: [{ provide: HeaderService, useValue: { hideNavigation: jest.fn(), showNavigation: jest.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide navigation on init', fakeAsync(() => {
    const spy = jest.spyOn(component.headerService, 'hideNavigation');
    component.ngOnInit();
    tick();
    expect(spy).toHaveBeenCalled();
  }));

  it('should show navigation on destroy', fakeAsync(() => {
    const spy = jest.spyOn(component.headerService, 'showNavigation');
    component.ngOnDestroy();
    tick();
    expect(spy).toHaveBeenCalled();
  }));
});
