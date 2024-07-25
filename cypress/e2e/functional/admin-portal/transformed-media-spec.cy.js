import 'cypress-axe';
import '../commands';

describe('Admin - Transformed media screen', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.login('admin');
    cy.visit('/admin/transformed-media');
    cy.injectAxe();
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

      cy.a11y();
    });

    it('persists search criteria and results', () => {
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

      cy.get('app-data-table').get('a').contains('1').click();

      cy.get('.govuk-back-link').click();

      cy.get('#requestId').should('have.value', '1');
      cy.get('#caseId').should('have.value', '1');
      cy.get('#courthouse').should('have.value', 'Swansea');
      cy.get('#hearingDate').should('have.value', '01/01/2021');
      cy.get('#owner').should('have.value', 'Phil Taylor');
      cy.get('#requestedBy').should('have.value', 'Martin Adams');
      cy.get('#specific').should('have.value', '01/01/2021');

      cy.get('app-data-table').contains('filename.mp3');
    });
  });

  describe('view transformed media', () => {
    beforeEach(() => {
      cy.get('[data-button="button-search"]').click();
    });

    it('renders', () => {
      cy.get('.view-link').first().click();

      cy.get('app-govuk-heading').should('contain', 'Transformed media').and('contain', '1');

      cy.get('#request-details h2').contains('Request details');
      cy.get('#request-details dt').contains('Owner');
      cy.get('#request-details dd').contains('Eric Bristow (eric.bristow@darts.local)');

      cy.get('#request-details dt').contains('Requested by');
      cy.get('#request-details dd').contains('Eric Bristow');

      cy.get('#request-details dt').contains('Request ID');
      cy.get('#request-details dd').contains('1');

      cy.get('#request-details dt').contains('Date requested');
      cy.get('#request-details dd').contains('01 January 2021');

      cy.get('#request-details dt').contains('Hearing date');
      cy.get('#request-details dd').contains('01 January 2021');

      cy.get('#request-details dt').contains('Courtroom');
      cy.get('#request-details dd').contains('courtroom 1');

      cy.get('#request-details dt').contains('Audio requested');
      cy.get('#request-details dd').contains('Start time 9:30:00AM - End time 10:00:00AM');

      cy.get('#case-details h2').contains('Case details');
      cy.get('#case-details dt').contains('Case ID');
      cy.get('#case-details dd').contains('C20220620001');

      cy.get('#case-details dt').contains('Courthouse');
      cy.get('#case-details dd').contains('Swansea');

      cy.get('#case-details dt').contains('Judge(s)');
      cy.get('#case-details dd').contains('Judge Judy');

      cy.get('#case-details dt').contains('Defendant(s)');
      cy.get('#case-details dd').contains('Defendant Dave');

      cy.get('#media-details h2').contains('Media details');
      cy.get('#media-details dt').contains('Filename');
      cy.get('#media-details dd').contains('filename.mp3');

      cy.get('#media-details dt').contains('File type');
      cy.get('#media-details dd').contains('MP3');

      cy.get('#media-details dt').contains('File size');
      cy.get('#media-details dd').contains('2MB');

      cy.get('#associated-audio-details h2').contains('Associated audio');
      cy.get('.govuk-table__cell.audio-id').first().contains('0');
      cy.get('.govuk-table__cell.case-id').first().contains('001');
      cy.get('.govuk-table__cell.hearing-date').first().contains('01 Jun 2020');
      cy.get('.govuk-table__cell.courthouse').first().contains('courthouse 12');
      cy.get('.govuk-table__cell.start-time').first().contains('6:00:00PM');
      cy.get('.govuk-table__cell.end-time').first().contains('7:00:00PM');
      cy.get('.govuk-table__cell.courtroom').first().contains('courtroom 11');
      cy.get('.govuk-table__cell.channel').first().contains('1');

      cy.a11y();
    });

    it('change owner', () => {
      cy.get('.view-link').first().click();

      cy.get('#change-link').click();

      cy.get('app-govuk-heading').should('contain', 'Change owner');

      cy.get('app-auto-complete').should('contain', 'Search for a user');

      cy.get('app-auto-complete').click();
      cy.get('li').contains('Eric Bristow').click();

      cy.get('#save-button').click();

      cy.get('app-govuk-banner').should('contain', 'Changed media request owner to Eric Bristow');
      cy.a11y();
    });
  });
});
