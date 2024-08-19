import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CountNotificationService } from '@services/count-notification/count-notification.service';
import { UserService } from '@services/user/user.service';
import { map, shareReplay } from 'rxjs';

@Component({
  selector: 'app-portal-navigation',
  standalone: true,
  imports: [RouterLink, AsyncPipe, RouterLinkActive],
  templateUrl: './portal-navigation.component.html',
  styleUrl: './portal-navigation.component.scss',
})
export class PortalNavigationComponent {
  countService = inject(CountNotificationService);
  userService = inject(UserService);

  transcriptCount$ = this.countService.transcriptCount$.pipe(shareReplay(1));

  unreadAudioCount$ = this.countService.unreadAudio$;
  unassignedTranscriptCount$ = this.transcriptCount$.pipe(map((counts) => counts.unassigned));
  assignedTranscriptCount$ = this.transcriptCount$.pipe(map((counts) => counts.assigned));
}
