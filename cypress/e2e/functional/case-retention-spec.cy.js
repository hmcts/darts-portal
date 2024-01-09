import 'cypress-axe';
import './commands';

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
