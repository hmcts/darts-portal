import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CountNotificationService } from '@services/count-notification/count-notification.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-portal-navigation',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './portal-navigation.component.html',
  styleUrl: './portal-navigation.component.scss',
})
export class PortalNavigationComponent {
  countService = inject(CountNotificationService);
  userService = inject(UserService);

  unreadAudioCount$ = this.countService.unreadAudio$;
  unassignedTranscriptCount$ = this.countService.unassignedTranscripts$;
  assignedTranscriptCount$ = this.countService.assignedTranscripts$;
}
