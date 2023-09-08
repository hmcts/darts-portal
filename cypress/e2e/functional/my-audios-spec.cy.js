import './commands';
describe('My audios', () => {
  beforeEach(() => {
    cy.login();
  });

  it('shows my audios', () => {
    cy.contains('My Audios').click();
    cy.get('h3').should('contain', 'My Audios');
  });
});
