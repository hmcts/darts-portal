import { AdminHearing } from '@admin-types/hearing/hearing.type';
import { AsyncPipe } from '@angular/common';
import { Component, inject, input, numberAttribute, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdminHearingService } from '@services/admin-hearing/admin-hearing.service';
import { HistoryService } from '@services/history/history.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { map, Observable, switchMap } from 'rxjs';
import { HearingFileComponent } from './hearing-file/hearing-file.component';

@Component({
  selector: 'app-hearing',
  imports: [RouterLink, HearingFileComponent, AsyncPipe],
  templateUrl: './hearing.component.html',
  styleUrl: './hearing.component.scss',
})
export class HearingComponent implements OnInit {
  hearingService = inject(AdminHearingService);
  historyService = inject(HistoryService);
  userAdminService = inject(UserAdminService);
  url = inject(Router).url;

  hearingId = input(0, { transform: numberAttribute });

  hearing$: Observable<AdminHearing> | null = null;

  ngOnInit(): void {
    this.hearing$ = this.hearingService.getHearing(this.hearingId()).pipe(
      switchMap((hearing) => {
        return this.userAdminService.getUsersById([hearing.createdById, hearing.lastModifiedById]).pipe(
          map((users) => {
            const userMap = new Map(users.map((user) => [user.id, user.fullName]));

            return {
              ...hearing,
              createdBy: userMap.get(hearing.createdById),
              lastModifiedBy: userMap.get(hearing.lastModifiedById),
            };
          })
        );
      })
    );
  }
}
