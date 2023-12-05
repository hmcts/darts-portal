import 'cypress-axe';
import './commands';

describe('Transcript requests', () => {
  const clickViewLink = () =>
    cy.get('#transcript-requests-table td').contains('Manual').parents('tr').contains('View').click();

  beforeEach(() => {
    cy.login('transcriber');
    cy.injectAxe();
    cy.contains('Transcript requests').click();
  });

  it('shows "Transcript requests"', () => {
    cy.get('h1').should('contain', 'Transcript requests');
    cy.a11y();
  });

  it('has data in the table', () => {
    cy.get('#transcript-requests-table').should('contain', 'Newcastle');
    cy.get('#transcript-requests-table').should('contain', 'Court Log');
    cy.get('#transcript-requests-table').should('contain', 'Manual');
    cy.a11y();
  });

  it('view transcript', () => {
    clickViewLink();
    cy.contains('Case ID').parents('tr').should('contain', 'C20220620001');
    cy.contains('Hearing Date').parents('tr').should('contain', '08 Nov 2023');
    cy.get('h1').should('contain', 'Choose an action');
    cy.get('.govuk-label.govuk-radios__label').should('contain', 'Assign to me');
    cy.get('#submit-button').should('contain', 'Continue');
    cy.a11y();
  });

  it('assign transcript to me', () => {
    clickViewLink();
    cy.get('#transcriptionOption').click();
    cy.get('#submit-button').click();
    cy.get('h1').contains('Your work');
  });

  it('assign transcript to me and upload', () => {
    clickViewLink();
    cy.get('#transcriptionOption-3').click();
    cy.get('#submit-button').click();
    cy.get('h1').contains('Transcript request');
  });

  it('assign transcript to me and get audio', () => {
    clickViewLink();
    cy.get('#transcriptionOption-2').click();
    cy.get('#submit-button').click();
    cy.get('h1').contains('Hearing');
    cy.url().should('include', '/case/1/hearing/1?startTime=13:00:00&endTime=16:00:00');
  });
});
