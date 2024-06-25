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

  it('hearing search and results', () => {
    cy.get('#hearings-option').click();

    cy.get('#confirm-button').click();

    cy.a11y();

    cy.get('app-hearing-search-results td')
      .contains('123')
      .next('td')
      .should('contain', '01/01/2024')
      .next('td')
      .should('contain', 'Cardiff')
      .next('td')
      .should('contain', 'Room 1');

    cy.get('app-hearing-search-results td')
      .contains('456')
      .next('td')
      .should('contain', '02/01/2024')
      .next('td')
      .should('contain', 'Swansea')
      .next('td')
      .should('contain', 'Room 2');

    cy.get('app-hearing-search-results td')
      .contains('789')
      .next('td')
      .should('contain', '03/01/2024')
      .next('td')
      .should('contain', 'Newport')
      .next('td')
      .should('contain', 'Room 3');
  });

  it('audio search and results', () => {
    cy.get('#audio-option').click();

    cy.get('#confirm-button').click();

    cy.a11y();

    cy.get('app-audio-search-results td')
      .contains('101')
      .parent()
      .next('td')
      .should('contain', 'Birmingham')
      .next('td')
      .should('contain', 'Room A')
      .next('td')
      .should('contain', '01 Jan 2024')
      .next('td')
      .should('contain', '11:00AM')
      .next('td')
      .should('contain', '12:00PM')
      .next('td')
      .should('contain', '4')
      .next('td')
      .should('contain', 'No');

    cy.get('app-audio-search-results td')
      .contains('102')
      .parent()
      .next('td')
      .should('contain', 'Cardiff')
      .next('td')
      .should('contain', 'Room B')
      .next('td')
      .should('contain', '08 Jan 2023')
      .next('td')
      .should('contain', '03:30PM')
      .next('td')
      .should('contain', '04:15PM')
      .next('td')
      .should('contain', '5')
      .next('td')
      .should('contain', 'Yes');

    cy.get('app-audio-search-results td')
      .contains('103')
      .parent()
      .next('td')
      .should('contain', 'Edinburgh')
      .next('td')
      .should('contain', 'Room C')
      .next('td')
      .should('contain', '01 Sep 2022')
      .next('td')
      .should('contain', '02:15PM')
      .next('td')
      .should('contain', '03:00PM')
      .next('td')
      .should('contain', '6')
      .next('td')
      .should('contain', 'No');
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
