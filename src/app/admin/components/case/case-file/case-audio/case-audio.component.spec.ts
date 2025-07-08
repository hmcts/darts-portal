import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseAudioComponent } from './case-audio.component';

describe('CaseAudioComponent', () => {
  let component: CaseAudioComponent;
  let fixture: ComponentFixture<CaseAudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseAudioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit page number on onPageChange()', () => {
    const emitSpy = jest.spyOn(component.pageChange, 'emit');

    component.onPageChange(3);

    expect(emitSpy).toHaveBeenCalledWith(3);
  });

  it('should emit valid sort object on onSortChange()', () => {
    const emitSpy = jest.spyOn(component.sortChange, 'emit');

    const sort = { sortBy: 'startTime', sortOrder: 'asc' as const };

    component.onSortChange(sort);

    expect(emitSpy).toHaveBeenCalledWith(sort);
  });

  it('should not emit on onSortChange() if sortBy is invalid', () => {
    const emitSpy = jest.spyOn(component.sortChange, 'emit');

    const sort = { sortBy: 'invalidField', sortOrder: 'asc' as const };

    component.onSortChange(sort);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should define 5 sortable columns with correct props', () => {
    const columnProps = component.columns.map((col) => col.prop);
    expect(columnProps).toEqual(['audioId', 'courtroom', 'startTime', 'endTime', 'channel']);

    component.columns.forEach((col) => {
      expect(col.sortable).toBe(true);
    });
  });
});
