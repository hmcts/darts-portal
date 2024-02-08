import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserAdminService } from '@services/user-admin.service';

@Component({
  selector: 'app-user-record',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-record.component.html',
  styleUrl: './user-record.component.scss',
})
export class UserRecordComponent {
  userAdminSvc = inject(UserAdminService);
  route = inject(ActivatedRoute);

  user$ = this.userAdminSvc.getUser(this.route.snapshot.params.userId);
}
