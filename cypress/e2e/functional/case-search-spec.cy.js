import './commands';

describe('Case search', () => {
  beforeEach(() => {
    cy.login();
  });

  it('shows case search', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
  });
});
