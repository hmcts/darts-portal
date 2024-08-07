import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { HeaderService } from '@services/header/header.service';

@Component({
  selector: 'app-audio-file-delete',
  standalone: true,
  imports: [GovukHeadingComponent, RouterLink],
  templateUrl: './audio-file-delete.component.html',
  styleUrl: './audio-file-delete.component.scss',
})
export class AudioFileDeleteComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  headerService = inject(HeaderService);

  isPermitted = this.router.getCurrentNavigation()?.extras?.state?.isPermitted;

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }
}
