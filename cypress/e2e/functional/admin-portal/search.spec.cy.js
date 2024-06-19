import 'cypress-axe';
import '../commands';

describe('Admin - Search screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.injectAxe();
  });

  describe('form', () => {
    it('populate', () => {
      cy.visit('/admin/search');

      cy.get('app-govuk-heading h1').contains('Search');

      cy.get('app-search-form').should('exist');

      cy.get('#courthouse-autocomplete').click();
      cy.get('li').contains('Cardiff').click();

      cy.get('#caseId').type('123456');
      cy.get('#courtroom').type('1');

      cy.get('#specific-date-radio').click();
      cy.get('[data-button="datepicker-specific-toggle"]').click();
      cy.get('.ds_datepicker__today').click();

      // Cases checked by default
      cy.get('#cases-option').should('be.checked');

      cy.get('#confirm-button').click();

      //   cy.a11y();
    });
  });
});
