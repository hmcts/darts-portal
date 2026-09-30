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

    // Handle the stub login page at localhost:4545
    cy.origin('http://localhost:4545', () => {
      cy.get('h1').should('contain', 'Stub login page');
      cy.get('#login-admin').click();
    });

    cy.location('origin').should('eq', 'http://localhost:3000');

    cy.get('app-govuk-heading').should('contain', 'Search for a case');

    cy.contains('Sign out').click();

    cy.get('h1').should('contain', 'Sign in to the DARTS Portal');
    cy.url().should('include', '/login');

    // Try accessing an authenticated page
    cy.visit('/search');
    cy.url().should('include', '/login');
  });

  it('redirects a non-admin user from an admin route to page not found', () => {
    cy.login('requester');

    cy.visit('/admin/users/create');

    cy.url().should('include', '/page-not-found');
    cy.get('h1').should('contain', 'Page not found');
  });

  it('redirects a user without the required role to forbidden', () => {
    cy.login('requester');

    cy.visit('/work');

    cy.url().should('include', '/forbidden');
    cy.get('#forbidden-heading').should('contain', 'You do not have permission to access this page');
  });
});
