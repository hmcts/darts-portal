import 'cypress-axe';
import './commands';
describe('Login', () => {
  before(() => {
    cy.visit('/login');
    cy.injectAxe();
  });

  it('loads login page', () => {
    cy.get('h1').should('contain', 'Sign in to the DARTS Portal');
    cy.a11y();
  });

  it('logs in and out', () => {
    cy.visit('/login');
    cy.contains('I work with the HM Courts and Tribunals Service').click();
    cy.contains('Continue').click();

    cy.get('h1').should('contain', 'Stub login page');
    cy.get('#login-admin').click();
    cy.get('.govuk-label-wrapper > .govuk-label').should('contain', 'Search for a case');

    cy.contains('Sign out').should('be.visible').click();

    cy.url().should('include', '/login');

    // try to visit an authenticated route
    cy.visit('/search');
    cy.url().should('include', '/login');
  });
});
