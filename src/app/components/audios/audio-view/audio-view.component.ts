import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AudioService } from '@services/audio/audio.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-audio-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-view.component.html',
  styleUrls: ['./audio-view.component.scss'],
})
export class AudioViewComponent {
  audioService = inject(AudioService);
  patchResponse$: Observable<HttpResponse<Response>>;

  constructor(private router: Router, private route: ActivatedRoute) {
    //Send request to update last accessed time of audio
    this.patchResponse$ = this.audioService.patchAudioRequest(this.route.snapshot.params.requestId);
    //////////
    //Temporary code to go back to audios, observe: 'response' can be removed from audio service call when below is removed
    this.patchResponse$.subscribe((response: HttpResponse<Response>) => {
      if (response.status === 200) {
        router.navigateByUrl('audios');
      }
    });
    /////////
  }
}
