import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HeaderService } from '@services/header/header.service';
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

  it('should emit cancelled event on cancel link click', () => {
    const cancelSpy = jest.spyOn(component.cancelled, 'emit');
    const cancelLink = fixture.debugElement.query(By.css('a'));

    cancelLink.triggerEventHandler('click', { preventDefault: () => {} });
    fixture.detectChanges();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should show default title if none is provided', () => {
    component.title = '';
    component.numberOfItems = 1;
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('h1')).nativeElement.textContent;
    expect(heading.trim()).toBe('Are you sure you want to delete this item?');
  });

  it('should show plural title for multiple items', () => {
    component.title = '';
    component.numberOfItems = 3;
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('h1')).nativeElement.textContent;
    expect(heading.trim()).toBe('Are you sure you want to delete these items?');
  });

  it('should render custom title if provided', () => {
    component.title = 'Custom Delete Title';
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('h1')).nativeElement.textContent;
    expect(heading.trim()).toBe('Custom Delete Title');
  });

  it('should emit confirm event and disable the delete button on click', () => {
    const confirmSpy = jest.spyOn(component.confirm, 'emit');

    const button = fixture.debugElement.query(By.css('button')).nativeElement;

    // Simulate click
    button.click();
    fixture.detectChanges();

    expect(confirmSpy).toHaveBeenCalled();
    expect(button.disabled).toBeTruthy();
  });
});
