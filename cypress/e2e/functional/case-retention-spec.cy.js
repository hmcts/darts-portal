import 'cypress-axe';
import { DateTime } from 'luxon';
import './commands';

const validDateObject = DateTime.fromISO('2031-01-01');
const validReason = 'REASONS';

describe('Case retention screen as standard user', () => {
  beforeEach(() => {
    cy.login('requestor-approver');
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
  });

  describe('Open case retention screen', () => {
    beforeEach(() => {
      const caseNumber = 'C20220620002';
      cy.contains('Search').click();
      cy.get('#case_number').type(caseNumber);
      cy.get('button').contains('Search').click();
      cy.contains(caseNumber).click();
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
      cy.get('#retention-date-buttons').should('not.exist');

      cy.a11y();
    });
  });

  describe('Change case retention screen', () => {
    beforeEach(() => {
      cy.contains('Search').click();
      cy.get('#case_number').type('C20220620001');
      cy.get('button').contains('Search').click();
      cy.contains('C20220620001').click();
      cy.contains('View or change').click();
      cy.get('#change-retention-button').click();
    });

    it('Check page elements', () => {
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
      cy.get('#change-reason').type(validReason);
      cy.get('#retention-option-date').click({ force: true });
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

      // Fill in a date that is lower than the current retention date
      cy.get('#retention-date').clear();
      cy.get('#retention-date').type('01/01/2024');
      cy.get('#continue-button').click();
      cy.get('.govuk-error-summary').should('exist');
      cy.get('.govuk-error-message').should('exist');
      cy.get('.govuk-error-summary').should(
        'contain',
        'You do not have permission to reduce the current retention date.\r\nPlease refer to the DARTS retention policy guidance.'
      );
      cy.get('.govuk-error-message').should(
        'contain',
        'You do not have permission to reduce the current retention date.\r\nPlease refer to the DARTS retention policy guidance.'
      );

      // Fill it in properly this time, error message should not appear
      cy.get('#retention-date').clear();
      cy.get('#retention-date').type(validDateObject.toFormat('dd/MM/yyyy'));
      cy.get('#continue-button').click();
      cy.get('.govuk-error-summary').should('not.exist');
      cy.get('.govuk-error-message').should('not.exist');

      cy.a11y();
    });
  });

  describe('Confirm case retention screen', () => {
    beforeEach(() => {
      cy.contains('Search').click();
      cy.get('#case_number').type('C20220620001');
      cy.get('button').contains('Search').click();
      cy.contains('C20220620001').click();
      cy.contains('View or change').click();
      cy.get('#change-retention-button').click();
      cy.get('#retention-option-date').click({ force: true });
      cy.get('#retention-date').type(validDateObject.toFormat('dd/MM/yyyy'));
      cy.get('#change-reason').type(validReason);
      cy.get('#continue-button').click();
    });

    it('Check page elements', () => {
      cy.get('h1.govuk-heading-l').should('contain', 'Check retention date change');
      cy.get('.govuk-table__caption.govuk-table__caption--m').should('contain', 'Case details');
      cy.get('#retain-date').should('contain', validDateObject.toFormat('dd MMM yyyy'));
      cy.get('#retain-reason').should('contain', validReason);
    });

    it('Should go back to case retention screen on cancel', () => {
      cy.get('#cancel-link').click();
      // Should go back to case retention screen
      cy.get('h1.govuk-heading-l').should('contain', 'Case retention date');

      cy.a11y();
    });

    it('Should go back to change screen and select reason box', () => {
      cy.get('#date-link').click();
      // Should go back to case retention screen
      cy.get('h1.govuk-heading-l').should('contain', 'Change case retention date');
      cy.url().should('contain', 'retention-date');

      cy.a11y();
    });

    it('Should go back to change screen and select reason box', () => {
      cy.get('#reason-link').click();
      // Should go back to case retention screen
      cy.get('h1.govuk-heading-l').should('contain', 'Change case retention date');
      cy.url().should('contain', 'change-reason');

      cy.a11y();
    });

    it('Should go back to case retention screen on confirm, if successful', () => {
      cy.get('#confirm-button').click();
      // Should go back to case retention screen
      cy.get('h1.govuk-heading-l').should('contain', 'Case retention date');
      // and display success message
      cy.get('#success-message').should('contain', 'Case retention date changed.');

      cy.a11y();
    });
  });
});

describe('Case retention screen as Judge', () => {
  beforeEach(() => {
    cy.login('judge');
    cy.injectAxe();
  });

  describe('Change case retention screen', () => {
    beforeEach(() => {
      cy.contains('Search').click();
      cy.get('#case_number').type('C20220620001');
      cy.get('button').contains('Search').click();
      cy.contains('C20220620001').click();
      cy.contains('View or change').click();
      cy.get('#change-retention-button').click();
    });

    it('Change retention date screen', () => {
      cy.get('h1.govuk-heading-l').should('contain', 'Change case retention date');
      cy.get('.govuk-fieldset__heading').should('contain', 'Select a new retention date');

      // Fill in the reason box
      cy.get('#change-reason').type('Just want to change the date');
      // Select the date option
      cy.get('#retention-option-date').click({ force: true });

      // Fill in a date that is lower than the current retention date
      cy.get('#retention-date').type('01/01/2024');
      cy.get('#continue-button').click();
      // Specific error message just for Admins and Judges will be shown
      cy.get('.govuk-error-summary').should('exist');
      cy.get('.govuk-error-message').should('exist');
      cy.get('.govuk-error-summary').should('contain', 'You cannot set retention date earlier than 15/12/2025');
      cy.get('.govuk-error-message').should('contain', 'You cannot set retention date earlier than 15/12/2025');

      // Fill in a date later than the original retention date this time this time, error message should not appear
      cy.get('#retention-date').clear();
      cy.get('#retention-date').type(validDateObject.toFormat('dd/MM/yyyy'));
      cy.get('#continue-button').click();
      cy.get('.govuk-error-summary').should('not.exist');
      cy.get('.govuk-error-message').should('not.exist');

      cy.a11y();
    });
  });
});
