import 'cypress-axe';
import './commands';

describe('Your Transcripts', () => {
  beforeEach(() => {
    cy.login('internal');
    cy.injectAxe();
  });

  it('shows your transcripts', () => {
    cy.contains('Your Transcripts').click();
    cy.get('h1').should('contain', 'Your Transcripts');
    cy.a11y();
  });

  it('shows in progress table', () => {
    cy.contains('Your Transcripts').click();
    cy.get('#in-progress-table').should('contain', 'Awaiting Authorisation');
    cy.get('#in-progress-table').should('contain', 'With Transcriber');
    cy.get('#in-progress-table').should('contain', 'Swansea');
  });

  it('shows ready table', () => {
    cy.contains('Your Transcripts').click();
    cy.get('#ready-table').should('contain', 'Complete');
    cy.get('#ready-table').should('contain', 'Rejected');
    cy.get('#ready-table').should('contain', 'View');
    cy.get('#ready-table').should('contain', 'Cardiff');
  });

  it('shows approvers table', () => {
    cy.contains('Your Transcripts').click();
    cy.contains('Transcript requests to review').click();
    cy.get('h2').should('contain', 'Requests to approve or reject');
    cy.get('#approver-table').should('contain', 'Request ID');
    cy.get('#approver-table').should('contain', 'View');
  });

  it('should go to approve transcript view', () => {
    cy.contains('Your Transcripts').click();
    cy.contains('Transcript requests to review').click();
    cy.get('h2').should('contain', 'Requests to approve or reject');
    cy.get('#approver-table').should('contain', 'Request ID');
    cy.contains('T12345').parents('tr').contains('View').click();
    cy.a11y();

    cy.get('h1').should('contain', 'Approve transcript request');
    cy.get('.govuk-table').should('contain', 'C20220620001');
    cy.get('h1').should('contain', 'Do you approve this request?');
    cy.get('#reject-radio').click();
    cy.get('label').should('contain', 'Why can you not approve this request?');
  });
});
