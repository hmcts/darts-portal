import { User } from '@admin-types/index';
import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoCompleteComponent, AutoCompleteItem } from '@common/auto-complete/auto-complete.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { HeaderService } from '@services/header/header.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-change-owner-transformed-media',
  standalone: true,
  imports: [GovukHeadingComponent, AutoCompleteComponent, AsyncPipe, LoadingComponent, ValidationErrorSummaryComponent],
  templateUrl: './change-owner-transformed-media.component.html',
  styleUrl: './change-owner-transformed-media.component.scss',
})
export class ChangeOwnerTransformedMediaComponent implements OnInit {
  userService = inject(UserAdminService);
  transformedMediaService = inject(TransformedMediaService);
  headerService = inject(HeaderService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  transformedMediaId = this.route.snapshot.params.id;
  mediaRequestId = this.route.snapshot.params.mediaRequestId;

  selectedUser: AutoCompleteItem | null = null;
  invalidUserSubmitted = false;
  errors: ErrorSummaryEntry[] = [{ fieldId: 'users-autocomplete', message: 'Select a user' }];

  autoCompleteUsers$ = this.userService.getUsers().pipe(map((users) => this.mapUsersToAutoCompleteItems(users)));

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }

  onUserSelect(selectedUser: AutoCompleteItem | null) {
    this.selectedUser = selectedUser;
  }

  onSave() {
    if (!this.selectedUser) {
      this.invalidUserSubmitted = true;
      return;
    }

    this.transformedMediaService.changeMediaRequestOwner(this.mediaRequestId, this.selectedUser.id).subscribe(() => {
      this.router.navigate(['/admin/transformed-media', this.transformedMediaId], {
        queryParams: { ownerChanged: this.selectedUser?.name.split('(')[0] }, // remove email address from name
      });
    });
  }

  onCancel() {
    this.router.navigate(['/admin/transformed-media', this.transformedMediaId]);
  }

  mapUsersToAutoCompleteItems(users: User[]): AutoCompleteItem[] {
    return users.map((user) => ({ id: user.id, name: `${user.fullName} (${user.emailAddress})` }));
  }
}
