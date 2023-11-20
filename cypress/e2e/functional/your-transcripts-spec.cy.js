import 'cypress-axe';
import './commands';

const navigationSelector = '.moj-primary-navigation';

describe('Your Transcripts', () => {
  beforeEach(() => {
    cy.login();
    cy.injectAxe();
    cy.contains('Your Transcripts').click();
  });

  it('shows your transcripts', () => {
    cy.get('h1').should('contain', 'Your Transcripts');
    cy.a11y();
  });

  it('shows in progress table', () => {
    cy.get('#in-progress-table').should('contain', 'Awaiting Authorisation');
    cy.get('#in-progress-table').should('contain', 'With Transcriber');
    cy.get('#in-progress-table').should('contain', 'Swansea');
    cy.a11y();
  });

  it('shows ready table', () => {
    cy.get('#ready-table').should('contain', 'Complete');
    cy.get('#ready-table').should('contain', 'Rejected');
    cy.get('#ready-table').should('contain', 'View');
    cy.get('#ready-table').should('contain', 'Cardiff');
    cy.a11y();
  });

  it('shows approvers table', () => {
    cy.contains('Transcript requests to review').click();
    cy.get('h2').should('contain', 'Requests to approve or reject');
    cy.get('#approver-table').should('contain', 'Request ID');
    cy.get('#approver-table').should('contain', 'View');
    cy.a11y();
  });

  it('deletes a transcript', () => {
    cy.get('#ready-table tbody input[type="checkbox"]').first().click();
    cy.get('#delete-button').click();
    cy.get(navigationSelector).should('not.exist');
    cy.contains('Are you sure you want to delete this item');
    cy.get('button.govuk-button--warning').click();
    cy.contains('CXYZ12345').should('not.exist');
    cy.get(navigationSelector).should('exist');

    cy.a11y();
  });

  it('shows approvers table', () => {
    cy.contains('Your Transcripts').click();
    cy.contains('Transcript requests to review').click();
    cy.get('h2').should('contain', 'Requests to approve or reject');
    cy.get('#approver-table').should('contain', 'Request ID');
    cy.get('#approver-table').should('contain', 'View');
  });
});
