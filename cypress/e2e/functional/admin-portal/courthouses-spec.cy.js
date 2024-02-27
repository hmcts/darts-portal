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
    //TBD
    //Search, check results
    //Search by courthouse name
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
});
