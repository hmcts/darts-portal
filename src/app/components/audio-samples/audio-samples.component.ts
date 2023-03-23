import { Component, OnInit } from '@angular/core';
import { AudioSample, AudioSamplesService } from 'src/app/services/audio-samples.service';

@Component({
  selector: 'app-audio-samples',
  templateUrl: './audio-samples.component.html',
  styleUrls: ['./audio-samples.component.scss'],
})
export class AudioSamplesComponent implements OnInit {
  sampleList: AudioSample[] | undefined;

  constructor(private audioSamplesService: AudioSamplesService) {}

  getAudioSamples() {
    this.audioSamplesService.getSampleList().subscribe((body) => {
      console.log('body', body);
      this.sampleList = body;
    });
  }

  public ngOnInit() {
    this.getAudioSamples();
  }
}
