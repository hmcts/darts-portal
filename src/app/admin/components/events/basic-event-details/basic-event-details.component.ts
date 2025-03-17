import { Event } from '@admin-types/events';
import { AssociatedCase } from '@admin-types/transformed-media/associated-case';
import { AssociatedHearing } from '@admin-types/transformed-media/associated-hearing';
import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { AssociatedCasesTableComponent } from '../../audio-file/associated-cases-table/associated-cases-table.component';
import { AssociatedHearingsTableComponent } from '../../audio-file/associated-hearings-table/associated-hearings-table.component';

@Component({
  selector: 'app-basic-event-details',
  standalone: true,
  imports: [LuxonDatePipe, GovukHeadingComponent, AssociatedCasesTableComponent, AssociatedHearingsTableComponent],
  templateUrl: './basic-event-details.component.html',
  styleUrl: './basic-event-details.component.scss',
})
export class BasicEventDetailsComponent implements OnInit {
  url = inject(Router).url;

  event = input.required<Event>();

  associatedCases: AssociatedCase[] = [];
  associatedHearings: AssociatedHearing[] = [];

  cleanedUrl = this.getCleanedUrl();

  ngOnInit() {
    this.associatedCases = this.getAssociatedCasesFromEvent(this.event());
    this.associatedHearings = this.getAssociatedHearingsFromEvent(this.event());
  }

  private getAssociatedCasesFromEvent(event: Event): AssociatedCase[] {
    return (
      event.cases?.map((c) => ({
        caseId: c.id,
        caseNumber: c.caseNumber ?? 'Unknown',
        courthouse: c.courthouse.displayName ?? 'Unknown',
      })) ?? []
    );
  }

  private getAssociatedHearingsFromEvent(event: Event): AssociatedHearing[] {
    return (
      event.hearings?.map((h) => ({
        caseId: h.caseId,
        hearingId: h.id,
        caseNumber: h.caseNumber ?? 'Unknown',
        hearingDate: h.hearingDate,
        courthouse: h.courthouse.displayName ?? 'Unknown',
        courtroom: h.courtroom?.name ?? 'Unknown',
      })) ?? []
    );
  }

  private getCleanedUrl(): string {
    return this.url.split('?')[0];
  }
}
