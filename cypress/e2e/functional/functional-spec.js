describe('Smoke test', () => {
    it('should load portal', () => {
      cy.visit('/');
      cy.get('h1').should('contain', 'Welcome to DARTS');
    });
  });
