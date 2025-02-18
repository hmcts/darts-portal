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

  describe('#restoreFormValues', () => {
    it('should restore form values and set courthouse if provided', () => {
      const mockFormValues = {
        requestId: '123',
        caseId: 'XYZ',
        courthouse: 'Manchester',
        hearingDate: '15/08/2023',
        owner: 'John Doe',
        requestedBy: 'Jane Doe',
        requestedDate: { type: '', specific: '', from: '', to: '' },
      };

      component.formValues.set(mockFormValues);

      component.restoreFormValues();

      expect(component.form.value).toEqual(expect.objectContaining(mockFormValues));
      expect(component.courthouse()).toBe('Manchester');
    });

    it('should not set courthouse if it is not provided', () => {
      const mockFormValues = {
        requestId: '456',
        caseId: 'ABC',
        courthouse: '',
        hearingDate: '10/07/2023',
        owner: 'Alice Smith',
        requestedBy: 'Bob Johnson',
        requestedDate: { type: '', specific: '', from: '', to: '' },
      };

      component.formValues.set(mockFormValues);

      component.restoreFormValues();

      expect(component.form.value).toEqual(expect.objectContaining(mockFormValues));
      expect(component.courthouse()).toBe('');
    });
  });
});
