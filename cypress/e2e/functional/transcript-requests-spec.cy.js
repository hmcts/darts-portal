import 'cypress-axe';
import './commands';

describe('Transcript requests', () => {
  beforeEach(() => {
    cy.login();
    cy.injectAxe();
  });

  it('shows "Transcript requests"', () => {
    cy.contains('Transcript requests').click();
    cy.get('h1').should('contain', 'Transcript requests');
    cy.a11y();
  });
});
