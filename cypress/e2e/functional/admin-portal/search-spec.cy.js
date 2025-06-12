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
    cy.get('.moj-js-datepicker-toggle').click();
    cy.get('.moj-datepicker__button--today').click();

    // Cases checked by default
    cy.get('#cases-option').should('be.checked');

    cy.get('#confirm-button').click();

    cy.a11y();

    cy.get('app-case-search-results td.case_number a')
      .contains('123456')
      .parent('td')
      .next('td')
      .should('contain', 'Courthouse 1')
      .next('td')
      .should('contain', 'Multiple')
      .next('td')
      .should('contain', 'Multiple')
      .next('td')
      .should('contain', 'Multiple');

    cy.get('app-case-search-results td.case_number a')
      .contains('654321')
      .parent('td')
      .next('td')
      .should('contain', 'Courthouse 2')
      .next('td')
      .should('contain', 'Courtroom 2')
      .next('td')
      .should('contain', 'Judge 3')
      .next('td')
      .should('contain', 'Defendant 3');

    cy.get('.expired-row').contains('This case has passed its retention date');
  });

  it('event search and results', () => {
    cy.get('#events-option').click();

    cy.get('#confirm-button').click();

    cy.a11y();

    cy.get('app-event-search-results td a')
      .contains('111')
      .parent()
      .next('td')
      .should('contain', '01 Jan 2024 at 04:14:44')
      .next('td')
      .should('contain', 'Event 1')
      .next('td')
      .should('contain', 'Cardiff')
      .next('td')
      .should('contain', 'Room 1')
      .next('td')
      .should('contain', 'This is an event');

    cy.get('app-event-search-results td a')
      .contains('222')
      .parent()
      .next('td')
      .should('contain', '02 Jan 2024 at 11:23:47')
      .next('td')
      .should('contain', 'Event 2')
      .next('td')
      .should('contain', 'Swansea')
      .next('td')
      .should('contain', 'Room 2')
      .next('td')
      .should('contain', 'This is another event');

    cy.get('app-event-search-results td a')
      .contains('333')
      .parent()
      .next('td')
      .should('contain', '03 Jan 2024 at 23:30:15')
      .next('td')
      .should('contain', 'Event 3')
      .next('td')
      .should('contain', 'Newport')
      .next('td')
      .should('contain', 'Room 3')
      .next('td')
      .should('contain', 'This is yet another event');

    cy.get('app-event-search-results tr')
      .should('have.class', 'expired-row')
      .contains('The event text has been anonymised');
  });

  it('view event details', () => {
    cy.get('#events-option').click();

    cy.get('#confirm-button').click();

    cy.get('app-event-search-results td a').contains('111').click();

    cy.get('app-govuk-heading .caption').contains('Event');
    cy.get('app-govuk-heading h1').contains('111');

    // Basic details
    cy.get('dt').contains('Name').next('dd').should('contain', 'Event map 1');
    cy.get('dt').contains('Text').next('dd').should('contain', 'This is an event');
    cy.get('dt').contains('Courthouse').next('dd').should('contain', 'Cardiff');
    cy.get('dt').contains('Courtroom').next('dd').should('contain', 'Room 1');
    cy.get('dt').contains('Timestamp').next('dd').should('contain', '01 Jan 2024 at 04:14:44');

    // Advanced details
    cy.get('.moj-sub-navigation__link').contains('Advanced details').click();

    cy.get('dt').contains('Documentum ID').next('dd').should('contain', '123456');
    cy.get('dt').contains('Source event ID').next('dd').should('contain', 'source123');
    cy.get('dt').contains('Message ID').next('dd').should('contain', '654321');
    cy.get('dt').contains('Type').next('dd').should('contain', '1000');
    cy.get('dt').contains('Subtype').next('dd').should('contain', '1001');
    cy.get('dt').contains('Event handler').next('dd').should('contain', 'StandardEventHandler');
    cy.get('dt').contains('Reporting restriction?').next('dd').should('contain', 'No');
    cy.get('dt').contains('Log entry?').next('dd').should('contain', 'No');
    cy.get('dt').contains('Is current?').next('dd').should('contain', 'Yes');
    cy.get('dt').contains('Is data anonymised?').next('dd').should('contain.text', 'No');
    cy.get('dt').contains('Event status').next('dd').should('contain.text', '4');

    // Version data
    cy.get('dt').contains('Version').next('dd').should('contain', 'v1');
    cy.get('dt').contains('Chronicle ID').next('dd').should('contain', '123');
    cy.get('dt').contains('Antecedent ID').next('dd').should('contain', '456');
    cy.get('dt').contains('Date created').next('dd').should('contain', '01 Jan 2024 at 04:14:51');
    cy.get('dt').contains('Created by').next('dd').should('contain', 'Eric Bristow');
    cy.get('dt').contains('Date last modified').next('dd').should('contain', '01 Jun 2024 at 14:00:00');
    cy.get('dt').contains('Last modified by').next('dd').should('contain', 'Fallon Sherrock');
  });

  it('hearing search and results', () => {
    cy.get('#hearings-option').click();

    cy.get('#confirm-button').click();

    cy.a11y();

    cy.get('app-hearing-search-results td')
      .find('a')
      .contains('123')
      .parent()
      .next('td')
      .should('contain', '01/01/2024')
      .next('td')
      .should('contain', 'Cardiff')
      .next('td')
      .should('contain', 'Room 1');

    cy.get('app-hearing-search-results td')
      .find('a')
      .contains('456')
      .parent()
      .next('td')
      .should('contain', '02/01/2024')
      .next('td')
      .should('contain', 'Swansea')
      .next('td')
      .should('contain', 'Room 2');

    cy.get('app-hearing-search-results td')
      .find('a')
      .contains('789')
      .parent()
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
      .should('contain', '01 Jan 2024 at 11:00:00')
      .next('td')
      .should('contain', '01 Jan 2024 at 12:00:00')
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
      .should('contain', '08 Jan 2023 at 15:30:00')
      .next('td')
      .should('contain', '08 Jan 2023 at 16:15:00')
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
      .should('contain', '01 Sep 2022 at 14:15:00')
      .next('td')
      .should('contain', '01 Sep 2022 at 15:00:00')
      .next('td')
      .should('contain', '6')
      .next('td')
      .should('contain', 'No');
  });

  it('too many results', () => {
    cy.get('#caseId').type('TOO_MANY_RESULTS');
    cy.get('#confirm-button').click();

    cy.get('app-govuk-tabs').contains('There are more than 1000 results. Refine your search.');
  });

  it('no results', () => {
    cy.get('#caseId').type('NO_RESULTS');
    cy.get('#confirm-button').click();

    cy.get('app-govuk-tabs').contains('No results found');
  });

  it('retains form state and results on back button', () => {
    // Fill in form
    cy.get('#courthouse-autocomplete').click();
    cy.get('li').contains('Cardiff').click();
    cy.get('#caseId').type('123456');
    cy.get('#courtroom').type('1');
    cy.get('#specific-date-radio').click();
    cy.get('.moj-js-datepicker-toggle').click();
    cy.get('.moj-datepicker__button--today').click();
    cy.get('#audio-option').click();

    cy.get('#confirm-button').click();

    // Click on a result
    cy.get('app-audio-search-results td').contains('101').click();

    // Go back
    cy.get('.govuk-back-link').click();

    // Check form values are retained
    cy.get('.selected-courthouse').should('contain', 'Cardiff');
    cy.get('#caseId').should('have.value', '123456');
    cy.get('#courtroom').should('have.value', '1');
    cy.get('#specific-date-radio').should('be.checked');

    cy.get('#audio-option').should('be.checked');

    cy.get('.govuk-tabs__list-item--selected').contains('Audio');
    cy.get('app-audio-search-results td').contains('101');
  });

  it('verifies search validation', () => {
    //Test max length of 32 characters for Case ID field with a 33 character string
    cy.get('#caseId').type('123456789012345678901234567890123');
    cy.get('#confirm-button').click();

    //Verify error message
    cy.get('.case-id-error').should('exist').should('contain', 'Case ID must be less than or equal to 32 characters');
    cy.get('.govuk-error-summary__list').should('contain', 'Case ID must be less than or equal to 32 characters');

    // Test max length of 64 characters for Courtroom field with a 65 character string
    cy.get('#courtroom').type(';hK+aySS}Q+b4@qrMczv9n.Kt0cHxNGr=#ZD%_&ugBg6h_qgy[vQ)TzH6@nZ?W45#');

    cy.get('#confirm-button').click();

    cy.get('#caseId').clear();
    cy.get('#caseId').type('123456');

    //Verify error message
    cy.get('.courtroom-error')
      .should('exist')
      .should('contain', 'Courtroom name must be less than or equal to 64 characters');
    cy.get('.govuk-error-summary__list').should(
      'contain',
      'Courtroom name must be less than or equal to 64 characters'
    );

    //Valid input
    cy.get('#courtroom').clear();
    cy.get('#courtroom').type('name value');

    cy.get('#confirm-button').click();

    cy.get('.heading-caption').should('contain', 'Showing 1-3 of 3');
  });

  it('should clear the form when "Clear search" is clicked', () => {
    cy.get('input[name="caseId"]').type('123456');
    cy.get('input[name="courtroom"]').type('1');
    cy.get('input[name="resultsFor"][value="Hearings"]').check();

    cy.get('#date-range-radio').check();
    cy.get('input[name="from"]').type('01/01/2024');
    cy.get('input[name="to"]').type('31/12/2024');

    cy.get('input[name="caseId"]').should('have.value', '123456');
    cy.get('input[name="courtroom"]').should('have.value', '1');
    cy.get('input[name="resultsFor"][value="Hearings"]').should('be.checked');

    cy.contains('a', 'Clear search').click();

    cy.get('input[name="caseId"]').should('have.value', '');
    cy.get('input[name="courtroom"]').should('have.value', '');
    cy.get('#date-range-radio').should('not.be.checked');
    cy.get('#cases-option').should('be.checked');
  });
});
