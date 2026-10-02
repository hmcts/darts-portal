import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

type Outcome = 'complete' | 'unfulfilled';
@Component({
  selector: 'app-completed-transcript',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './completed-transcript.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
