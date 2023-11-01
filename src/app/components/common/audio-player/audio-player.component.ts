/* eslint-disable @angular-eslint/no-output-native */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

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

  @Input() audioSource: string | null = null;
  @Output() playTime = new EventEmitter<number>();
  @Output() pause = new EventEmitter<void>();
  @Output() play = new EventEmitter<void>();

  canPlay = false;

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
}
