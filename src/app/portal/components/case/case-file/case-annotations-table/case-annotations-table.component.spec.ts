import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseAnnotationsTableComponent } from './case-annotations-table.component';

describe('CaseAnnotationsTableComponent', () => {
  let component: CaseAnnotationsTableComponent;
  let fixture: ComponentFixture<CaseAnnotationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseAnnotationsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseAnnotationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onDeleteClicked', () => {
    it('emits deleteAnnotation event', () => {
      const spy = jest.spyOn(component.deleteAnnotation, 'emit');
      component.onDeleteClicked(1);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('onDownloadAnnotation', () => {
    it('emits downloadAnnotation event', () => {
      const spy = jest.spyOn(component.downloadAnnotation, 'emit');
      component.onDownloadClicked(1, 2, 'file.pdf');
      expect(spy).toHaveBeenCalledWith({ annotationId: 1, annotationDocumentId: 2, fileName: 'file.pdf' });
    });
  });
});
