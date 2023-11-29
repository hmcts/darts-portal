import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-completed-transcript',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './completed-transcript.component.html',
  styleUrl: './completed-transcript.component.scss',
})
export class CompletedTranscriptComponent {}
