import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTransformedMediaFormComponent } from './search-transformed-media-form.component';

describe('SearchTransformedMediaFormComponent', () => {
  let component: SearchTransformedMediaFormComponent;
  let fixture: ComponentFixture<SearchTransformedMediaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchTransformedMediaFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchTransformedMediaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle advanced search', () => {
    component.toggleAdvancedSearch();
    expect(component.isAdvancedSearch()).toBe(true);
    component.toggleAdvancedSearch();
    expect(component.isAdvancedSearch()).toBe(false);
  });

  it('#onSubmit', () => {
    jest.spyOn(component.search, 'emit');
    component.onSubmit();
    expect(component.search.emit).toHaveBeenCalledWith(component.form.value);
  });

  it('#setInputValue', () => {
    component.setInputValue('test', 'requestId');
    expect(component.form.get('requestId')?.value).toBe('test');
  });
});
