import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { FormControl, FormGroup } from '@angular/forms';
import { UnwrapFormValues } from '@core-types/index';

export type CaseSearchForm = FormGroup<{
  caseNumber: FormControl<string>;
  courthouses: FormControl<Courthouse[]>;
  courtroom: FormControl<string>;
  hearingDate: FormGroup<{
    type: FormControl<string>;
    specific: FormControl<string>;
    from: FormControl<string>;
    to: FormControl<string>;
  }>;
  judgeName: FormControl<string>;
  defendantName: FormControl<string>;
  eventTextContains: FormControl<string>;
}>;

export type CaseSearchFormValues = UnwrapFormValues<CaseSearchForm>;
