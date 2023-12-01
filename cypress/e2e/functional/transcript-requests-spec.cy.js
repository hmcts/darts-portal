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
  });

  it('takes you to assign transcript page', () => {
    cy.contains('Transcript requests').click();
    cy.get('#transcript-requests-table td').contains('Up to 3 working days').parents('tr').contains('View').click();
    cy.contains('Case ID').parents('tr').should('contain', 'C20220620001');
    cy.contains('Hearing Date').parents('tr').should('contain', '08 Nov 2023');
    cy.get('h1').should('contain', 'Choose an action');
    cy.get('.govuk-label.govuk-radios__label').should('contain', 'Assign to me');
    cy.get('#submit-button').should('contain', 'Continue');
    cy.a11y();
  });
});
