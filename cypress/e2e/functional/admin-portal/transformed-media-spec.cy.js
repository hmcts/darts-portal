import 'cypress-axe';
import { LONG_STRING_2K } from '../../constants/validation-constants';
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
    it('fill in form and clear search, check inputs are empty', () => {
      cy.get('#requestId').type('1');

      cy.get('summary').contains('Advanced search').click();

      cy.get('#caseId').type('1');
      cy.get('#courthouse').type('Swansea');
      cy.get('#hearingDate').type('01/01/2021');
      cy.get('#owner').type('Phil Taylor');
      cy.get('#requestedBy').type('Martin Adams');

      cy.get('#specific-date-radio').click();
      cy.get('#specific').type('01/01/2021');

      cy.get('#search').click();

      cy.get('.govuk-link').contains('Clear search').click();
      cy.get('summary').contains('Advanced search').click();

      cy.get('#caseId').should('have.value', '');
      cy.get('#courthouse').should('have.value', '');
      cy.get('#hearingDate').should('have.value', '');
      cy.get('#owner').should('have.value', '');
      cy.get('#requestedBy').should('have.value', '');

      cy.get('#specific-date-radio').click();
      cy.get('#specific').should('have.value', '');

      cy.a11y();
    });

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

      cy.get('#search').click();

      cy.get('caption').contains('Showing 1-3 of 3 transformed media results');

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

      cy.get('#search').click();

      cy.get('caption').contains('Showing 1-3 of 3 transformed media results');

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

    it('verifies form validation', () => {
      const invalidCaseId = '1234567890123456789012345678901234567890';
      const invalidOwnerRequestedBy = LONG_STRING_2K;
      cy.get('summary').contains('Advanced search').click();

      cy.get('#requestId').type('AAA');
      cy.get('#caseId').type(invalidCaseId);
      cy.get('#owner').invoke('val', invalidOwnerRequestedBy).type('1');
      cy.get('#requestedBy').invoke('val', invalidOwnerRequestedBy).type('1');

      cy.get('#search').click({ force: true });

      cy.get('.govuk-error-summary__list').should('contain', 'Request ID must only contain numbers');
      cy.get('.govuk-error-summary__list').should('contain', 'Case ID must be less than or equal to 32 characters');
      cy.get('.govuk-error-summary__list').should('contain', 'Owner must be less than or equal to 2000 characters');
      cy.get('.govuk-error-summary__list').should(
        'contain',
        'Requested by must be less than or equal to 2000 characters'
      );

      cy.get('.requestid-name-error').should('contain', 'Request ID must only contain numbers');
      cy.get('.caseid-name-error').should('contain', 'Case ID must be less than or equal to 32 characters');
      cy.get('.owner-name-error').should('contain', 'Owner must be less than or equal to 2000 characters');
      cy.get('.requestedby-name-error').should('contain', 'Requested by must be less than or equal to 2000 characters');

      cy.get('#requestId').clear().type('0');
      cy.get('#search').click();

      cy.get('.govuk-error-summary__list').should('contain', 'Request ID must be greater than 0');
      cy.get('.requestid-name-error').should('contain', 'Request ID must be greater than 0');

      cy.get('#requestId').clear().type('2147483649');
      cy.get('#search').click();

      cy.get('.govuk-error-summary__list').should('contain', 'Request ID must be less than 2147483648');
      cy.get('.requestid-name-error').should('contain', 'Request ID must be less than 2147483648');

      cy.get('#requestId').clear().type('1234');
      cy.get('#caseId').clear().type('ABC123CASE');
      cy.get('#owner').clear().type('Terry Jenkins');
      cy.get('#requestedBy').clear().type('John Lowe');

      cy.get('#search').click();

      cy.get('.heading-caption').should('contain', 'Showing 1-3 of 3');
    });
  });

  describe('view transformed media', () => {
    beforeEach(() => {
      cy.get('#search').click();
    });

    it('does not go to delete screen without selected media', () => {
      cy.get('#delete-button').click();
      cy.get('app-delete').should('not.exist');
    });

    it('goes back to form when cancelling delete', () => {
      cy.get('.govuk-checkboxes__input').first().click();
      cy.get('#delete-button').click();
      cy.get('.govuk-link').click();
      cy.get('.heading-caption').contains('Showing 1-3 of 3');
    });

    it('verifies delete media screen', () => {
      cy.get('.govuk-checkboxes__input').first().click();
      cy.get('#delete-button').click();
      cy.get('.govuk-heading-l').contains('Are you sure you want to delete these items?');

      cy.get('table.govuk-table thead tr.header th').then(($headers) => {
        const expectedHeaders = [
          'Media ID',
          'Case ID',
          'Courthouse',
          'Hearing date',
          'Owner',
          'Requested by',
          'Date requested',
        ];

        $headers.each((index, header) => {
          expect(header.innerText.trim()).to.eq(expectedHeaders[index]);
        });
      });

      cy.get('table.govuk-table tbody tr')
        .first()
        .within(() => {
          cy.get('td').eq(0).should('have.text', '1'); // Media ID
          cy.get('td').eq(1).should('have.text', 'CASE123'); // Case ID
          cy.get('td').eq(2).should('have.text', 'Swansea'); // Courthouse
          cy.get('td').eq(3).should('have.text', '01 Jan 2024'); // Hearing date
          cy.get('td').eq(4).should('have.text', 'Eric Bristow'); // Owner
          cy.get('td').eq(5).should('have.text', 'Eric Bristow'); // Requested by
          cy.get('td').eq(6).should('have.text', '01 Jan 2024'); // Date requested
        });
    });
  });

  describe('view transformed media', () => {
    beforeEach(() => {
      cy.get('#search').click();
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
      cy.get('#media-details dd').contains('2.00MB');

      cy.get('#associated-audio-details h2').contains('Associated audio');
      cy.get('td.audio-id').first().contains('0');
      cy.get('td.courthouse').first().contains('courthouse 12');
      cy.get('td.courtroom').first().contains('courtroom 11');
      cy.get('td.start-time').first().contains('1 Jun 2020 18:00:00');
      cy.get('td.end-time').first().contains('1 Jun 2020 19:00:00');
      cy.get('td.channel').first().contains('1');
      cy.get('td.is-current').first().contains('Yes');

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
