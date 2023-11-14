import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeaderService } from '@services/header/header.service';
import { DeleteTranscriptComponent } from './delete-transcript.component';

describe('DeleteTranscriptComponent', () => {
  let component: DeleteTranscriptComponent;
  let fixture: ComponentFixture<DeleteTranscriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTranscriptComponent],
      providers: [{ provide: HeaderService, useValue: { hideNavigation: jest.fn(), showNavigation: jest.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteTranscriptComponent);
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
