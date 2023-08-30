describe('Smoke test', () => {
  it('should load portal login page', () => {
    cy.visit('/login');
    cy.get('.govuk-label').should('contain', "I'm an employee of HM Courts and Tribunals Service");
    cy.get('.govuk-label').should('contain', 'I work with the HM Courts and Tribunals Service');
  });
});
