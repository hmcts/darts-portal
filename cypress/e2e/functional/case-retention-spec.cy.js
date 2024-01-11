import 'cypress-axe';
import { DateTime } from 'luxon';
import './commands';

const TOMORROW = DateTime.now().plus({ days: 1 }).startOf('day').toFormat('dd/MM/yyyy');

describe('Case retention screen', () => {
  beforeEach(() => {
    cy.login();
    cy.injectAxe();
  });

  describe('Closed case retention screen', () => {
    beforeEach(() => {
      cy.contains('Search').click();
      cy.get('#case_number').type('C20220620001');
      cy.get('button').contains('Search').click();
      cy.contains('C20220620001').click();
      cy.contains('View or change').click();
    });

    it('Check page elements', () => {
      //Breadcrumb
      cy.get('a.govuk-breadcrumbs__link').should('contain', 'Case retention date');
      cy.get('h1.govuk-heading-l').should('contain', 'Case retention date');
      cy.get('.govuk-table__caption.govuk-table__caption--m').should('contain', 'Case details');
      cy.get('.govuk-table__caption.govuk-table__caption--m').should('contain', 'Current retention details');

      cy.get('td.govuk-table__cell').should('contain', '15 Aug 2023');

      cy.get('th.govuk-table__header').should('contain', 'Retain case until');

      //Button group, only shows on closed cases
      cy.get('.govuk-button-group').should('contain', 'Change retention date');
      cy.get('a.govuk-link').should('contain', 'Cancel');

      cy.get('#retentionTable').should('contain', '11 Oct 2023 00:18:00');
      cy.a11y();
    });

    it('Change retention date', () => {
      cy.get('#change-retention-button').should('exist');
      cy.get('#change-retention-button').click();

      cy.get('h1.govuk-heading-l').should('contain', 'Change case retention date');
      cy.get('.govuk-fieldset__heading').should('contain', 'Select a new retention date');

      // Click continue button without selecting an option or typing in the reason box
      cy.get('#continue-button').should('exist');
      cy.get('#continue-button').click();

      // Shows error messages if you don't select an option or explain the change
      cy.get('.govuk-error-summary').should('contain', 'Select an option');
      cy.get('.govuk-error-summary').should('contain', 'You must explain why you are making this change');
      cy.get('.govuk-error-message').should('contain', 'Select an option');
      cy.get('.govuk-error-message').should('contain', 'You must explain why you are making this change');

      // Fill in the reason box but don't fill in the date, should show error
      cy.get('#change-reason').type('REASONS');
      cy.get('#retention-option-date').click();
      cy.get('#continue-button').click();
      cy.get('.govuk-error-summary').should(
        'contain',
        'You have not entered a recognised date in the correct format (for example 31/01/2023)'
      );
      cy.get('.govuk-error-message').should(
        'contain',
        'You have not entered a recognised date in the correct format (for example 31/01/2023)'
      );

      // Fill in nonsense date, should still show error
      cy.get('#retention-date').type('Tomorrow, I think...');
      cy.get('.govuk-error-summary').should(
        'contain',
        'You have not entered a recognised date in the correct format (for example 31/01/2023)'
      );
      cy.get('.govuk-error-message').should(
        'contain',
        'You have not entered a recognised date in the correct format (for example 31/01/2023)'
      );

      // Fill it in properly this time, error message should not appear but summary will do still
      cy.get('#retention-date').clear();
      cy.get('#retention-date').type(TOMORROW);
      cy.get('.govuk-error-summary').should('exist');
      cy.get('.govuk-error-message').should('not.exist');

      // Finally click the continue button, summary will disappear
      cy.get('#continue-button').click();
      cy.get('.govuk-error-message').should('not.exist');

      cy.a11y();
    });
  });

  describe('Open case retention screen', () => {
    beforeEach(() => {
      cy.contains('Search').click();
      cy.get('#case_number').type('C20220620002');
      cy.get('button').contains('Search').click();
      cy.contains('C20220620002').click();
      cy.contains('View or change').click();
    });

    it('Check page elements', () => {
      //Breadcrumb
      cy.get('a.govuk-breadcrumbs__link').should('contain', 'Case retention date');

      //Info banner, shows on open or pending cases
      cy.get('div.govuk-notification-banner').should('contain', 'This case is still open or was recently closed.');

      cy.get('h1.govuk-heading-l').should('contain', 'Case retention date');
      cy.get('.govuk-table__caption.govuk-table__caption--m').should('contain', 'Case details');
      cy.get('.govuk-table__caption.govuk-table__caption--m').should('contain', 'Current retention details');

      cy.get('td.govuk-table__cell').should('contain', '-');

      cy.get('td.govuk-table__cell').should('contain', 'A retention policy has yet to be applied to this case.');

      cy.get('p.govuk-body').should('contain', 'No history to show');

      //Button group, should not be visible on open cases
      cy.get('.govuk-button-group').should('not.exist');

      cy.a11y();
    });
  });
});
