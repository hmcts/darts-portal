import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

type Outcome = 'complete' | 'unfulfilled';
@Component({
  selector: 'app-completed-transcript',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './completed-transcript.component.html',
  styleUrl: './completed-transcript.component.scss',
})
export class CompletedTranscriptComponent {
  private route = inject(ActivatedRoute);

  outcome: Outcome;

  constructor() {
    const snap = this.route.snapshot;
    const data = snap.data as { outcome?: Outcome };
    this.outcome = data.outcome ?? 'complete';
  }
}
