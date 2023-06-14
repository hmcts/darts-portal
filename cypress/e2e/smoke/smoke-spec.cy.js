describe('Smoke test', () => {
  it('should load portal login page', () => {
    cy.visit('/');
    cy.get('a').should('contain', 'External user Login');
  });
});
