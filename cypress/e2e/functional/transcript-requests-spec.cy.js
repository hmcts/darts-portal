import 'cypress-axe';
import './commands';

describe('Transcript requests', () => {
  beforeEach(() => {
    cy.login('transcriber');
    cy.injectAxe();
  });

  it('shows "Transcript requests"', () => {
    cy.contains('Transcript requests').click();
    cy.get('h1').should('contain', 'Transcript requests');
    cy.a11y();
  });

  it('has Data in the table', () => {
    cy.contains('Transcript requests').click();
    cy.get('#transcript-requests-table').should('contain', 'Newcastle');
    cy.get('#transcript-requests-table').should('contain', 'Court Log');
    cy.get('#transcript-requests-table').should('contain', 'Manual');
    cy.a11y();
  })
});
