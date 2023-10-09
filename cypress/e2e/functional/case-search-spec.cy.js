import './commands';
import { DateTime } from 'luxon';

const TOMORROW = DateTime.now().plus({ days: 1 }).startOf('day').toFormat('dd/MM/yyyy');

const COURTHOUSE_MISSING = 'You must also enter a courthouse';
const DATE_INVALID = 'You have not entered a recognised date in the correct format (for example 31/01/2023)';
const DATE_FUTURE = 'You have selected a date in the future. The hearing date must be in the past';

describe('Case search', () => {
  beforeEach(() => {
    cy.login();
  });

  it('no search criteria', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('button').contains('Search').click();

    cy.get('app-search-error').should('contain', 'No search results');
    cy.get('app-search-error').should('contain', 'You need to enter some search terms');
  });

  it('single case', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('#case_number').type('C20220620001');
    cy.get('button').contains('Search').click();

    cy.get('#search-results').should('contain', '1 result');
    cy.get('.govuk-table__row').contains('C20220620001');
    cy.get('.govuk-table__row').contains('Swansea');
    cy.get('.govuk-table__row').contains('1');
    cy.get('.govuk-table__row').contains('Judge Judy');
    cy.get('.govuk-table__row').contains('Defendant Dave');
    cy.get('.restriction-row').should('contain', 'Restriction: Section 4(2) of the Contempt of Court Act 1981');
  });

  it('advanced search fields and multiple results', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.contains('Advanced search').click();
    cy.get('#courthouse');
    cy.get('#courtroom');
    cy.get('#specific-date-radio').click();
    cy.get('#specific_date');
    cy.get('#date-range-radio').click();
    cy.get('#date_from');
    cy.get('#date_to');
    cy.get('#defendant');
    cy.get('#judge').type('Judge Judy');
    cy.get('#keywords');
    cy.get('button').contains('Search').click();

    cy.get('#search-results').should('contain', '12 results');
  });

  it('courthouse only', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.contains('Advanced search').click();
    cy.get('#courthouse').type('Reading');
    cy.get('button').contains('Search').click();

    cy.get('app-search-error').should('contain', 'There are more than 500 results');
  });

  it('validation', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.contains('Advanced search').click();

    // courtroom only
    cy.get('#courtroom').type('3');
    cy.get('button').contains('Search').click();
    cy.get('#courthouse-errors').should('contain', COURTHOUSE_MISSING);
    cy.get('.govuk-error-summary').should('contain', COURTHOUSE_MISSING);
    cy.get('a').contains('Clear search').click();

    // specific date invalid
    cy.get('#specific-date-radio').click();
    cy.get('#specific_date').type('blah');
    cy.get('button').contains('Search').click();
    cy.get('#specific_date-errors').should('contain', DATE_INVALID);
    cy.get('.govuk-error-summary').should('contain', DATE_INVALID);
    cy.get('a').contains('Clear search').click();

    // specific date in future
    cy.get('#specific-date-radio').click();
    cy.get('#specific_date').type(TOMORROW);
    cy.get('button').contains('Search').click();
    cy.get('#specific_date-errors').should('contain', DATE_FUTURE);
    cy.get('.govuk-error-summary').should('contain', DATE_FUTURE);
    cy.get('a').contains('Clear search').click();

    // date range from date invalid
    cy.get('#date-range-radio').click();
    cy.get('#date_from').type('blah');
    cy.get('button').contains('Search').click();
    cy.get('#date_from-errors').should('contain', DATE_INVALID);
    cy.get('#date_to-errors').should(
      'contain',
      'You have not selected an end date. Select an end date to define your search'
    );
    cy.get('.govuk-error-summary')
      .should('contain', DATE_INVALID)
      .should('contain', 'You have not selected an end date. Select an end date to define your search');
    cy.get('a').contains('Clear search').click();

    // date range from date in future
    cy.get('#date-range-radio').click();
    cy.get('#date_from').type(TOMORROW);
    cy.get('button').contains('Search').click();
    cy.get('#date_from-errors').should('contain', DATE_FUTURE);
    cy.get('.govuk-error-summary').should('contain', DATE_FUTURE);
    cy.get('a').contains('Clear search').click();

    // date range to date invalid
    cy.get('#date-range-radio').click();
    cy.get('#date_to').type('blah');
    cy.get('button').contains('Search').click();
    cy.get('#date_to-errors').should('contain', DATE_INVALID);
    cy.get('.govuk-error-summary')
      .should('contain', DATE_INVALID)
      .should('contain', 'You have not selected a start date. Select a start date to define your search');
    cy.get('a').contains('Clear search').click();

    // date range to date in future
    cy.get('#date-range-radio').click();
    cy.get('#date_to').type(TOMORROW);
    cy.get('button').contains('Search').click();
    cy.get('#date_to-errors').should('contain', DATE_FUTURE);
    cy.get('.govuk-error-summary').should('contain', DATE_FUTURE);
    cy.get('a').contains('Clear search').click();
  });

  it('internal error', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('#case_number').type('UNKNOWN_ERROR');
    cy.get('button').contains('Search').click();

    cy.get('app-search-error').should('contain', 'An error has occurred. Please try again later.');
  });

  it('too many results', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('#case_number').type('TOO_MANY_RESULTS');
    cy.get('button').contains('Search').click();

    cy.get('app-search-error').should('contain', 'There are more than 500 results');
  });

  it('restore form values from previous search', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.contains('Advanced search').click();
    cy.get('#case_number').type('C20220620001');
    cy.get('#courthouse').type('Cardiff');
    cy.get('#courtroom').type('2');
    cy.get('#specific-date-radio').click();
    cy.get('#specific_date').type('03/07/2021');
    cy.get('#defendant').type('Dean');
    cy.get('#judge').type('Judge Dredd');
    cy.get('#keywords').type('Daffy duck');
    cy.get('button').contains('Search').click();

    cy.get('#search-results').should('contain', '1 result');

    // >> Click into a case
    cy.get('#search-results a').click();

    // Check case file page
    cy.get('h1').should('contain', 'C20220620001');

    // << Breadcrumb back to search
    cy.get('.govuk-breadcrumbs__link').contains('Search').click();

    // Check for Search page
    cy.get('h1').should('contain', 'Search for a case');

    // check advanced search is open
    cy.get('details').should('have.attr', 'open');

    // Should have previous form values and search results
    cy.get('#case_number').should('have.value', 'C20220620001');
    cy.get('#courthouse').should('have.value', 'Cardiff');
    cy.get('#courtroom').should('have.value', '2');
    cy.get('#specific_date').should('have.value', '03/07/2021');
    cy.get('#defendant').should('have.value', 'Dean');
    cy.get('#judge').should('have.value', 'Judge Dredd');
    cy.get('#keywords').should('have.value', 'Daffy duck');

    cy.get('#search-results').should('contain', '1 result');
  });
});
