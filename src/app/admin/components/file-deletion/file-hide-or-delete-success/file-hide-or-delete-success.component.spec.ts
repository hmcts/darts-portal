import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileHideOrDeleteSuccessComponent } from './file-hide-or-delete-success.component';

describe('FileHideOrDeleteSuccessComponent', () => {
  let component: FileHideOrDeleteSuccessComponent;
  let fixture: ComponentFixture<FileHideOrDeleteSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileHideOrDeleteSuccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileHideOrDeleteSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the continue link when transformedMediaId is falsy', () => {
    const routerSpy = jest.spyOn(component.router, 'navigate');
    component.transformedMediaId = null;
    component.goTo();
    expect(routerSpy).toHaveBeenCalledWith([component.continueLink]);
  });

  it('should navigate to the continue link with mediaId state when transformedMediaId is truthy', () => {
    const routerSpy = jest.spyOn(component.router, 'navigate');
    const mediaId = 123;
    component.transformedMediaId = mediaId;
    component.goTo();
    expect(routerSpy).toHaveBeenCalledWith([component.continueLink], { state: { mediaId } });
  });
});
