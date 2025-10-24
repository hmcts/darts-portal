import '../functional/commands';
import * as adLogin from '../support/ad-login';

describe('Smoke test', () => {
  it('should load portal login page', () => {
    cy.visit('/login');
    cy.get('.govuk-label').should('contain', "I'm an employee of HM Courts and Tribunals Service");
    cy.get('.govuk-label').should('contain', 'I work with the HM Courts and Tribunals Service');
  });

  if (adLogin.isDevPreview()) {
    it('should login via dev preview stub for external user', () => {
      cy.realLogin('external');
      cy.get('app-govuk-heading').should('contain', 'Search for a case');
      cy.logout();
    });
  }
});
