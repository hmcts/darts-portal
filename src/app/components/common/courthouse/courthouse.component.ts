import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CourthouseData } from '@darts-types/index';
import { CaseService } from '@services/case/case.service';
import accessibleAutocomplete, { AccessibleAutocompleteProps } from 'accessible-autocomplete';

@Component({
  selector: 'app-courthouse-field',
  standalone: true,
  imports: [NgIf],
  templateUrl: './courthouse.component.html',
  styleUrls: ['./courthouse.component.scss'],
})
export class CourthouseComponent implements OnInit {
  @ViewChild('courthouseAutocomplete', { static: false }) autocomplete!: ElementRef<HTMLElement>;
  loaded = false;
  loadError = false;
  courthouses: CourthouseData[] = [];

  props: AccessibleAutocompleteProps = {
    id: 'courthouse',
    source: [],
    minLength: 1,
    name: 'courthouse',
  };

  constructor(private caseService: CaseService) {}

  getCourthouses() {
    this.caseService.getCourthouses().subscribe({
      next: (result: CourthouseData[]) => {
        if (result) {
          this.courthouses = result;
          // populate autocomplete once returned
          this.props.element = this.autocomplete.nativeElement as HTMLElement;
          this.props.source = this.courthouses.map((ch) => ch.courthouse_name);
          accessibleAutocomplete(this.props);
          this.loaded = true;
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.error) {
          this.loaded = true;
          this.loadError = true;
        }
      },
    });
  }

  ngOnInit(): void {
    this.getCourthouses();
  }
}
