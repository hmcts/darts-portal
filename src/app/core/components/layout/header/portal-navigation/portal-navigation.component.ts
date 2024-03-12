import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-portal-navigation',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './portal-navigation.component.html',
  styleUrl: './portal-navigation.component.scss',
})
export class PortalNavigationComponent {
  @Input() assignedTranscriptCount = 0;
  @Input() unreadAudioCount = 0;
  @Input() unassignedTranscriptCount = 0;

  @Input() isTranscriber = false;
  @Input() isJudge = false;
  @Input() isApprover = false;
  @Input() isRequester = false;
}
