import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTranscriptsFormComponent } from './search-transcripts-form.component';

describe('SearchTranscriptsFormComponent', () => {
  let component: SearchTranscriptsFormComponent;
  let fixture: ComponentFixture<SearchTranscriptsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchTranscriptsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchTranscriptsFormComponent);
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
        caseId: 'ABC',
        courthouse: 'Reading',
        hearingDate: '01/01/2023',
        requestedBy: 'Jane Doe',
        requestedDate: { type: '', specific: '', from: '', to: '' },
        requestMethod: 'Manual',
      };

      component.formValues.set(mockFormValues);

      component.restoreFormValues();

      expect(component.form.value).toEqual(mockFormValues);
      expect(component.courthouse()).toBe('Reading');
    });

    it('should not set courthouse if it is not provided', () => {
      const mockFormValues = {
        requestId: '123',
        caseId: 'ABC',
        courthouse: '',
        hearingDate: '01/01/2023',
        requestedBy: 'Jane Doe',
        requestedDate: { type: '', specific: '', from: '', to: '' },
        requestMethod: 'Manual',
      };

      component.formValues.set(mockFormValues);

      component.restoreFormValues();

      expect(component.form.value).toEqual(mockFormValues);
      expect(component.courthouse()).toBe('');
    });
  });
});
