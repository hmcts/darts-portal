import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourthouseData } from '@core-types/index';
import { GroupCourthousesComponent } from './group-courthouses.component';

describe('GroupCourthousesComponent', () => {
  let component: GroupCourthousesComponent;
  let fixture: ComponentFixture<GroupCourthousesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupCourthousesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupCourthousesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add courthouse to selectedCourthouses when onAddCourthouse is called', () => {
    const courthouseId = '1';
    const courthouseData = { id: 1, name: 'Courthouse 1' } as unknown as CourthouseData;
    component.allCourthouses = [courthouseData];
    component.selectedCourthouses = [];
    component.onAddCourthouse(courthouseId);
    expect(component.selectedCourthouses).toContain(courthouseData);
  });

  it('should add courthouse to selectedCourthouses when onAddCourthouse is called', () => {
    const courthouseId = '';
    jest.spyOn(component.update, 'emit');
    component.onAddCourthouse(courthouseId);

    expect(component.update.emit).not.toHaveBeenCalled();
  });

  it('should not add courthouse to selectedCourthouses if it is already selected', () => {
    const courthouseId = '1';
    const courthouseData = { id: 1, name: 'Courthouse 1' } as unknown as CourthouseData;
    component.allCourthouses = [courthouseData];
    component.selectedCourthouses = [courthouseData];
    component.onAddCourthouse(courthouseId);
    expect(component.selectedCourthouses.length).toBe(1);
  });

  it('should remove courthouse from selectedCourthouses when onRemoveCourthouse is called', () => {
    const courthouseId = 1;
    const courthouseData = { id: courthouseId, name: 'Courthouse 1' } as unknown as CourthouseData;
    component.selectedCourthouses = [courthouseData];
    component.onRemoveCourthouse(courthouseId);
    expect(component.selectedCourthouses.length).toBe(0);
  });

  it('should emit courthouse ids when emitCourthouseIds is called', () => {
    const courthouseData = { id: 1, name: 'Courthouse 1' } as unknown as CourthouseData;
    component.selectedCourthouses = [courthouseData];
    jest.spyOn(component.update, 'emit');
    component.emitCourthouseIds();
    expect(component.update.emit).toHaveBeenCalledWith([1]);
  });
});
