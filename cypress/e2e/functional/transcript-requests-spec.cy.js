import 'cypress-axe';
import './commands';

describe('Transcript requests', () => {
  const clickViewLink = () =>
    cy.get('#transcript-requests-table td').contains('Manual').parents('tr').contains('View').click();

  beforeEach(() => {
    cy.login('transcriber');
    cy.injectAxe();
    cy.get('#transcript-requests-link').click();
  });

  it('shows "Transcript requests"', () => {
    cy.get('h1').should('contain', 'Transcript requests');
    cy.a11y();
  });

  it('has Data in the table', () => {
    cy.get('#transcript-requests-table').should('contain', 'Newcastle');
    cy.get('#transcript-requests-table').should('contain', 'Court Log');
    cy.get('#transcript-requests-table').should('contain', 'Manual');
    cy.a11y();
  });

  it('takes you to assign transcript page', () => {
    cy.get('#transcript-requests-table td').contains('Up to 3 working days').parents('tr').contains('View').click();
    cy.contains('Case ID').parent().should('contain', 'C20220620001');
    cy.contains('Hearing Date').parent().should('contain', '07 Aug 2023');
    cy.get('h1').should('contain', 'Choose an action');
    cy.get('.govuk-label.govuk-radios__label').should('contain', 'Assign to me');
    cy.get('#submit-button').should('contain', 'Continue');
    cy.a11y();
  });

  it('assign transcript to me', () => {
    clickViewLink();
    cy.get('#transcriptionOption').click({ force: true });
    cy.get('#submit-button').click();
    cy.get('h1').contains('Your work');
    cy.get('#unassignedTranscriptCount').should('contain', '4');
    cy.get('#assignedTranscriptCount').should('contain', '4');
  });

  it('assign transcript to me and upload', () => {
    clickViewLink();
    cy.get('#transcriptionOption-3').click({ force: true });
    cy.get('#submit-button').click();
    cy.get('h1').contains('Transcript request');
    cy.get('#unassignedTranscriptCount').should('contain', '4');
    cy.get('#assignedTranscriptCount').should('contain', '4');
  });

  it('assign transcript to me and get audio', () => {
    clickViewLink();
    cy.get('#transcriptionOption-2').click({ force: true });
    cy.get('#submit-button').click();
    cy.get('h1').contains('Hearing');
    cy.url().should('include', 'case/1/hearing/1?startTime=14:00:00&endTime=17:00:00');
    cy.get('#unassignedTranscriptCount').should('contain', '4');
    cy.get('#assignedTranscriptCount').should('contain', '4');
  });

  afterEach(() => {
    cy.request('/api/transcriptions/reset');
  });
});
