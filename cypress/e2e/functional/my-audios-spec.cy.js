describe('My audios', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.contains('I work with the HM Courts and Tribunals Service').click();
    cy.contains('Continue').click();

    cy.get('h1').should('contain', 'Stub login page');
    cy.get('#login').click();
    cy.get('h1').should('contain', 'Welcome to DARTS');
  });

  it('shows my audios', () => {
    cy.contains('My Audios').click();
    cy.get('h3').should('contain', 'My Audios');
  });
});
