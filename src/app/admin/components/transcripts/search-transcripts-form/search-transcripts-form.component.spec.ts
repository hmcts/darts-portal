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
    expect(component.isAdvancedSearch).toBe(true);
    component.toggleAdvancedSearch();
    expect(component.isAdvancedSearch).toBe(false);
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

  it('#requestedDateTypeControl', () => {
    expect(component.requestedDateTypeControl).toBe(component.form.controls.requestedDate.controls.type);
  });

  it('#requestedDateFromControl', () => {
    expect(component.requestedDateFromControl).toBe(component.form.controls.requestedDate.controls.from);
  });

  it('#requestedDateToControl', () => {
    expect(component.requestedDateToControl).toBe(component.form.controls.requestedDate.controls.to);
  });

  it('#requestedDateSpecificControl', () => {
    expect(component.requestedDateSpecificControl).toBe(component.form.controls.requestedDate.controls.specific);
  });

  describe('#ngOnInit', () => {
    it('should reset date values when requested date type changes', () => {
      component.requestedDateSpecificControl.setValue('test');
      component.requestedDateFromControl.setValue('test');
      component.requestedDateToControl.setValue('test');

      component.requestedDateTypeControl.setValue('range');

      expect(component.requestedDateSpecificControl.value).toBe('');
      expect(component.requestedDateFromControl.value).toBe('');
      expect(component.requestedDateToControl.value).toBe('');
    });
  });
});
