import 'cypress-axe';
import '../commands';

describe('Case file screen', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should go to admin case screen file from case search', () => {
    cy.visit('admin/search');

    cy.get('#confirm-button').click();

    cy.get('td.case_number a.govuk-link').first().click();

    cy.url().should('include', '/admin/case/1');
  });

  it('should show correct case file information', () => {
    cy.visit('admin/case/1');
    cy.injectAxe();

    cy.get('app-govuk-heading').should('contain.text', 'Case').should('contain.text', 'CASE1001');

    cy.get('h2.govuk-heading-m').should('contain.text', 'Case details');

    cy.get('.govuk-summary-list').within(() => {
      cy.get('.govuk-summary-list__row')
        .eq(0)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Case ID');
          cy.get('.govuk-summary-list__value').should('have.text', 'CASE1001');
        });

      cy.get('.govuk-summary-list__row')
        .eq(1)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Courthouse');
          cy.get('.govuk-summary-list__value').should('have.text', 'SWANSEA');
        });

      cy.get('.govuk-summary-list__row')
        .eq(2)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Judge(s)');
          cy.get('.govuk-summary-list__value').should('have.text', 'Mr Judge');
        });

      cy.get('.govuk-summary-list__row')
        .eq(3)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Defendant(s)');
          cy.get('.govuk-summary-list__value').should('have.text', 'Joe Bloggs');
        });

      cy.get('.govuk-summary-list__row')
        .eq(4)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Defence');
          cy.get('.govuk-summary-list__value').should('have.text', 'Mr Defender');
        });

      cy.get('.govuk-summary-list__row')
        .eq(5)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Prosecutor(s)');
          cy.get('.govuk-summary-list__value').should('have.text', 'Mrs Prosecutor');
        });

      cy.get('.govuk-summary-list__row')
        .eq(6)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Retained until');
          cy.get('.govuk-summary-list__value').first().should('have.text', '31 Jan 2030');
        });

      cy.get('.govuk-summary-list__row')
        .eq(6)
        .within(() => {
          cy.get('.govuk-link').should('have.text', 'View or change').should('have.attr', 'href', '/case/1/retention');
        });
    });

    cy.a11y();
  });
});
