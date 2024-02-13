import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { filter } from 'rxjs';
import { HeaderService } from 'src/app/core/services/header/header.service';
import { ContentComponent } from '../layout/content/content.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { HeaderComponent } from '../layout/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [HeaderComponent, ContentComponent, FooterComponent, RouterLink],
})
export class AppComponent {
  title = 'DARTS portal';
  currentUrl = '';
  constructor(
    private headerService: HeaderService,
    private router: Router
  ) {
    // If url changes show navigation in case it is hidden
    // This is useful if a user improperly navigates away from a confirmation screen
    // via the browser back button, for example.
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((e) => {
      this.currentUrl = (e as NavigationEnd).url.split('#')[0];
      this.headerService.showNavigation();
    });
  }
}
