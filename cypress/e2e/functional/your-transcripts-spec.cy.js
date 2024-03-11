import 'cypress-axe';
import './commands';

const navigationSelector = '.moj-primary-navigation';

describe('Your transcripts', () => {
  beforeEach(() => {
    cy.login('requestor-approver');
    cy.injectAxe();
    cy.contains('Your transcripts').click();
  });

  it('shows your transcripts', () => {
    cy.contains('Your transcripts').click();
    cy.get('h1').should('contain', 'Your transcripts');
    cy.a11y();
  });

  it('shows in progress table', () => {
    cy.contains('Your transcripts').click();
    cy.get('#in-progress-table').should('contain', 'Awaiting Authorisation');
    cy.get('#in-progress-table').should('contain', 'With Transcriber');
    cy.get('#in-progress-table').should('contain', 'Swansea');
    cy.a11y();
  });

  it('shows ready table', () => {
    cy.contains('Your transcripts').click();
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
    cy.get('#ready-table tbody input[type="checkbox"]').first().click({ force: true });
    cy.get('#delete-button').click();
    cy.get(navigationSelector).should('not.exist');
    cy.contains('Are you sure you want to remove this transcript request');
    cy.get('button.govuk-button--warning').click();
    cy.contains('CXYZ12345').should('not.exist');
    cy.get(navigationSelector).should('exist');

    cy.a11y();
  });

  it('shows approvers table', () => {
    cy.contains('Your transcripts').click();
    cy.contains('Transcript requests to review').click();
    cy.get('h2').should('contain', 'Requests to approve or reject');
    cy.get('#approver-table').should('contain', 'Request ID');
    cy.get('#approver-table').should('contain', 'View');
  });

  it('should go to approve transcript view', () => {
    cy.contains('Your transcripts').click();
    cy.contains('Transcript requests to review').click();
    cy.get('h2').should('contain', 'Requests to approve or reject');
    cy.get('#approver-table').should('contain', 'Request ID');
    cy.contains('T12345').parents('tr').contains('View').click();
    cy.a11y();

    cy.get('h1').should('contain', 'Approve transcript request');
    cy.get('.govuk-table').should('contain', 'C20220620001');
    cy.get('h1').should('contain', 'Do you approve this request?');
    cy.get('#reject-radio').click({ force: true });
    cy.get('label').should('contain', 'Why can you not approve this request?');
  });

  it('should show error message if transcript already approved', () => {
    cy.contains('Your transcripts').click();
    cy.contains('Transcript requests to review').click();
    cy.get('h2').should('contain', 'Requests to approve or reject');
    cy.get('#approver-table').should('contain', 'Request ID');
    cy.contains('CXYZ12345').parents('tr').contains('View').click();
    cy.a11y();

    cy.get('h1').should('contain', 'Approve transcript request');
    cy.get('.govuk-table').should('contain', 'C20220620001');
    cy.get('h1').should('contain', 'Do you approve this request?');
    cy.get('#approve-radio').click({ force: true });
    cy.get('#submit-button').click();
    cy.get('h1').should('contain', 'This request is no longer available');
    cy.get('p').should('contain', 'Another user may have already actioned this request.');
    cy.get('#return-link').should('contain', 'Return to your transcripts');
  });

  it('should navigate to partial delete error screen on error status code 400 and be able to navigate back to transcriptions', () => {
    cy.contains('Your transcripts').click();

    cy.get('#ready-table tbody input[type="checkbox"]').last().click({ force: true });
    cy.get('#delete-button').click();
    cy.get(navigationSelector).should('not.exist');
    cy.contains('Are you sure you want to remove this transcript request');
    cy.get('button.govuk-button--warning').click();
    cy.contains('FGH12345').should('not.exist');
    cy.get(navigationSelector).should('not.exist');
    cy.contains('There was a problem removing one or more transcript requests').should('exist');

    cy.contains('Go back').click();

    cy.contains('Your transcripts').should('exist');

    cy.a11y();
  });
});
