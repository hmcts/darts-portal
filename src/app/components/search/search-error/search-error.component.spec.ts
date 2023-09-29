import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchErrorComponent } from './search-error.component';

describe('SearchErrorComponent', () => {
  let component: SearchErrorComponent;
  let fixture: ComponentFixture<SearchErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchErrorComponent],
    });
    fixture = TestBed.createComponent(SearchErrorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show appropriate message for CASE_100 error', () => {
    component.error = 'CASE_100';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('There are more than 500 results');
    expect(compiled.textContent).toContain('adding more information to your search');
  });

  it('should show appropriate message for CASE_101 error', () => {
    component.error = 'CASE_101';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('No search results');
    expect(compiled.textContent).toContain('You need to enter some search terms and try again');
  });

  it('should show appropriate message for CASE_102 error', () => {
    component.error = 'CASE_102';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('There are more than 500 results');
    expect(compiled.textContent).toContain('adding more information to your search');
  });

  it('should show default error message for unknown error', () => {
    component.error = 'UNKNOWN_CASE';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('An error has occurred. Please try again later.');
  });
});
