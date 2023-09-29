import './commands';

describe('Your Transcripts', () => {
  beforeEach(() => {
    cy.login();
  });

  it('shows your transcripts', () => {
    cy.contains('Your Transcripts').click();
    cy.get('h3').should('contain', 'Your Transcripts');
  });
});
