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
      cy.get('h1').contains('Transcript request');

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
      cy.get('#request-details').contains('Start time 13:00:00 - End time 16:00:00');

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
});
