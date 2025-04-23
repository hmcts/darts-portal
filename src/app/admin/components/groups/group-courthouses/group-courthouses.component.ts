import {Component, EventEmitter, Input, Output, signal, OnInit} from '@angular/core';
import {DataTableComponent} from '@common/data-table/data-table.component';
import {GovukHeadingComponent} from '@common/govuk-heading/govuk-heading.component';
import {CourthouseData} from '@core-types/index';
import {TableRowTemplateDirective} from '@directives/table-row-template.directive';

@Component({
  selector: 'app-group-courthouses',
  standalone: true,
  imports: [GovukHeadingComponent, DataTableComponent, TableRowTemplateDirective],
  templateUrl: './group-courthouses.component.html',
  styleUrl: './group-courthouses.component.scss',
})
export class GroupCourthousesComponent implements OnInit {
  @Input() globalAccess: boolean = false;
  @Input() allCourthouses: CourthouseData[] = [];
  @Input() selectedCourthouses: CourthouseData[] = [];
  @Output() update = new EventEmitter<{
    selectedCourthouses: CourthouseData[],
    addedCourtHouse?: CourthouseData,
    removedCourtHouse?: CourthouseData,
  }>();
  allNotSelectedCourthouses = signal(this.allCourthouses);


  ngOnInit(): void {
    this.updateCourthouseSelection();
  }

  onAddCourthouse(courthouseId: string) {
    if (!courthouseId && courthouseId !== '0') return;

    const courthouse = this.findCourthouseById(parseInt(courthouseId));
    const courthouseNotSelected = !this.selectedCourthouses.find((c) => c.id === +courthouseId);

    if (courthouse && courthouseNotSelected) {
      this.selectedCourthouses = [...this.selectedCourthouses, courthouse];
      this.emitCourthouse({addedCourthouse: courthouse});
    }
    this.updateCourthouseSelection();
  }


  updateCourthouseSelection() {
    console.log(this.selectedCourthouses);
    const selectedIds = new Set(this.selectedCourthouses.map(courthouse => courthouse.id));
    this.allNotSelectedCourthouses.set(this.allCourthouses.filter(courthouse => !selectedIds.has(courthouse.id)));
  }

  private findCourthouseById(courthouseId: number): CourthouseData {
    return <CourthouseData>this.allCourthouses.find((c) => c.id === +courthouseId);
  }

  onRemoveCourthouse(courthouseId: number) {
    this.selectedCourthouses = this.selectedCourthouses.filter((c) => c.id !== courthouseId);

    const courthouse = this.findCourthouseById(courthouseId);
    this.emitCourthouse({removedCourthouse: courthouse});
    this.updateCourthouseSelection();
  }

  emitCourthouse({addedCourthouse, removedCourthouse}: {
    addedCourthouse?: CourthouseData,
    removedCourthouse?: CourthouseData
  }) {
    this.update.emit({
      selectedCourthouses: this.selectedCourthouses,
      addedCourtHouse: addedCourthouse,
      removedCourtHouse: removedCourthouse
    });
  }
}
