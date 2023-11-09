import 'cypress-axe';
import './commands';

describe('Case file screen', () => {
  beforeEach(() => {
    cy.login();
  });

  describe('error scenarios', () => {
    it('shows the 400 error page', () => {
      cy.visit('/case/400');
      cy.injectAxe();
      cy.get('h1').should('contain', 'There is a problem with the service');

      cy.a11y();
    });

    it('shows the 403 error page', () => {
      cy.visit('/case/403');
      cy.injectAxe();
      cy.get('h1').should('contain', 'You do not have permission to access this page');

      cy.a11y();
    });

    it('shows the 404 error page', () => {
      cy.visit('/case/404');
      cy.injectAxe();
      cy.get('h1').should('contain', 'Page not found');

      cy.a11y();
    });
  });

  describe('valid cases', () => {
    beforeEach(() => {
      cy.contains('Search').click();
      cy.get('#case_number').type('C20220620001');
      cy.get('button').contains('Search').click();
      cy.contains('C20220620001').click();
    });

    describe('Hearings Tab', () => {
      it('Tab exists', () => {
        cy.get('a.moj-sub-navigation__link').first().should('contain', 'Hearings');
      });

      it('Displays table of hearings', () => {
        cy.injectAxe();
        cy.get('#hearingsTable')
          .find('.govuk-table__row')
          .then((rows) => {
            expect(rows.length).equal(7);
          });

        cy.a11y();
      });
    });

    describe('Transcripts Tab', () => {
      it('Tab exists', () => {
        cy.get('a.moj-sub-navigation__link').last().should('contain', 'All Transcripts');
      });

      it('Transcript count', () => {
        cy.get('#transcription-count').should('contain', '7');
      });

      it('Displays table of transcripts', () => {
        cy.injectAxe();
        cy.contains('All Transcripts').click();
        cy.get('#transcriptsTable')
          .find('tr')
          .then((rows) => {
            expect(rows.length).equal(8); // 8 including header row
          });

        cy.a11y();
      });
    });
  });
});
