import 'cypress-axe';
import { externalPortalLogin } from '../support/ad-login.js';

Cypress.Commands.add('login', (roleCode = 'admin', loginType = 'internal') => {
  cy.visit('/login');
  if (loginType === 'internal') {
    cy.contains("I'm an employee of HM Courts and Tribunals Service").click();
  } else {
    cy.contains('I work with the HM Courts and Tribunals Service').click();
  }

  cy.acceptCookies();
  cy.contains('Continue').click();

  // Cypress is now redirected to the stub login page on http://localhost:4545
  cy.origin('http://localhost:4545', { args: { roleCode } }, ({ roleCode }) => {
    cy.get('h1').should('contain', 'Stub login page');
    cy.get(`#login-${roleCode}`).click();
  });

  cy.get('app-govuk-heading').should('contain', 'Search for a case');
});

Cypress.Commands.add('logout', () => {
  cy.contains('Sign out').click();
});

Cypress.Commands.add('acceptCookies', () => {
  cy.get('body').then(($b) => {
    if ($b.find('button[name="cookies-accept"]').length) {
      cy.get('button[name="cookies-accept"]').contains('Accept additional cookies').click({ force: true });
    }
  });
});

Cypress.Commands.add('realLogin', () => {
  const PORTAL_ORIGIN = new URL(Cypress.config('baseUrl')).origin;

  cy.visit('/login', { retryOnNetworkFailure: true });
  cy.acceptCookies();

  externalPortalLogin();

  // Wait until we are no longer on B2C (full page nav back)
  cy.location('origin', { timeout: 60_000 }).should('eq', PORTAL_ORIGIN);
});

Cypress.Commands.add('a11y', () => {
  cy.checkA11y(
    null,
    {
      runOnly: {
        type: 'tag',
        values: ['wcag22aa', 'wcag21aa', 'wcag2aa'],
      },
    },
    (violations) => {
      cy.log(violations);
    }
  );
});
