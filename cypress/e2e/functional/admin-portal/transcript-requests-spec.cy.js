import 'cypress-axe';
import '../commands';

describe('Admin - Transcript requests', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/transcripts');
    cy.injectAxe();
  });
  describe('search form', () => {
    it('searches for a transcripts', () => {
      cy.get('button').contains('Search').click();
      cy.get('app-search-transcripts-results').contains('C0000000001');
      cy.get('app-search-transcripts-results').contains('Slough');
      cy.get('app-search-transcripts-results').contains('01 Jan 2022');
      cy.get('app-search-transcripts-results').contains('01 Jan 2023 02:00');
      cy.get('app-search-transcripts-results').contains('Requested');
      cy.get('app-search-transcripts-results').contains('Manual');

      cy.get('app-search-transcripts-results').contains('C0000000002');
      cy.get('app-search-transcripts-results').contains('Kingston');
      cy.get('app-search-transcripts-results').contains('02 Jan 2022');
      cy.get('app-search-transcripts-results').contains('02 Jan 2023 04:00');
      cy.get('app-search-transcripts-results').contains('Requested');
      cy.get('app-search-transcripts-results').contains('Automatic');

      cy.a11y();
    });
  });

  describe('View transcript', () => {
    beforeEach(() => {
      cy.get('#requestId').clear().type('1');
      cy.get('button').contains('Search').click();
    });

    it('check template', () => {
      cy.get('span.govuk-caption-l').contains('Transcript request');

      cy.get('#status-details').contains('Status');
      cy.get('#status-details').contains('With Transcriber');

      cy.get('#status-details').contains('Assigned to');
      cy.get('#status-details').contains('Fallon Sherrock');
      cy.get('#status-details').contains('(fallon.sherrock@darts.local)');

      cy.get('#status-details').contains('Associated groups');
      cy.get('#status-details').contains('Judiciary');
      cy.get('#status-details').contains('Opus Transcribers');
      cy.get('#status-details').contains('Super user (DARTS portal)');

      cy.get('#request-details').contains('Request details');

      cy.get('#request-details').contains('Hearing date');
      cy.get('#request-details').contains('08 Nov 2023');

      cy.get('#request-details').contains('Request type');
      cy.get('#request-details').contains('Specified Times');

      cy.get('#request-details').contains('Request method');
      cy.get('#request-details').contains('Manual');

      cy.get('#request-details').contains('Request ID');
      cy.get('#request-details').contains('1');

      cy.get('#request-details').contains('Urgency');
      cy.get('#request-details').contains('Standard');

      cy.get('#request-details').contains('Audio for transcript');
      cy.get('#request-details').contains('Start time 14:00:00 - End time 17:00:00');

      cy.get('#request-details').contains('Requested by');
      cy.get('#request-details').contains('Eric Bristow');
      cy.get('#request-details').contains('(eric.bristow@darts.local)');

      cy.get('#request-details').contains('Received');
      cy.get('#request-details').contains('17 Nov 2023 12:53:07');

      cy.get('#request-details').contains('Instructions');
      cy.get('#request-details').contains('Please expedite my request');

      cy.get('#request-details').contains('Judge approval');
      cy.get('#request-details').contains('Yes');

      cy.get('#case-details').contains('Case details');

      cy.get('#case-details').contains('Case ID');
      cy.get('#case-details').contains('C20220620001');

      cy.get('#case-details').contains('Courthouse');
      cy.get('#case-details').contains('Swansea');

      cy.get('#case-details').contains('Judge(s)');
      cy.get('#case-details').contains('HHJ M. Hussain KC Ray Bob');

      cy.get('#case-details').contains('Defendant(s)');
      cy.get('#case-details').contains('Defendant Dave Defendant Bob');

      cy.a11y();
    });

    it('transcript links to associated group', () => {
      cy.get('#status-details').contains('Associated groups').get('a').contains('Judiciary').click();
      cy.url().should('include', '/admin/groups/1');
    });

    it('transcript links to assigned user', () => {
      cy.get('#status-details').contains('Assigned to').get('a').contains('Fallon Sherrock').click();
      cy.url().should('include', '/admin/users/2');
    });

    it('transcript links to requested user', () => {
      cy.get('#request-details').contains('Requested by').get('a').contains('Eric Bristow').click();
      cy.url().should('include', '/admin/users/1');
    });
  });

  describe('History', () => {
    beforeEach(() => {
      cy.get('button').contains('Search').click();
      cy.get('app-search-transcripts-results').get('a').contains('1').click();
      cy.get('#history-tab').click();
    });

    it('check template', () => {
      cy.get('.moj-timeline__title').should((titles) => {
        expect(titles).to.have.length(3);
        expect(titles[2]).to.contain('Requested');
        expect(titles[1]).to.contain('Awaiting Authorisation');
        expect(titles[0]).to.contain('Comment');
      });
    });

    it('links to user', () => {
      cy.get('.moj-timeline__item').contains('Fallon Sherrock').click();
      cy.url().should('include', '/admin/users/2');
    });
  });

  describe('Change status', () => {
    beforeEach(() => {
      cy.get('button').contains('Search').click();
      cy.get('app-search-transcripts-results').get('a').contains('1').click();
    });

    it('changes status', () => {
      cy.get('a').contains('Change status').click();
      cy.get('#status').select('Approved');
      cy.get('button').contains('Save changes').click();

      cy.get('#status-details').contains('Status');
      cy.get('#status-details').contains('Approved');

      cy.get('app-govuk-banner').contains('Status updated');
    });
  });

  describe('Search completed transcripts', () => {
    it('searches for completed transcripts', () => {
      cy.get('a').contains('Completed transcripts').click();
      cy.get('button').contains('Search').click();
      cy.get('app-search-completed-transcripts-results').contains('C0001');
      cy.get('app-search-completed-transcripts-results').contains('Cardiff');
      cy.get('app-search-completed-transcripts-results').contains('01 Jan 2021');
      cy.get('app-search-completed-transcripts-results').contains('Manual');
    });

    it('redirects to transcript on 1 result', () => {
      cy.get('a').contains('Completed transcripts').click();
      cy.get('#caseId').clear().type('C0001');
      cy.get('button').contains('Search').click();
      cy.url().should('include', '/admin/transcripts/document/0');
    });

    it('view completed transcript / transcript file details, hidden but not marked', () => {
      cy.get('a').contains('Completed transcripts').click();
      cy.get('#caseId').clear().type('C0002');
      cy.get('button').contains('Search').click();

      // transcript-details
      cy.get('#transcript-details').get('app-govuk-heading').contains('Basic details');

      cy.get('#transcript-details dt').eq(0).should('contain', 'ID');
      cy.get('#transcript-details dd').eq(0).should('contain', '1');

      cy.get('#transcript-details dt').eq(1).should('contain', 'Case ID');
      cy.get('#transcript-details dd').eq(1).should('contain', 'C20220620001');

      cy.get('#transcript-details dt').eq(2).should('contain', 'Hearing date');
      cy.get('#transcript-details dd').eq(2).should('contain', '07 Aug 2023');

      cy.get('#transcript-details dt').eq(3).should('contain', 'Courthouse');
      cy.get('#transcript-details dd').eq(3).should('contain', 'Swansea');

      cy.get('#transcript-details dt').eq(4).should('contain', 'Courtroom');
      cy.get('#transcript-details dd').eq(4).should('contain', '3');

      cy.get('#transcript-details dt').eq(5).should('contain', 'Defendant(s)');
      cy.get('#transcript-details dd').eq(5).should('contain', 'Defendant Dave, Defendant Bob');

      cy.get('#transcript-details dt').eq(6).should('contain', 'Judge(s)');
      cy.get('#transcript-details dd').eq(6).should('contain', 'Ray Bob');

      // request-details
      cy.get('#request-details').get('app-govuk-heading').contains('Request details');

      cy.get('#request-details dt').eq(0).should('contain', 'Request type');
      cy.get('#request-details dd').eq(0).should('contain', 'Specified Times');

      cy.get('#request-details dt').eq(1).should('contain', 'Request ID');
      cy.get('#request-details dd').eq(1).should('contain', '789');

      cy.get('#request-details dt').eq(2).should('contain', 'Urgency');
      cy.get('#request-details dd').eq(2).should('contain', 'Standard');

      cy.get('#request-details dt').eq(3).should('contain', 'Requested by');
      cy.get('#request-details dd').eq(3).should('contain', 'Joe Smith');

      cy.get('#request-details dt').eq(4).should('contain', 'Instructions');
      cy.get('#request-details dd').eq(4).should('contain', 'Please expedite my request');

      cy.get('#request-details dt').eq(5).should('contain', 'Judge approval');
      cy.get('#request-details dd').eq(5).should('contain', 'Yes');

      // Advanced details
      cy.get('#advanced-tab').click();

      cy.get('.govuk-heading-m').contains('Advanced details');

      cy.get('#file-details dt').eq(0).should('contain', 'Transcription object ID');
      cy.get('#file-details dd').eq(0).should('contain', '32');

      cy.get('#file-details dt').eq(1).should('contain', 'Content object ID');
      cy.get('#file-details dd').eq(1).should('contain', 'ABC12343211');

      cy.get('#file-details dt').eq(2).should('contain', 'Clip ID');
      cy.get('#file-details dd').eq(2).should('contain', '123112DDE');

      cy.get('#file-details dt').eq(3).should('contain', 'Checksum');
      cy.get('#file-details dd').eq(3).should('contain', '2AGSGAQ27277178AA');

      cy.get('#file-details dt').eq(4).should('contain', 'File size');
      cy.get('#file-details dd').eq(4).should('contain', '3MB');

      cy.get('#file-details dt').eq(5).should('contain', 'File type');
      cy.get('#file-details dd').eq(5).should('contain', 'DOC');

      cy.get('#file-details dt').eq(6).should('contain', 'Filename');
      cy.get('#file-details dd').eq(6).should('contain', 'caseid_courthouse_filename.doc');

      cy.get('#file-details dt').eq(7).should('contain', 'Date uploaded');
      cy.get('#file-details dd').eq(7).should('contain', '18 May 2008 at 4:00PM');

      cy.get('#file-details dt').eq(8).should('contain', 'Uploaded by');
      cy.get('#file-details dd')
        .eq(8)
        .find('a')
        .should('contain', 'Michael van Gerwen')
        .and('have.attr', 'href', '/admin/users/3');

      cy.get('#file-details dt').eq(9).should('contain', 'Date created');
      cy.get('#file-details dd').eq(9).should('contain', '18 May 2008 at 4:00PM');

      cy.get('#file-details dt').eq(10).should('contain', 'Last modified by');
      cy.get('#file-details dd')
        .eq(10)
        .find('a')
        .should('contain', 'Eric Bristow')
        .and('have.attr', 'href', '/admin/users/1');

      cy.get('#file-details dt').eq(11).should('contain', 'Date last modified');
      cy.get('#file-details dd').eq(11).should('contain', '01 Jan 2024 at 1:52PM');

      cy.get('#file-details dt').eq(12).should('contain', 'Date hidden');
      cy.get('#file-details dd').eq(12).should('contain', '01 Jan 2024 at 7:10AM');

      cy.get('#file-details dt').eq(13).should('contain', 'Retain until');
      cy.get('#file-details dd').eq(13).should('contain', '01 Jan 2034 at 9:00AM');

      cy.get('.govuk-button').should('contain', 'Unhide');

      cy.get('.govuk-notification-banner').should('exist');

      cy.get('.govuk-notification-banner__title').should('contain', 'Important');

      cy.get('.govuk-notification-banner__heading').should('contain', 'This file is hidden in DARTS');

      cy.get('.govuk-notification-banner__body').should('contain', 'DARTS users cannot view this file.');

      cy.get('.govuk-notification-banner__body').contains('unhide').should('exist');

      cy.get('.govuk-list').should('contain', 'Hidden by - Eric Bristow');
      cy.get('.govuk-list').should('contain', 'Reason - Public interest immunity');
      cy.get('.govuk-list').should('contain', 'Ticket Reference 1232 - This is a comment');
    });

    it('view completed transcript / transcript file details, hidden and marked for deletion', () => {
      cy.get('a').contains('Completed transcripts').click();
      cy.get('#caseId').clear().type('C0003');
      cy.get('button').contains('Search').click();

      cy.get('.govuk-button').should('contain', 'Unmark for deletion and unhide');

      cy.get('.govuk-notification-banner').should('exist');

      cy.get('.govuk-notification-banner__title').should('contain', 'Important');

      cy.get('.govuk-notification-banner__heading').should(
        'contain',
        'This file is hidden in DARTS and is marked for manual deletion'
      );

      cy.get('.govuk-notification-banner__body').should(
        'contain',
        'DARTS user cannot view this file. You can unmark for deletion and it will no longer be hidden.'
      );

      cy.get('.govuk-notification-banner__body').contains('unmark for deletion').should('exist');

      cy.get('.govuk-list').should('contain', 'Marked for manual deletion by - Eric Bristow');
      cy.get('.govuk-list').should('contain', 'Reason - Public interest immunity');
      cy.get('.govuk-list').should('contain', 'Ticket Reference 1232 - This is a comment');
    });
  });
});
