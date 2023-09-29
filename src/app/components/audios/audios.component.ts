import { Component } from '@angular/core';
import { TabsComponent } from '@common/tabs/tabs.component';

@Component({
  selector: 'app-audios',
  templateUrl: './audios.component.html',
  styleUrls: ['./audios.component.scss'],
  standalone: true,
  imports: [TabsComponent],
})
export class AudiosComponent {
  tabs = ['Current', 'Expired'];
}
