import 'cypress-axe';
import '../commands';

describe('Admin - Courthouses screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/courthouses');
    cy.injectAxe();
  });

  it('Load page', () => {
    cy.get('h1').should('contain', 'Courthouses');
    cy.get('h2').should('contain', 'Search for courthouse');
    cy.a11y();
  });

  it('Courthouses search form', () => {
    cy.get('.govuk-label').contains('Courthouse name').should('exist');
    cy.get('#courthouseName').should('exist');
    cy.get('.govuk-label').contains('Display name').should('exist');
    cy.get('#displayName').should('exist');
    cy.get('.govuk-label').contains('Region').should('exist');
    cy.get('#region').should('exist');
  });

  it('Search courthouses', () => {
    cy.get('#courthouseName').type('Reading');
    cy.get('button[type="submit"]').click();

    cy.get('.govuk-table__caption').should('contain', '1 result');
    cy.get('app-courthouse-search-results').should('contain', 'Reading');

    cy.contains('a.govuk-link', 'Clear search').click();

    cy.get('#displayName').type('Slough');
    cy.get('button[type="submit"]').click();

    cy.get('.govuk-table__caption').should('contain', '1 result');
    cy.get('app-courthouse-search-results').should('contain', 'Slough');

    cy.contains('a.govuk-link', 'Clear search').click();

    cy.get('#region').type('London');
    cy.get('button[type="submit"]').click();

    cy.get('.govuk-table__caption').should('contain', '1 result');
    cy.get('app-courthouse-search-results').should('contain', 'Kingston');
    cy.a11y();
  });

  it('Clear search results', () => {
    cy.get('#courthouseName').type('Reading');
    cy.get('#displayName').type('Reading');
    cy.get('#region').type('South west');
    cy.get('button[type="submit"]').click();

    cy.get('.govuk-table__caption').should('contain', '1 result');

    cy.contains('a.govuk-link', 'Clear search').click();

    cy.get('#region').should('have.value', '');
    cy.get('#courthouseName').should('have.value', '');
    cy.get('#displayName').should('have.value', '');

    cy.a11y();
  });

  it('No search results', () => {
    cy.get('#courthouseName').type('ZZZZZZZZZ');
    cy.get('button[type="submit"]').click();

    cy.get('app-courthouse-search-results').should('contain', 'No search results');
    cy.get('.govuk-body').should(
      'contain',
      'No courthouses can be found with the search details provided. Review your search criteria and try again.'
    );
    cy.a11y();
  });

  it('Create courthouse', () => {
    cy.contains('button.govuk-button', 'Create new courthouse').click();

    cy.contains('span', 'Create courthouse').should('exist');
    cy.contains('h1', 'Courthouse details').should('exist');

    cy.contains('button.govuk-button', 'Continue').click();

    // Errors
    cy.get('.govuk-error-summary').should('contain', 'Enter a courthouse code');
    cy.get('.courthouse-name-error').should('contain', 'Enter a courthouse code');
    cy.get('.govuk-error-summary').should('contain', 'Enter a display name');
    cy.get('.display-name-error').should('contain', 'Enter a display name');
    cy.get('.govuk-error-summary').should('contain', 'Select a region');
    cy.get('.region-error').should('contain', 'Select a region');

    cy.get('#courthouse-name').type('READING');
    cy.get('.govuk-error-summary').should('contain', 'The courthouse code you entered exists already');
    cy.get('.courthouse-name-error').should('contain', 'The courthouse code you entered exists already');
    cy.get('#courthouse-name').clear();

    cy.get('#display-name').type('Reading');
    cy.get('.govuk-error-summary').should('contain', 'The display name you entered exists already');
    cy.get('.display-name-error').should('contain', 'The display name you entered exists already');
    cy.get('#display-name').clear();

    cy.get('#courthouse-name').type('COURTHOUSE');
    cy.get('#display-name').type('Courthouse');
    cy.get('#wales-radio').click();

    cy.contains('.govuk-button', 'Continue').click();
    cy.contains('h1', 'Check details').should('exist');
    cy.contains('.govuk-button', 'Create courthouse').click();
  });
});
