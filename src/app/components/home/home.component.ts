import { CaseService } from 'src/app/services/case/case.service';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { DateTimeService } from '@services/datetime/datetime.service';
import { CaseData } from '@darts-types/case';
import { HearingData } from '@darts-types/hearing';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [RouterLink, DataTableComponent, AsyncPipe, CommonModule],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private caseService: CaseService) {}

  public redirect() {
    if (localStorage.getItem('redirectUrl') !== null) {
      this.router.navigateByUrl(`${localStorage.getItem('redirectUrl')}`);
      localStorage.removeItem('redirectUrl');
    }
  }

  caseRows$ = this.caseService.getCasesAdvanced({ case_number: 'ALL' }).pipe(
    map((cases) =>
      cases.map((c) => {
        return {
          id: c.case_id,
          caseNumber: c.case_number,
          courthouse: c.courthouse,
          courtroom: this.getHearingsValue(c, 'courtroom'),
          judges: this.getNameValue(c.judges),
          defendants: this.getNameValue(c.defendants),
          reporting_restriction: c.reporting_restriction,
        };
      })
    )
  );

  columns = [
    { name: 'Case ID', prop: 'caseNumber', sortable: true, link: '/case' },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Courtroom', prop: 'courtroom', sortable: false },
    { name: 'Judge(s)', prop: 'judges', sortable: false },
    { name: 'Defendants(s)', prop: 'defendants', sortable: false },
  ];

  ngOnInit(): void {
    this.redirect();
  }

  //Fetches correct display value for defendants and judges
  getNameValue(arr: string[] | undefined): string {
    if (arr) {
      if (arr.length === 0) {
        return '';
      } else {
        if (arr.length < 2) {
          return arr[0];
        } else {
          return 'Multiple';
        }
      }
    } else {
      return '';
    }
  }

  //Fetches correct display value for dates and courtrooms
  getHearingsValue(c: CaseData, key: keyof HearingData): string {
    if (!c.hearings || c.hearings.length === 0) {
      return '';
    } else {
      if (c.hearings.length < 2) {
        if (key === 'date') {
          return this.getDateFormat(c.hearings[0][key]);
        } else {
          return c.hearings[0][key] as string;
        }
      } else {
        return 'Multiple';
      }
    }
  }

  private getDateFormat(d: string): string {
    return DateTimeService.getdddDMMMYYYY(d);
  }
}
