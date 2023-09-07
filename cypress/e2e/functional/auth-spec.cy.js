describe('Login', () => {
  it('loads login page', () => {
    cy.visit('/login');
    cy.get('h1').should('contain', 'Sign in to the DARTS Portal');
  });

  it('logs in and out', () => {
    cy.visit('/login');
    cy.contains('I work with the HM Courts and Tribunals Service').click();
    cy.contains('Continue').click();

    cy.get('h1').should('contain', 'Stub login page');
    cy.get('#login').click();
    cy.get('h1').should('contain', 'Welcome to DARTS');

    cy.contains('Sign out').click();
    cy.url().should('include', '/login');

    // try to visit an authenticated route
    cy.visit('/search');
    cy.url().should('include', '/login');
  });
});
