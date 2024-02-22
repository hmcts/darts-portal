import 'cypress-axe';
import '../commands';

describe('Admin - Courthouses screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/courthouses');
    cy.injectAxe();
  });

  it('Load page', () => {
    cy.get('h1').should('contain', 'Courthouses');
    cy.get('h2').should('contain', 'Search for courthouse');
    cy.a11y();
  });

  it('Courthouses search form', () => {
    cy.get('.govuk-label').contains('Courthouse name').should('exist');
    cy.get('#courthouseName').should('exist');
    cy.get('.govuk-label').contains('Display name').should('exist');
    cy.get('#displayName').should('exist');
    cy.get('.govuk-label').contains('Region').should('exist');
    cy.get('#region').should('exist');
  });

  it('Search courthouses', () => {
    //TBD
  });
});
