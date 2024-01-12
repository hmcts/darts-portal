import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  inject,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AudioPlayerComponent } from '@common/audio-player/audio-player.component';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { HearingEventTypeEnum } from '@darts-types/enums';
import { AudioEventRow, DatatableColumn, HearingAudio, HearingEvent } from '@darts-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { DateTime } from 'luxon';
import { Subscription, Observable } from 'rxjs';
import * as _ from 'lodash';
import { FileDownloadService } from '@services/file-download/file-download.service';

@Component({
  selector: 'app-events-and-audio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AudioPlayerComponent, DataTableComponent, TableRowTemplateDirective],
  templateUrl: './events-and-audio.component.html',
  styleUrls: ['./events-and-audio.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsAndAudioComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChildren(AudioPlayerComponent) audioPlayers!: QueryList<AudioPlayerComponent>;
  @Input() audio: HearingAudio[] = [];
  @Input() events: HearingEvent[] = [];
  filedownloadService = inject(FileDownloadService);

  @Output() eventsSelect = new EventEmitter<AudioEventRow[]>();

  columns: DatatableColumn[] = [
    { name: 'Time', prop: 'timestamp', sortable: true, width: '180px' },
    { name: 'Event', prop: 'event' },
    { name: 'Text', prop: 'text', width: '700px' },
  ];

  rows: AudioEventRow[] = [];
  filteredRows: AudioEventRow[] = [];

  selectedRows: AudioEventRow[] = [];
  selectedOption = new FormControl('all');
  formChanges$ = this.selectedOption.valueChanges;
  audioPreviewPath = '/api/audio/preview5/';
  audioSource = '';

  subs: Subscription[] = [];
  audioInPreview: number[] = [];

  ngOnInit(): void {
    this.subs.push(
      this.formChanges$.subscribe((valueChanges) => {
        this.onFilterChanged(valueChanges as string);
      })
    );
//     this.connect();
    this.getAudioPreview('http://localhost:3000/api/audio/preview5/3533').subscribe((url)=> this.audioSource = url);  }

//   connect(): void {
//       let source = new EventSource('http://localhost:3000/api/audio/preview5/3533');
//       source.addEventListener('real response', message => {
//           const myData = JSON.parse(message.data);
//           console.log(myData);
//           const blob = new Blob([myData.body], { type: 'audio/mpeg' });
//       });
//    }

  getAudioPreview(path: string) : Observable<string>{
    return new Observable(observer => {
      let eventSource = new EventSource('http://localhost:3000/api/audio/preview5/3533');
//new Blob([new Uint8Array(BYTEARRAY)]
          eventSource.addEventListener('real response', message => {
              const myData = JSON.parse(message.data);
              const responseBody = myData.body;
              //const blob = new Blob([myData.body], { type: 'audio/mpeg' });
              const blob = this.b64toBlob(responseBody);
//               let bytes = new Uint8Array(responseBody.length);
//
//               for (let i = 0; i < bytes.length; i++) {
//                   bytes[i] = responseBody.charCodeAt(i);
//               }
//
//               let blob = new Blob([bytes], { type: 'audio/mpeg' });

              console.log("data="+blob);
              //console.log(blob);
              const blobUrl = window.URL.createObjectURL(blob)
              console.log(blobUrl);
              //this.filedownloadService.saveAs(blob, 'test.mp3')
              observer.next(blobUrl);
          });

      eventSource.onerror = () => {
        if (eventSource.readyState !== eventSource.CONNECTING) {
          observer.error('An error occurred.');
        }
        eventSource.close();
        console.log("Closing connection2");
        observer.complete();
      };
      return () => {
        console.log("Closing connection");
        eventSource.close();
      };
    });
  }


b64toBlob(b64Data: any) {
  const contentType = 'audio/mpeg';
  const sliceSize = 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}


  ngOnChanges(): void {
    this.constructTable();
  }

  onRowSelect(rows: AudioEventRow[]) {
    this.eventsSelect.emit(rows);
  }

  toggleRowSelection(row: AudioEventRow) {
    const index = this.selectedRows.indexOf(row);
    if (index === -1) {
      // Row not selected, add it to the selection
      this.selectedRows.push(row);
    } else {
      // Row already selected, remove it from the selection
      this.selectedRows.splice(index, 1);
    }
    this.eventsSelect.emit(this.selectedRows);
  }

  isRowSelected(row: AudioEventRow) {
    return this.selectedRows.includes(row);
  }

  onSelectAllChanged(checked: boolean) {
    if (checked) {
      this.selectedRows = [...this.filteredRows];
    } else {
      this.selectedRows = [];
    }
    this.eventsSelect.emit(this.selectedRows);
  }

  onFilterChanged(selectedOption: string) {
    if (selectedOption === 'all') {
      this.filteredRows = [...this.rows];
    } else {
      this.filteredRows = this.rows.filter((row) => row.type === HearingEventTypeEnum.Event);
    }
  }

  onAudioPlay(id: number) {
    this.audioPlayers.toArray().forEach((player) => {
      if (player.id !== id) {
        player?.pausePlayer();
      }
    });
  }

  private constructTable() {
    this.mapEventsAndAudioToTable();
    this.sortTableByTimeStamp(this.rows);
    this.filteredRows = [...this.rows];
  }

  private mapEventsAndAudioToTable() {
    this.rows = [
      ...this.audio.map((audio) => ({
        ...audio,
        type: HearingEventTypeEnum.Audio,
        timestamp: audio.media_start_timestamp,
      })),
      ...this.events.map((event) => ({ ...event, type: HearingEventTypeEnum.Event })),
    ];
  }

  private sortTableByTimeStamp(table: AudioEventRow[]) {
    table.sort((a, b) => {
      const timestampA = DateTime.fromISO(a.timestamp ?? '')
        .toUTC()
        .toUnixInteger();
      const timestampB = DateTime.fromISO(b.timestamp ?? '')
        .toUTC()
        .toUnixInteger();

      return timestampA - timestampB;
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
