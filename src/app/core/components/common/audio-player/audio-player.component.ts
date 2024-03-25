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
import { Observable } from 'rxjs';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioPlayerComponent {
  @ViewChild('audioPlayer', { static: false }) audioPlayer!: ElementRef<HTMLAudioElement>;

  @Input() id!: number;
  @Input() audioSource: string | null = null;
  @Input() preload = true;
  @Input() autoplay = false;
  @Input() statusCode!: number;
  @Output() playTime = new EventEmitter<number>();
  @Output() pause = new EventEmitter<void>();
  @Output() play = new EventEmitter<void>();
  canPlay = false;

  private appConfigService = inject(AppConfigService);
  support = this.appConfigService.getAppConfig()?.support;

  statusCode$: Observable<number> | undefined;

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
