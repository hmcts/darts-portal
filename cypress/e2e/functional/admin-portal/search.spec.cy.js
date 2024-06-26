import 'cypress-axe';
import '../commands';

describe('Admin - Search screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin');
    cy.injectAxe();
  });

  it('case search and results', () => {
    cy.get('app-govuk-heading h1').contains('Search');

    cy.get('app-search-form').should('exist');

    cy.get('#courthouse-autocomplete').click();
    cy.get('li').contains('Cardiff').click();

    cy.get('#caseId').type('123456');
    cy.get('#courtroom').type('1');

    cy.get('#specific-date-radio').click();
    cy.get('[data-button="datepicker-specific-toggle"]').click();
    cy.get('.ds_datepicker__today').click();

    // Cases checked by default
    cy.get('#cases-option').should('be.checked');

    cy.get('#confirm-button').click();

    cy.a11y();

    cy.get('app-case-search-results td')
      .contains('123456')
      .parent()
      .next('td')
      .should('contain', 'Courthouse 1')
      .next('td')
      .should('contain', 'Multiple')
      .next('td')
      .should('contain', 'Multiple')
      .next('td')
      .should('contain', 'Multiple');

    cy.get('app-case-search-results td')
      .contains('654321')
      .parent()
      .next('td')
      .should('contain', 'Courthouse 2')
      .next('td')
      .should('contain', 'Courtroom 2')
      .next('td')
      .should('contain', 'Judge 3')
      .next('td')
      .should('contain', 'Defendant 3');
  });

  it('event search and results', () => {
    cy.get('#events-option').click();

    cy.get('#confirm-button').click();

    cy.a11y();

    cy.get('app-event-search-results td')
      .contains('111')
      .next('td')
      .should('contain', '01 Jan 2024 at 12:00:00')
      .next('td')
      .should('contain', 'Event 1')
      .next('td')
      .should('contain', 'Cardiff')
      .next('td')
      .should('contain', 'Room 1')
      .next('td')
      .should('contain', 'This is an event');

    cy.get('app-event-search-results td')
      .contains('222')
      .next('td')
      .should('contain', '02 Jan 2024 at 12:00:00')
      .next('td')
      .should('contain', 'Event 2')
      .next('td')
      .should('contain', 'Swansea')
      .next('td')
      .should('contain', 'Room 2')
      .next('td')
      .should('contain', 'This is another event');

    cy.get('app-event-search-results td')
      .contains('333')
      .next('td')
      .should('contain', '03 Jan 2024 at 12:00:00')
      .next('td')
      .should('contain', 'Event 3')
      .next('td')
      .should('contain', 'Newport')
      .next('td')
      .should('contain', 'Room 3')
      .next('td')
      .should('contain', 'This is yet another event');
  });

  it('too many results', () => {
    cy.get('#caseId').type('TOO_MANY_RESULTS');
    cy.get('#confirm-button').click();

    cy.get('app-govuk-tabs').contains('There are more than 500 results. Refine your search.');
  });

  it('no results', () => {
    cy.get('#caseId').type('NO_RESULTS');
    cy.get('#confirm-button').click();

    cy.get('app-govuk-tabs').contains('No results found');
  });
});
