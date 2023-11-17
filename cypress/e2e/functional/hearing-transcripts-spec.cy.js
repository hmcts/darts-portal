import 'cypress-axe';
import './commands';

describe('Hearing Transcripts', () => {
  beforeEach(() => {
    cy.login();
    cy.injectAxe();
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('#case_number').type('C20220620001');
    cy.get('button').contains('Search').click();

    cy.get('.govuk-table__row').contains('C20220620001');
    cy.get('a').contains('C20220620001').click();
    cy.get('h1').should('contain', 'C20220620001');
  });

  it('has transcripts against a hearing', () => {
    cy.get('#hearingsTable').should('contain', '1 Sep 2023');
    cy.get('#hearingsTable a').contains('1 Sep 2023').click();
    cy.get(':nth-child(2) > .moj-sub-navigation__link').click();
    cy.get('#transcription-count').should('contain', 3);
    cy.get('.govuk-button').should('contain', 'Request a new transcript');
    cy.get('#transcriptsTable').should('contain', 'Sentencing remarks');
    cy.a11y();
  });

  it("doesn't have transcripts against a hearing", () => {
    cy.get('#hearingsTable').contains('11 Oct 2023').click();
    cy.get(':nth-child(2) > .moj-sub-navigation__link').click();
    cy.get('.tab-container > :nth-child(1) > .govuk-body').should(
      'contain',
      'There are no transcripts for this hearing.'
    );
  });
});
