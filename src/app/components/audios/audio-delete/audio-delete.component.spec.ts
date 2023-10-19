import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HeaderService } from '@services/header/header.service';

import { AudioDeleteComponent } from './audio-delete.component';

describe('AudioDeleteComponent', () => {
  let component: AudioDeleteComponent;
  let fixture: ComponentFixture<AudioDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AudioDeleteComponent],
      providers: [{ provide: HeaderService, useValue: { hideNavigation: jest.fn(), showNavigation: jest.fn() } }],
    });
    fixture = TestBed.createComponent(AudioDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call hideNavigation method on ngOnInit', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(component.headerService.hideNavigation).toHaveBeenCalled();
  }));

  it('should call showNavigation method on ngOnDestroy', fakeAsync(() => {
    component.ngOnDestroy();
    tick();
    expect(component.headerService.showNavigation).toHaveBeenCalled();
  }));
});
