import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit {
  @Input() mediaId: number | null = null;
  audioSource: string | null = null;
  canPlay = false;

  ngOnInit(): void {
    this.audioSource = `/api/audio/preview/${this.mediaId}`;
  }
}
