import 'cypress-axe';
import '../commands';

describe('Admin - Hide or delete file', () => {
  beforeEach(() => {
    cy.login('admin');
  });
  describe('Transcripts - hide file', () => {
    beforeEach(() => {
      cy.visit('/admin/transcripts');
      cy.get('.moj-sub-navigation__link').contains('Completed transcripts').click();
      cy.get('.govuk-button').contains('Search').click();
      cy.get('.govuk-link').contains('0').click();
      cy.get('.govuk-button').contains('Hide or delete').click();

      cy.injectAxe();
    });

    it('Hide or delete file form components', () => {
      cy.get('.govuk-heading-l').contains('Hide or delete file');

      cy.get('.govuk-label.govuk-radios__label').contains('Public interest immunity');
      cy.get('#reason-hint-1').contains('File will be hidden and marked for deletion');
      cy.get('.govuk-label.govuk-radios__label').contains('Classified above official');
      cy.get('#reason-hint-2').contains('File will be hidden and marked for deletion');
      cy.get('.govuk-label.govuk-radios__label').contains('Other reason to delete');
      cy.get('#reason-hint-3').contains('File will be hidden and marked for deletion');
      cy.get('.govuk-label.govuk-radios__label').contains('Other reason to delete');
      cy.get('#reason-hint-5').contains('File will be hidden only');

      cy.get('.govuk-label').contains('Enter ticket reference');
      cy.get('#ticketReference').should('exist');
      cy.get('.govuk-label').contains('Comments');
      cy.get('#comments').should('exist');

      cy.a11y();
    });

    it('Hide or delete file validation errors', () => {
      cy.get('.govuk-button').contains('Hide or delete').click();

      cy.get('.govuk-error-message').contains('Provide details relating to this action');

      cy.get('.govuk-error-message').contains('Enter a ticket reference');

      cy.get('.govuk-error-message').contains('Select a reason for hiding and/or deleting the file');

      cy.get('.govuk-list.govuk-error-summary__list').contains('Provide details relating to this action');
      cy.get('.govuk-list.govuk-error-summary__list').contains('Enter a ticket reference');
      cy.get('.govuk-list.govuk-error-summary__list').contains('Select a reason for hiding and/or deleting the file');

      cy.a11y();
    });

    it('Hide or delete file validation errors', () => {
      cy.get('#reason-2').check();

      cy.get('#ticketReference').type('TR120001');

      cy.get('#comments').type('This is a test comment');

      cy.get('.govuk-button').contains('Hide or delete').click();

      cy.get('#success-message').contains('File(s) successfully hidden or marked for deletion');
      cy.get('.govuk-heading-l').contains('Check for associated files');
      cy.get('.govuk-body').contains(
        'There may be other associated audio or transcript files that also need hiding or deleting.'
      );

      cy.get('.govuk-button').contains('Continue').click();
      cy.a11y();

      cy.get('.caption.govuk-caption-l').contains('Transcript file');
      cy.get('.govuk-heading-l').contains('0');
    });
  });
});
