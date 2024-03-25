import { GroupFormValue, SecurityGroup } from '@admin-types/index';
import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { GroupsService } from '@services/groups/groups.service';
import { GroupFormComponent } from '../group-form/group-form.component';

@Component({
  selector: 'app-create-edit-group',
  standalone: true,
  imports: [GroupFormComponent, GovukHeadingComponent, LoadingComponent, AsyncPipe, ValidationErrorSummaryComponent],
  templateUrl: './create-edit-group.component.html',
  styleUrl: './create-edit-group.component.scss',
})
export class CreateEditGroupComponent implements OnInit {
  router = inject(Router);
  groupService = inject(GroupsService);
  errors: ErrorSummaryEntry[] = [];

  groups$ = this.groupService.getGroups();

  group: SecurityGroup = this.router.getCurrentNavigation()?.extras?.state?.group as SecurityGroup;

  isEdit = this.router.url.includes('edit');

  caption = this.isEdit ? 'Edit group' : 'Create group';

  ngOnInit(): void {
    if (this.isEdit && !this.group) {
      this.router.navigate(['admin/groups']);
    }
  }

  onSave(formValues: GroupFormValue) {
    if (this.isEdit) {
      this.groupService.updateGroup(this.group.id, formValues).subscribe(() => {
        this.router.navigate(['admin/groups', this.group.id], { queryParams: { updated: true } });
      });
    }
    // } else {
    //   this.groupService.createGroup(formValues).subscribe(({ id }) => {
    //     this.router.navigate(['admin/groups', id], { queryParams: { created: true } });
    //   });
    // }
  }

  cancel() {
    const cancelUrl = this.isEdit ? `admin/groups/${this.group.id}` : 'admin/groups';
    this.router.navigate([cancelUrl]);
  }
}
