describe('functional test', () => {
  it('should load portal', () => {
    cy.visit('/');
    cy.get('h1').should('contain', 'Welcome to DARTS');
  });

  it('shows inbox', () => {
    cy.visit('/inbox');
    cy.get('h3').should('contain', 'Inbox');
  });

  it('shows audios', () => {
    cy.visit('/audios');
    cy.get('h3').should('contain', 'My Audios');
  });

  it('shows transcriptions', () => {
    cy.visit('/transcriptions');
    cy.get('h3').should('contain', 'My Transcriptions');
  });
});
