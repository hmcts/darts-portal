import 'cypress-axe';
import '../commands';

describe('Admin - Transcript requests', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/transcripts');
    cy.injectAxe();
  });

  it('searches for a transcript', () => {
    cy.get('#requestId').type('1');
    cy.get('button').contains('Search').click();
    cy.get('app-search-transcripts-results').contains('C0000000001');
    cy.get('app-search-transcripts-results').contains('Slough');
    cy.get('app-search-transcripts-results').contains('01 Jan 2022');
    cy.get('app-search-transcripts-results').contains('01 Jan 2023 02:00');
    cy.get('app-search-transcripts-results').contains('Requested');
    cy.get('app-search-transcripts-results').contains('Manual');

    cy.get('#requestId').clear().type('2');
    cy.get('button').contains('Search').click();
    cy.get('app-search-transcripts-results').contains('C0000000002');
    cy.get('app-search-transcripts-results').contains('Kingston');
    cy.get('app-search-transcripts-results').contains('02 Jan 2022');
    cy.get('app-search-transcripts-results').contains('02 Jan 2023 04:00');
    cy.get('app-search-transcripts-results').contains('Requested');
    cy.get('app-search-transcripts-results').contains('Automatic');

    cy.a11y();
  });
});
