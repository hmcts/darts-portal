import 'cypress-axe';
import '../commands';

describe('Admin - Transformed media screen', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.login('admin');
    cy.injectAxe();
    cy.visit('/admin/transformed-media');
  });

  it('page elements', () => {
    cy.get('app-govuk-heading h1').contains('Transformed media');
    cy.get('app-search-transformed-media-form').should('exist');
  });

  describe('search form', () => {
    it('fill in form and perform search, check results', () => {
      cy.get('#requestId').type('1');

      cy.get('summary').contains('Advanced search').click();

      cy.get('#caseId').type('1');
      cy.get('#courthouse').type('Swansea');
      cy.get('#hearingDate').type('01/01/2021');
      cy.get('#owner').type('Phil Taylor');
      cy.get('#requestedBy').type('Martin Adams');

      cy.get('#specific-date-radio').click();
      cy.get('#specific').type('01/01/2021');

      cy.get('[data-button="button-search"]').click();

      cy.get('caption').contains('Showing 1-3 of 3 results');

      cy.get('app-data-table').contains('filename.mp3');
      cy.get('app-data-table').contains('filename2.mp3');
      cy.get('app-data-table').contains('filename3.mp3');

      cy.get('app-data-table').contains('Swansea');
      cy.get('app-data-table').contains('Newport');
      cy.get('app-data-table').contains('Cardiff');

      cy.get('app-data-table').contains('01 Jan 2022');
      cy.get('app-data-table').contains('01 Jan 2023');
      cy.get('app-data-table').contains('01 Jan 2024');

      cy.get('app-data-table').contains('Eric Bristow');
      cy.get('app-data-table').contains('Fallon Sherrock');
      cy.get('app-data-table').contains('Trina Gulliver');

      cy.get('app-data-table').contains('2.0MB');
      cy.get('app-data-table').contains('1.0MB');
      cy.get('app-data-table').contains('3.0MB');

      // cy.a11y(); // TODO: Fix
    });
  });
});
