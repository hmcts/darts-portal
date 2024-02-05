/* eslint-disable @angular-eslint/no-output-native */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import { AudioRequestService } from 'src/app/portal/services/audio-request/audio-request.service';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioPlayerComponent implements OnInit {
  @ViewChild('audioPlayer', { static: false }) audioPlayer!: ElementRef<HTMLAudioElement>;

  @Input() id!: number;
  @Input() audioSource: string | null = null;
  @Input() preload = true;
  @Output() playTime = new EventEmitter<number>();
  @Output() pause = new EventEmitter<void>();
  @Output() play = new EventEmitter<void>();

  audioService = inject(AudioRequestService);
  statusCode$: Observable<number> | undefined;

  private appConfigService = inject(AppConfigService);
  support = this.appConfigService.getAppConfig()?.support;

  canPlay = false;
  isError = false;

  ngOnInit() {
    if (this.audioSource) {
      this.statusCode$ = this.audioService.getStatusCode(this.audioSource);
    }
  }

  setPlayTime(time: number, shouldPlay: boolean): void {
    if (this.canPlay) {
      this.audioPlayer.nativeElement.currentTime = time;
      if (shouldPlay) {
        this.audioPlayer.nativeElement.play();
      } else {
        this.audioPlayer.nativeElement.pause();
      }
    }
  }

  onTimeUpdate() {
    this.playTime.emit(this.audioPlayer.nativeElement.currentTime);
  }

  pausePlayer() {
    this.audioPlayer.nativeElement.pause();
  }
}
