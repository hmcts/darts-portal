import 'cypress-axe';
import { DateTime } from 'luxon';
import { LONG_STRING_2K } from '../constants/validation-constants';
import './commands';

const TOMORROW = DateTime.now().plus({ days: 1 }).startOf('day').toFormat('dd/MM/yyyy');

const CASE_ID_LENGTH = 'Case ID must be less than or equal to 32 characters';
const COURTHOUSE_MISSING = 'You must also enter a courthouse';
const COURTHOUSE_LENGTH = 'Courtroom must be less than or equal to 64 characters';
const DATE_INVALID = 'You have not entered a recognised date in the correct format (for example 31/01/2023)';
const DATE_FUTURE = 'You have selected a date in the future. The hearing date must be in the past';
const DEFENDANT_LENGTH = `Defendant's name must be less than or equal to 2000 characters`;
const JUDGE_LENGTH = `Judge's name must be less than or equal to 2000 characters`;
const KEYWORDS_MAX_LENGTH = 'Keywords must be less than or equal to 2000 characters';
const KEYWORDS_MIN_LENGTH = 'Keywords must be greater than or equal to 3 characters';

describe('Case search', () => {
  beforeEach(() => {
    cy.login();
    cy.injectAxe();
  });

  it('should clear input fields', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.contains('Advanced search').click();
    cy.get('#courthouse-autocomplete').click().type('Reading');
    cy.get('#courtroom').type('Courtroom 1');
    cy.get('#specific-date-radio').click({ force: true });
    cy.get('#specific').type('01/01/2021');
    cy.get('#defendant').type('Defendant 1');
    cy.get('#judge').type('Judge Judy');
    cy.get('#keywords').type('Keywords 1');

    cy.get('button').contains('Search').click();

    cy.get('a').contains('Clear search').click();
    cy.contains('Advanced search').click();

    cy.get('#courthouse-autocomplete').should('have.value', '');
    cy.get('#courtroom').should('have.value', '');
    cy.get('#specific-date-radio').click({ force: true });
    cy.get('#specific').should('have.value', '');
    cy.get('#defendant').should('have.value', '');
    cy.get('#judge').should('have.value', '');
    cy.get('#keywords').should('have.value', '');
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
    cy.get('.govuk-table__row .case_number a').contains('C20220620001');
    cy.get('.govuk-table__row .courthouse').contains('Swansea');
    cy.get('.govuk-table__row .courtroom').contains('3');
    cy.get('.govuk-table__row .judges').contains('Judge Judy');
    cy.get('.govuk-table__row .defendants').contains('Defendant Dave');
    cy.get('.restriction-row').should('contain', 'There are restrictions against this case');
  });

  it('single expired case', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('#case_number').type('C20220620010');
    cy.get('button').contains('Search').click();

    cy.get('#search-results').should('contain', '1 result');
    cy.get('.govuk-table__row .case_number a').contains('C20220620010');
    cy.get('.govuk-table__row .courthouse').contains('Slough');
    cy.get('.govuk-table__row .judges').contains('Judge Juniper');
    cy.get('.govuk-table__row .defendants').contains('Defendant Derren');
    cy.get('.expired-row').should('contain', 'This case has passed its retention date');
  });

  it('single case with multiple courtrooms, judges and defendants', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('#case_number').type('C20220620004');
    cy.get('button').contains('Search').click();

    cy.get('#search-results').should('contain', '1 result');
    cy.get('.govuk-table__row .case_number a').contains('C20220620004');
    cy.get('.govuk-table__row .courthouse').contains('Windsor');
    cy.get('.govuk-table__row .courtroom').contains('Multiple');
    cy.get('.govuk-table__row .judges').contains('Multiple');
    cy.get('.govuk-table__row .defendants').contains('Multiple');
  });

  describe('Linked cases', () => {
    function searchForCase(caseNumber) {
      cy.contains('Search').click();
      cy.get('#case_number').type(caseNumber);
      cy.get('button').contains('Search').click();
    }

    function getLinkedCasesCell() {
      return cy.get('#search-results tbody tr.govuk-table__row td.linked_cases');
    }

    it('should display multiple linked cases with active and inactive links', () => {
      searchForCase('C20220622024');

      getLinkedCasesCell().within(() => {
        cy.get('li').should('have.length', 3);

        cy.contains('a', 'C20220622021').should('have.attr', 'href', '/case/21');
        cy.contains('li', 'C20220622022').should('not.have.descendants', 'a');
        cy.contains('a', 'C20220622023').should('have.attr', 'href', '/case/23');
      });
    });

    it('should navigate to a linked case from search results', () => {
      searchForCase('C20220622024');

      getLinkedCasesCell().contains('a', 'C20220622021').click();
      cy.url().should('include', '/case/21');
      cy.get('app-govuk-heading h1').should('contain.text', 'C20220622021');
    });

    it('should display inactive linked cases as plain text', () => {
      searchForCase('C20220622022');

      getLinkedCasesCell().within(() => {
        cy.contains('li', 'C20220622024').should('exist').and('not.have.descendants', 'a');
        cy.get('a').should('not.exist');
      });
    });

    it('should display a hyphen when there are no linked cases', () => {
      searchForCase('C20220622020');
      getLinkedCasesCell().should('contain.text', '-');
    });

    it('should have no accessibility violations in linked case search results', () => {
      searchForCase('C20220622024');
      getLinkedCasesCell().should('exist');
      cy.a11y();
    });
  });

  it('advanced search fields and multiple results', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.contains('Advanced search').click();
    cy.get('#case_number').type('ALL');
    cy.get('#courthouse-autocomplete');
    cy.get('#courtroom');
    cy.get('#specific-date-radio').click({ force: true });
    cy.get('#specific');
    cy.get('#date-range-radio').click({ force: true });
    cy.get('#from');
    cy.get('#to');
    cy.get('#defendant');
    cy.get('#judge').type('Judge Judy');
    cy.get('#keywords');
    cy.get('button').contains('Search').click();

    cy.get('#search-results').should('contain', '21 results');
    cy.a11y();
    cy.get('a').contains('Clear search').click();
  });

  it('courthouse only', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.contains('Advanced search').click();
    cy.get('#courthouse-autocomplete').type('Reading');
    cy.get('button').contains('Search').click();

    cy.get('app-search-error').should('contain', 'We need more information to search for a case');
  });

  it('validation', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.contains('Advanced search').click();

    // case id length check
    cy.get('#case_number').type('123456789012345678901234567890123'); //33 characters
    cy.get('button').contains('Search').click();
    cy.get('.case-number-error').should('contain', CASE_ID_LENGTH);
    cy.get('.govuk-error-summary').should('contain', CASE_ID_LENGTH);
    cy.get('a').contains('Clear search').click();

    // courtroom only
    cy.contains('Advanced search').click();
    cy.get('#courtroom').type('3');
    cy.get('button').contains('Search').click();
    cy.get('.courthouse-error').should('contain', COURTHOUSE_MISSING);
    cy.get('.govuk-error-summary').should('contain', COURTHOUSE_MISSING);
    cy.get('a').contains('Clear search').click();

    // courthouse length check
    cy.contains('Advanced search').click();
    cy.get('#courtroom').type(';hK+aySS}Q+b4@qrMczv9n.Kt0cHxNGr=#ZD%_&ugBg6h_qgy[vQ)TzH6@nZ?W45#'); //65 characters
    cy.get('button').contains('Search').click();
    cy.get('.courtroom-error').should('contain', COURTHOUSE_LENGTH);
    cy.get('.govuk-error-summary').should('contain', COURTHOUSE_LENGTH);
    cy.get('a').contains('Clear search').click();

    // specific date invalid
    cy.contains('Advanced search').click();
    cy.get('#specific-date-radio').click({ force: true });
    cy.get('#specific').type('blah');
    cy.get('button').contains('Search').click();
    cy.get('#specific-errors').should('contain', DATE_INVALID);
    cy.get('.govuk-error-summary').should('contain', DATE_INVALID);
    cy.get('a').contains('Clear search').click();

    // specific date in future
    cy.contains('Advanced search').click();
    cy.get('#specific-date-radio').click({ force: true });
    cy.get('#specific').type(TOMORROW);
    cy.get('button').contains('Search').click();
    cy.get('#specific-errors').should('contain', DATE_FUTURE);
    cy.get('.govuk-error-summary').should('contain', DATE_FUTURE);
    cy.get('a').contains('Clear search').click();

    // date range from date invalid
    cy.contains('Advanced search').click();
    cy.get('#date-range-radio').click({ force: true });
    cy.get('#from').type('blah');
    cy.get('button').contains('Search').click();
    cy.get('#from-errors').should('contain', DATE_INVALID);
    cy.get('#to-errors').should(
      'contain',
      'You have not selected an end date. Select an end date to define your search'
    );
    cy.get('.govuk-error-summary')
      .should('contain', DATE_INVALID)
      .should('contain', 'You have not selected an end date. Select an end date to define your search');
    cy.get('a').contains('Clear search').click();

    // date range from date in future
    cy.contains('Advanced search').click();
    cy.get('#date-range-radio').click({ force: true });
    cy.get('#from').type(TOMORROW);
    cy.get('button').contains('Search').click();
    cy.get('#from-errors').should('contain', DATE_FUTURE);
    cy.get('.govuk-error-summary').should('contain', DATE_FUTURE);
    cy.get('a').contains('Clear search').click();

    // date range to date invalid
    cy.contains('Advanced search').click();
    cy.get('#date-range-radio').click({ force: true });
    cy.get('#to').type('blah');
    cy.get('button').contains('Search').click();
    cy.get('#to-errors').should('contain', DATE_INVALID);
    cy.get('.govuk-error-summary')
      .should('contain', DATE_INVALID)
      .should('contain', 'You have not selected a start date. Select a start date to define your search');
    cy.get('a').contains('Clear search').click();

    // date range to date in future
    cy.contains('Advanced search').click();
    cy.get('#date-range-radio').click({ force: true });
    cy.get('#to').type(TOMORROW);
    cy.get('button').contains('Search').click();
    cy.get('#to-errors').should('contain', DATE_FUTURE);
    cy.get('.govuk-error-summary').should('contain', DATE_FUTURE);
    cy.get('a').contains('Clear search').click();
    cy.a11y();

    //date from is after to
    cy.contains('Advanced search').click();
    cy.get('#date-range-radio').click({ force: true });
    cy.get('#from').type('01/01/2021');
    cy.get('#to').type('01/01/2020');
    cy.get('button').contains('Search').click();
    cy.get('#to-errors').should('contain', 'The end date must be after the start date');

    // date to is before from
    cy.get('#to').clear().type('01/01/2020');
    cy.get('button').contains('Search').click();
    cy.get('#from-errors').should('contain', 'The start date must be before the end date');
    cy.get('.govuk-error-summary').should('contain', 'The start date must be before the end date');
    cy.get('.govuk-error-summary').should('contain', 'The end date must be after the start date');
    cy.get('a').contains('Clear search').click();

    // defendant's length check over 2k characters
    cy.contains('Advanced search').click();
    cy.get('#defendant').invoke('val', LONG_STRING_2K).type('1');
    cy.get('button').contains('Search').click({ force: true });
    cy.get('.defendant-error').should('contain', DEFENDANT_LENGTH);
    cy.get('.govuk-error-summary').should('contain', DEFENDANT_LENGTH);
    cy.get('a').contains('Clear search').click();

    // judge's length check over 2k characters
    cy.contains('Advanced search').click();
    cy.get('#judge').invoke('val', LONG_STRING_2K).type('1');
    cy.get('button').contains('Search').click({ force: true });
    cy.get('.judge-error').should('contain', JUDGE_LENGTH);
    cy.get('.govuk-error-summary').should('contain', JUDGE_LENGTH);
    cy.get('a').contains('Clear search').click();

    // keywords length check less than 3 characters
    cy.contains('Advanced search').click();
    cy.get('#keywords').type('ab');
    cy.get('button').contains('Search').click({ force: true });
    cy.get('.keyword-error').should('contain', KEYWORDS_MIN_LENGTH);
    cy.get('.govuk-error-summary').should('contain', KEYWORDS_MIN_LENGTH);
    cy.get('a').contains('Clear search').click();

    // keywords length check over 2k characters
    cy.contains('Advanced search').click();
    cy.get('#keywords').invoke('val', LONG_STRING_2K).type('1');
    cy.get('button').contains('Search').click({ force: true });
    cy.get('.keyword-error').should('contain', KEYWORDS_MAX_LENGTH);
    cy.get('.govuk-error-summary').should('contain', KEYWORDS_MAX_LENGTH);
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

  it('timeout', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('#case_number').type('TIMEOUT');
    cy.get('button').contains('Search').click();

    cy.get('app-search-error').should('contain', 'Your search has exceeded the allowed response time of 30 seconds');
  });

  it('restore form values from previous search', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.contains('Advanced search').click();
    cy.get('#case_number').type('C20220620001');
    cy.get('#courthouse-autocomplete').type('Cardiff');
    cy.get('#courtroom').type('2');
    cy.get('#specific-date-radio').click({ force: true });
    cy.get('#specific').type('03/07/2021');
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
    cy.get('ul.govuk-list li.selected-courthouse').should('contain.text', 'Cardiff');
    cy.get('#courtroom').should('have.value', '2');
    cy.get('#specific').should('have.value', '03/07/2021');
    cy.get('#defendant').should('have.value', 'Dean');
    cy.get('#judge').should('have.value', 'Judge Dredd');
    cy.get('#keywords').should('have.value', 'Daffy duck');

    cy.get('#search-results').should('contain', '1 result');
  });
});
