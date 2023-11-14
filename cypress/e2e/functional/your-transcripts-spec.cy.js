import 'cypress-axe';
import './commands';

describe('Your Transcripts', () => {
  beforeEach(() => {
    cy.login();
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
});
