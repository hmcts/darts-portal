describe('Case search', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.contains('I work with the HM Courts and Tribunals Service').click();
    cy.contains('Continue').click();

    cy.get('h1').should('contain', 'Stub login page');
    cy.get('#login').click();
    cy.get('h1').should('contain', 'Welcome to DARTS');
  });

  it('shows case search', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
  });
});
