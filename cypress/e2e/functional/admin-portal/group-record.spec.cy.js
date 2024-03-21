import 'cypress-axe';
import '../commands';
describe('Admin - Groups screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/groups/2');
    cy.injectAxe();
  });

  it('load page', () => {
    cy.get('h1').should('contain', 'Group details');
    cy.a11y();
  });

  it('assigns courthouse to group', () => {
    cy.get('#select-courthouse').select('Cardiff');

    cy.get('button').contains('Add courthouse').click();

    cy.get('#courthouse-table').should('contain', 'Slough');
    cy.get('#courthouse-table').should('contain', 'Kingston');
    cy.get('#courthouse-table').should('contain', 'Cardiff');
  });

  it('removes courthouse from group', () => {
    cy.get('#courthouse-table').contains('Cardiff').siblings('td').contains('Remove').click();
    cy.get('#courthouse-table').should('not.contain', 'Cardiff');
  });
});
