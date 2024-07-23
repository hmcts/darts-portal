import 'cypress-axe';
import './commands';

describe('Hearing Screen', () => {
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
    cy.get('#hearing-transcripts-tab .count').should('contain', 3);
    cy.get('.govuk-button').should('contain', 'Request a new transcript');
    cy.get('#transcriptsTable').should('contain', 'Sentencing remarks');
    cy.a11y();
  });

  it("doesn't have transcripts against a hearing", () => {
    cy.get('#hearingsTable').contains('11 Oct 2023').click();
    cy.get(':nth-child(2) > .moj-sub-navigation__link').click();
    cy.get('#no-data-message').should('contain', 'There are no transcripts for this hearing.');
  });

  describe('Reporting restrictions', () => {
    it('Displays hearing specific restrictions', () => {
      cy.get('#hearingsTable a').contains('1 Sep 2023').click();

      cy.get('.govuk-notification-banner__heading').contains('There are restrictions against this hearing');

      cy.contains('Show restrictions').click();

      cy.get('.govuk-details__text').contains('Restriction applied: Section 4(2) of the Contempt of Court Act 1981');
      cy.get('.govuk-details__text').contains('Restriction applied: Section 39, Children and Young People Act 1933');
      cy.get('.govuk-details__text').contains('Restrictions lifted');

      // Go back to case file
      cy.get('.govuk-breadcrumbs__link').contains('C20220620001').click();

      cy.get('#hearingsTable a').contains('10 Oct 2023').click();

      cy.contains('Show restrictions').click();

      cy.get('.govuk-details__text').contains('Restriction applied: Section 40, Children and Young People Act 1933');
      cy.get('.govuk-details__text').contains('For full details, check the hearing events.');
    });

    it('Restrictions against case but not current hearing', () => {
      cy.get('#hearingsTable a').contains('5 Jan 2024').click();
      cy.get('.govuk-notification-banner__heading').contains('There are restrictions against this case');
    });
  });
});
