describe('An example', () => {
  it('Should load', () => {
    cy.visit(`${Cypress.env('HOST')}`);
    // (or,  if your H1 doesn't appear, it will fail after a timeout).
    cy.get('.govuk-header__service-name').should('contain', 'DARTS portal');
    // Let's also confirm that we are on the right URL.
  });
});
