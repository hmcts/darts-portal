import 'cypress-axe';
import './commands';

describe('Your Transcripts', () => {
  beforeEach(() => {
    cy.login();
    cy.injectAxe();
  });

  it('shows your transcripts', () => {
    cy.contains('Your Transcripts').click();
    cy.get('h3').should('contain', 'Your Transcripts');
    cy.a11y();
  });
});
