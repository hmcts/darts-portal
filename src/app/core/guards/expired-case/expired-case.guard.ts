import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { CaseService } from '@services/case/case.service';
import { map } from 'rxjs';

export const expiredCaseGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const caseService = inject(CaseService);
  const router = inject(Router);
  const caseId = route.params.caseId;

  return caseService.getCase(caseId).pipe(
    map((caseDetails) => {
      if (caseDetails.isDataAnonymised) {
        // Redirect to expired case screen
        router.navigate(['/expired-case']);
        return false;
      }
      return true;
    })
  );
};
