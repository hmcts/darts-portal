import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { CourthouseData } from '@core-types/index';

@Component({
  selector: 'app-group-courthouses',
  standalone: true,
  imports: [GovukHeadingComponent],
  templateUrl: './group-courthouses.component.html',
  styleUrl: './group-courthouses.component.scss',
})
export class GroupCourthousesComponent {
  @Input() allCourthouses: CourthouseData[] = [];
  @Input() selectedCourthouses: CourthouseData[] = [];
  @Output() update = new EventEmitter<number[]>();

  onAddCourthouse(courthouseId: string) {
    const courthouse = this.allCourthouses.find((c) => c.id === +courthouseId);
    const courthouseNotSelected = !this.selectedCourthouses.find((c) => c.id === +courthouseId);

    if (courthouse && courthouseNotSelected) {
      this.selectedCourthouses.push(courthouse);
      this.emitCourthouseIds();
    }
  }

  onRemoveCourthouse(courthouseId: number) {
    this.selectedCourthouses = this.selectedCourthouses.filter((c) => c.id !== courthouseId);
    this.emitCourthouseIds();
  }

  emitCourthouseIds() {
    this.update.emit(this.selectedCourthouses.map((c) => c.id));
  }
}
