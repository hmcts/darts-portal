import { OnInit, OnDestroy } from '@angular/core';
/* eslint-disable @angular-eslint/no-output-native */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { AppConfigService } from '@services/app-config/app-config.service';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { ErrorMessageService } from '@services/error/error-message.service';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('audioPlayer', { static: false }) audioPlayer!: ElementRef<HTMLAudioElement>;

  @Input() id!: number;
  @Input() preview = new Boolean();
  @Input() preload = true;
  @Output() playTime = new EventEmitter<number>();
  @Output() pause = new EventEmitter<void>();
  @Output() play = new EventEmitter<void>();

  private appConfigService = inject(AppConfigService);
  support = this.appConfigService.getAppConfig()?.support;
  audioService = inject(AudioRequestService);
  errorMsgService = inject(ErrorMessageService);

  canPlay = false;
  loaded = false;
  errorMsg = false;
  error$ = this.errorMsgService.errorMessage$.pipe(take(2));

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

  getAudioSource() {
    if (this.preview) {
      this.handleAudio(this.audioService.getAudioPreview(this.id));
    } else {
      this.handleAudio(this.audioService.downloadAudio(this.id, 'PLAYBACK'));
    }
  }

  handleAudio(audio: Observable<Blob>) {
    this.canPlay = true;
    audio.subscribe({
      next: (blob: Blob) => {
        this.audioPlayer.nativeElement.src = URL.createObjectURL(blob);
        this.audioPlayer.nativeElement.load();
      },
    });
  }

  ngOnInit(): void {
    this.getAudioSource();
  }

  ngOnDestroy(): void {
    this.errorMsgService.clearErrorMessage();
  }
}
