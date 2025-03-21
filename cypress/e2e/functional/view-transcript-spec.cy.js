import 'cypress-axe';
import './commands';
const path = require('path');
const downloadsFolder = Cypress.config('downloadsFolder');

describe('View Transcript', () => {
  beforeEach(() => {
    cy.login('requester-approver');
    cy.injectAxe();
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('#case_number').type('C20220620001');
    cy.get('button').contains('Search').click();

    cy.get('.govuk-table__row').contains('C20220620001');
  });

  it('should get to view transcripts from the case level', () => {
    cy.get('a').contains('C20220620001').click();
    cy.get('#transcripts-tab').contains('All Transcripts').click();
    cy.get('.govuk-tag--green').should('contain', 'Complete');
    cy.contains('Complete').parents('tr').contains('View').click();
    cy.contains('Case ID').parents('.govuk-summary-list__row').should('contain', 'C20220620001');
    cy.get('.govuk-details__summary-text').click();
    cy.get('.restriction').should('contain', 'Section 4(2) of the Contempt of Court Act 1981');
  });

  it('should get to view transcripts from the hearing level', () => {
    cy.get('a').contains('C20220620001').click();
    cy.get('h1').should('contain', 'C20220620001');
    cy.get('#hearingsTable').should('contain', '1 Sep 2023');
    cy.get('#hearingsTable a').contains('1 Sep 2023').click();
    cy.get('#hearing-transcripts-tab').contains('Transcripts').click();
    cy.get('.govuk-caption-l').should('contain', 'Hearing');
    cy.get('.flex-space-between > .govuk-heading-m').should('contain', 'Transcripts for this hearing');
    cy.contains('Complete').parents('tr').should('contain', 'Sentencing remarks');
    cy.get('.govuk-button').should('contain', 'Request a new transcript');
    cy.get('.govuk-tag--green').should('contain', 'Complete');
    cy.get('table tr:eq(2) a:contains("View")').click();
    cy.get('h1').should('contain', 'C20220620001_0.docx');
    cy.contains('Case ID').parents('.govuk-summary-list__row').should('contain', 'C20220620001');
    cy.get('.restriction').should('contain', 'Section 4(2) of the Contempt of Court Act 1981');
    cy.a11y();
  });

  it('should show default filename when it does not exist on view transcripts', () => {
    cy.get('a').contains('C20220620001').click();
    cy.get('h1').should('contain', 'C20220620001');
    cy.get('#hearingsTable').should('contain', '1 Sep 2023');
    cy.get('#hearingsTable a').contains('1 Sep 2023').click();
    cy.get('.govuk-caption-l').should('contain', 'Hearing');
    cy.get('#hearing-transcripts-tab').contains('Transcripts').click();
    cy.get('.flex-space-between > .govuk-heading-m').should('contain', 'Transcripts for this hearing');
    cy.contains('Complete').parents('tr').should('contain', 'Sentencing remarks');
    cy.get('.govuk-button').should('contain', 'Request a new transcript');
    cy.get('.govuk-tag--green').should('contain', 'Complete');
    cy.contains('21 Oct 2023').parents('tr').contains('View').click();
    cy.get('h1').should('contain', 'No transcription document has been uploaded for this request');
    cy.get('.restriction').should('contain', 'Section 4(2) of the Contempt of Court Act 1981');
  });

  it('should get to a completed transcript from Your transcripts', () => {
    cy.get('.moj-primary-navigation__link').contains('Your transcripts').click();
    cy.contains('FGH12345').parents('tr').contains('View').click();
    cy.get('.govuk-tag').should('contain', 'Complete');
  });

  it('should get to a rejected transcript from Your transcripts', () => {
    cy.get('.moj-primary-navigation__link').contains('Your transcripts').click();
    cy.contains('REJ12345').parents('tr').contains('View').click();
    cy.get('.govuk-tag').should('contain', 'Rejected');
    cy.get('.govuk-heading-m').should('contain', 'Your request was rejected');
    cy.get('p.govuk-body').should(
      'contain',
      '"This request will take longer to transcribe within the urgency level you require."'
    );
  });

  it('download a transcript', () => {
    cy.get('.moj-primary-navigation__link').contains('Your transcripts').click();
    cy.contains('FGH12345').parents('tr').contains('View').click();
    cy.get('#download-button').click();
    cy.readFile(path.join(downloadsFolder, 'C20220620001_0.docx')).should('exist');
  });
});
