import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourthouseData } from '@core-types/index';
import { GroupCourthousesComponent } from './group-courthouses.component';

describe('GroupCourthousesComponent', () => {
  let component: GroupCourthousesComponent;
  let fixture: ComponentFixture<GroupCourthousesComponent>;
  let courthouseData: CourthouseData[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupCourthousesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupCourthousesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    courthouseData = [{ id: 1, name: 'Courthouse 1' } as unknown as CourthouseData];
    component.allCourthouses = courthouseData;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.allNotSelectedCourthouses()).toContain(courthouseData[0]);
  });

  it('should remove courthouse from allNotSelectedCourthouses when onAddCourthouse is called', () => {
    jest.spyOn(component.update, 'emit');
    expect(component.allNotSelectedCourthouses()).toContain(courthouseData[0]);
    component.selectedCourthouses = [];
    component.onAddCourthouse(courthouseData[0].id.toString());
    expect(component.selectedCourthouses).toContain(courthouseData[0]);
    expect(component.allNotSelectedCourthouses()).not.toContain(courthouseData[0]);
    expect(component.update.emit).toHaveBeenCalledWith({
      selectedCourthouses: courthouseData,
      addedCourtHouse: courthouseData[0],
      removedCourtHouse: undefined,
    });
  });

  it('should add courthouse to selectedCourthouses when onAddCourthouse is called', () => {
    const courthouseId = '1';
    component.selectedCourthouses = [];
    component.onAddCourthouse(courthouseId);
    expect(component.selectedCourthouses).toContain(courthouseData[0]);
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

  it('should add courthouse to allNotSelectedCourthouses when onRemoveCourthouse is called', () => {
    jest.spyOn(component.update, 'emit');

    component.selectedCourthouses = courthouseData;
    component.updateCourthouseSelection();

    expect(component.allNotSelectedCourthouses()).not.toContain(courthouseData[0]);
    component.onRemoveCourthouse(courthouseData[0].id);
    expect(component.selectedCourthouses).not.toContain(courthouseData[0]);
    expect(component.allNotSelectedCourthouses()).toContain(courthouseData[0]);

    expect(component.update.emit).toHaveBeenCalledWith({
      selectedCourthouses: [],
      addedCourtHouse: undefined,
      removedCourtHouse: courthouseData[0],
    });
  });

  it('should remove courthouse from selectedCourthouses when onRemoveCourthouse is called', () => {
    const courthouseId = 1;
    component.selectedCourthouses = courthouseData;
    component.onRemoveCourthouse(courthouseId);
    expect(component.selectedCourthouses.length).toBe(0);
  });

  it('should emit selectedCourthouses when emitCourthouse is called with no args', () => {
    component.selectedCourthouses = courthouseData;
    jest.spyOn(component.update, 'emit');
    component.emitCourthouse({});
    expect(component.update.emit).toHaveBeenCalledWith({
      selectedCourthouses: courthouseData,
      addedCourtHouse: undefined,
      removedCourtHouse: undefined,
    });
  });

  it('should emit selectedCourthouses and addedCourtHouse when emitCourthouse is called with addedCourtHouse arg', () => {
    component.selectedCourthouses = courthouseData;
    jest.spyOn(component.update, 'emit');
    const addedCourtHouse = { id: 2, name: 'Courthouse 2' } as unknown as CourthouseData;
    component.emitCourthouse({ addedCourthouse: addedCourtHouse });
    expect(component.update.emit).toHaveBeenCalledWith({
      selectedCourthouses: courthouseData,
      addedCourtHouse: addedCourtHouse,
      removedCourtHouse: undefined,
    });
  });

  it('should emit selectedCourthouses and removedCourtHouse when emitCourthouse is called with removedCourtHouse arg', () => {
    component.selectedCourthouses = courthouseData;
    jest.spyOn(component.update, 'emit');
    const removedCourtHouse = { id: 2, name: 'Courthouse 2' } as unknown as CourthouseData;
    component.emitCourthouse({ removedCourthouse: removedCourtHouse });
    expect(component.update.emit).toHaveBeenCalledWith({
      selectedCourthouses: courthouseData,
      addedCourtHouse: undefined,
      removedCourtHouse: removedCourtHouse,
    });
  });
});
