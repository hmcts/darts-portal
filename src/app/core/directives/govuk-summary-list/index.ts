import { GovukSummaryActionDirective } from './govuk-summary-action.directive';
import { GovukSummaryContainerDirective } from './govuk-summary-container.directive';
import { GovukSummaryKeyDirective } from './govuk-summary-key.directive';
import { GovukSummaryListRowDirective } from './govuk-summary-list-row.directive';
import { GovukSummaryListDirective } from './govuk-summary-list.directive';
import { GovukSummaryValueDirective } from './govuk-summary-value.directive';

export * from './govuk-summary-action.directive';
export * from './govuk-summary-container.directive';
export * from './govuk-summary-key.directive';
export * from './govuk-summary-list-row.directive';
export * from './govuk-summary-list.directive';
export * from './govuk-summary-value.directive';

/**
 * @description
 * A collection of all the GovukSummaryList directives.
 *
 * GDS: https://design-system.service.gov.uk/components/summary-list/
 *
 * @example
 * Component({
 *   imports: [GovukSummaryListDirectives]
 * })
 *
 * <div govukSummaryContainer>
 * <dl govukSummaryList>
 *  <div govukSummaryListRow>
 *    <dt govukSummaryKey> Name </dt>
 *    <dd govukSummaryValue> {{ item.value }} </dd>
 *    <dd govukSummaryAction>
 *      <a class="govuk-link" [routerLink]="['/']">
 *        Change
 *      </a>
 *    </dd>
 *  </div>
 * </dl>
 * </div>
 */
export const GovukSummaryListDirectives = [
  GovukSummaryListDirective,
  GovukSummaryListRowDirective,
  GovukSummaryKeyDirective,
  GovukSummaryValueDirective,
  GovukSummaryActionDirective,
  GovukSummaryContainerDirective,
];
