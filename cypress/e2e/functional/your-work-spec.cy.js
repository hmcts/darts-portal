import 'cypress-axe';
import './commands';

describe('Your work', () => {
  beforeEach(() => {
    cy.login();
    cy.injectAxe();
  });

  it('shows "Your work"', () => {
    cy.contains('Your work').click();
    cy.get('h1').should('contain', 'Your work');
    cy.a11y();
  });
});
