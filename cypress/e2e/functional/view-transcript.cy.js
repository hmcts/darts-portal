import 'cypress-axe';
import './commands';

describe('Request Transcript', () => {
  beforeEach(() => {
    cy.login();
    cy.injectAxe();
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('#case_number').type('C20220620001');
    cy.get('button').contains('Search').click();

    cy.get('.govuk-table__row').contains('C20220620001');
  });

  it('should get to view transcripts from the case level', () => {
    cy.get('a').contains('C20220620001').click();
    cy.get('.moj-sub-navigation__link').contains('All Transcripts').click();
    cy.get('.govuk-tag--green').should('contain', 'Complete');
    cy.contains('Complete').parents('tr').contains('View').click();
    cy.contains('Case ID').parents('tr').should('contain', 'C20220620001');
    cy.get('.govuk-body-m').should('contain', 'Section 4(2) of the Contempt of Court Act 1981');
  });

  it('should get to view transcripts from the hearing level', () => {
    cy.get('a').contains('C20220620001').click();
    cy.get('h1').should('contain', 'C20220620001');
    cy.get('#hearingsTable').should('contain', '1 Sep 2023');
    cy.get('#hearingsTable a').contains('1 Sep 2023').click();
    cy.get('.moj-sub-navigation__link').contains('Transcripts').click();
    cy.get('.govuk-caption-l').should('contain', 'Hearing');
    cy.get('.flex-space-between > .govuk-heading-m').should('contain', 'Transcripts for this hearing');
    cy.contains('Complete').parents('tr').should('contain', 'Sentencing remarks');
    cy.get('.govuk-button').should('contain', 'Request a new transcript');
    cy.get('.govuk-tag--green').should('contain', 'Complete');
    cy.contains('Complete').parents('tr').contains('View').click();
    cy.contains('Case ID').parents('tr').should('contain', 'C20220620001');
    cy.get('.govuk-body-m').should('contain', 'Section 4(2) of the Contempt of Court Act 1981');
  });
});
