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

  afterEach(() => {
    const B2C_ORIGIN = 'https://hmctsstgextid.b2clogin.com';
    cy.location('origin').then((origin) => {
      if (origin === B2C_ORIGIN) {
        cy.origin(B2C_ORIGIN, () => {
          cy.screenshot('b2c-stuck');
          cy.get('body')
            .invoke('text')
            .then((txt) => {
              Cypress.log({ name: 'B2C stuck body', message: txt.slice(0, 500) });
            });
        });
        const aliases = Cypress.state('aliases') || {};
        if (aliases.b2cAuth) {
          cy.get('@b2cAuth').then((p) => cy.log('B2C authorize captured: ' + JSON.stringify(p)));
        }
      }
    });
  });
});
