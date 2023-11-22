import 'cypress-axe';
Cypress.Commands.add('login', () => {
  cy.visit('/login');
  cy.contains('I work with the HM Courts and Tribunals Service').click();
  cy.contains('Continue').click();

  cy.get('h1').should('contain', 'Stub login page');
  cy.get('#login-admin').click();
  cy.get('.govuk-label-wrapper > .govuk-label').should('contain', 'Search for a case');
});

Cypress.Commands.add('logout', () => {
  cy.contains('Sign out').click();
});

Cypress.Commands.add('a11y', () => {
  cy.checkA11y(null, {
    runOnly: {
      type: 'tag',
      values: ['wcag22aa', 'wcag21aa'],
    },
  });
});
