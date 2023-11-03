import './commands';

describe('Case file screen', () => {
  beforeEach(() => {
    cy.login();
  });

  describe('error scenarios', () => {
    it('shows the correct error pages', () => {
      cy.visit('/case/400');
      cy.get('h1').should('contain', 'There is a problem with the service');

      cy.visit('/case/403');
      cy.get('h1').should('contain', 'You do not have permission to access this page');

      cy.visit('/case/404');
      cy.get('h1').should('contain', 'Page not found');
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
        cy.get('#hearingsTable')
          .find('.govuk-table__row')
          .then((rows) => {
            expect(rows.length).equal(7);
          });
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
        cy.contains('All Transcripts').click();
        cy.get('#transcriptsTable')
          .find('tr')
          .then((rows) => {
            expect(rows.length).equal(8); // 8 including header row
          });
      });
    });
  });
});
