import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HearingFileComponent } from './hearing-file/hearing-file.component';
import { CaseDataService } from 'src/app/services/case/data/case-data.service';
import { CaseData } from 'src/app/types/case';
import { HearingData } from 'src/app/types/hearing';
import { ActivatedRoute } from '@angular/router';
import { CaseService } from 'src/app/services/case/case.service';
import { EventsAndAudioComponent } from './events-and-audio/events-and-audio.component';
import { HearingService } from 'src/app/services/hearing/hearing.service';
import { combineLatest } from 'rxjs';
import { HearingAudioEventViewModel } from 'src/app/types/hearing-audio-event';

@Component({
  selector: 'app-hearing',
  standalone: true,
  imports: [CommonModule, HearingFileComponent, EventsAndAudioComponent],
  templateUrl: './hearing.component.html',
  styleUrls: ['./hearing.component.scss'],
})
export class HearingComponent implements OnInit {
  case!: CaseData;
  hearing!: HearingData;

  constructor(
    private route: ActivatedRoute,
    private caseDataService: CaseDataService,
    private caseService: CaseService
  ) {}

  hearingService = inject(HearingService);

  hearingId = this.route.snapshot.params.hearing_id;
  caseId = this.route.snapshot.params.caseId;

  audio$ = this.hearingService.getAudio(this.hearingId);
  events$ = this.hearingService.getEvents(this.hearingId);
  audioAndEvents$ = combineLatest({ audio: this.audio$, events: this.events$ });

  ngOnInit(): void {
    this.loadData();
  }

  //Loads single case and hearing from either shared service or API
  loadData(): void {
    const c = this.caseDataService.getCase();
    if (c) {
      this.case = c;
    }
    const hearing = this.caseDataService.getHearingById(this.hearingId);
    if (hearing) {
      this.hearing = hearing;
    }

    if (!c || !hearing) {
      this.loadFromApi();
    }
  }

  //Loads case and hearing data from API to persist data, e.g. after refresh
  loadFromApi(): void {
    console.log('loading case and hearing data directly from api due to events such as refresh');
    this.getCaseFileApi();
    this.getHearingsApi();
  }

  //Executes API request for getting hearings and assigns to hearings variable
  getHearingsApi(): void {
    this.caseService.getCaseHearings(this.caseId).subscribe({
      next: (hearings: HearingData[]) => {
        const hearing = this.caseDataService.getHearingById(this.hearingId, hearings);
        if (hearing) {
          this.hearing = hearing;
        }
      },
    });
  }

  //Executes API request for specific case file and assigns to case variable
  getCaseFileApi(): void {
    this.caseService.getCaseFile(this.caseId).subscribe({
      next: (result: CaseData) => {
        this.case = result;
      },
    });
  }

  onEventsSelected(audioAndEvents: HearingAudioEventViewModel[]) {
    console.log(audioAndEvents);
  }
}
