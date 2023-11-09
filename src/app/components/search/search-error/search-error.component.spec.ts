import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InternalErrorComponent } from '@components/error/internal-server/internal-error.component';
import { ErrorMessage } from '@darts-types/error-message.interface';
import { AppConfigService } from '@services/app-config/app-config.service';
import { HeaderService } from '@services/header/header.service';
import { SearchErrorComponent } from './search-error.component';

describe('SearchErrorComponent', () => {
  const appConfigServiceMock = {
    getAppConfig: () => ({
      appInsightsKey: 'XXXXXXXX',
      support: {
        name: 'DARTS support',
        emailAddress: 'support@darts',
      },
    }),
  };
  let component: SearchErrorComponent;
  let fixture: ComponentFixture<SearchErrorComponent>;
  let debugElement: DebugElement;
  let mockRouter: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SearchErrorComponent,
        RouterTestingModule.withRoutes([{ path: 'internal-error', component: InternalErrorComponent }]),
      ],
      providers: [HeaderService, { provide: AppConfigService, useValue: appConfigServiceMock }],
    });
    fixture = TestBed.createComponent(SearchErrorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    mockRouter = TestBed.inject(Router);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show appropriate message for CASE_100 error', () => {
    component.error = { detail: { type: 'CASE_100' } } as ErrorMessage;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('There are more than 500 results');
    expect(compiled.textContent).toContain('adding more information to your search');
  });

  it('should show appropriate message for CASE_101 error', () => {
    component.error = { detail: { type: 'CASE_101' } } as ErrorMessage;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('No search results');
    expect(compiled.textContent).toContain('You need to enter some search terms and try again');
  });

  it('should show appropriate message for CASE_102 error', () => {
    component.error = { detail: { type: 'CASE_102' } } as ErrorMessage;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('There are more than 500 results');
    expect(compiled.textContent).toContain('adding more information to your search');
  });

  it('should show default error message for unknown error', () => {
    component.error = { detail: { type: 'UNKNOWN_CASE' } } as ErrorMessage;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('An error has occurred. Please try again later.');
  });

  it('should show in-component internal server error page if DISPLAY = COMPONENT and status 500', () => {
    component.error = { status: 500, display: 'COMPONENT' } as ErrorMessage;
    fixture.detectChanges();
    const navigateByUrlSpy = jest.spyOn(mockRouter, 'navigateByUrl');

    const internalErrorComponent = debugElement.query(By.css('app-internal-error'));
    expect(internalErrorComponent).toBeTruthy();
    expect(navigateByUrlSpy).toHaveBeenCalledTimes(0);
  });

  it('should show full-page internal server error page if DISPLAY = PAGE and status 500', fakeAsync(() => {
    component.error = { status: 500, display: 'PAGE' } as ErrorMessage;
    const navigateByUrlSpy = jest.spyOn(mockRouter, 'navigateByUrl');

    fixture.detectChanges();
    component.ngAfterViewInit();
    flush();

    expect(navigateByUrlSpy).toHaveBeenCalledWith('internal-error');
  }));
});
