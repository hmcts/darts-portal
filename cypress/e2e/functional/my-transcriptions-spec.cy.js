import './commands';

describe('My transcriptions', () => {
  beforeEach(() => {
    cy.login();
  });

  it('shows my transcriptions', () => {
    cy.contains('My Transcriptions').click();
    cy.get('h3').should('contain', 'My Transcriptions');
  });
});
