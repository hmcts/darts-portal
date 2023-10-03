import './commands';
describe('Your audio', () => {
  beforeEach(() => {
    cy.login();
  });

  it('shows your audio', () => {
    cy.contains('Your Audio').click();
    cy.get('h1').should('contain', 'Your Audio');
  });
});
