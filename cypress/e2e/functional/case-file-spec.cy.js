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

    describe('Reporting restrictions', () => {
      it('Displays restrictions', () => {
        cy.contains('Show restrictions').click();
        cy.get('.govuk-details__text').contains(
          'Restriction applied: Section 4(2) of the Contempt of Court Act 1981 - Applied 01 Sep 2023'
        );
        cy.get('.govuk-details__text').contains('Restrictions lifted: 01 Sep 2023');
      });
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
        cy.get('a.moj-sub-navigation__link').should('contain', 'All Transcripts');
      });

      it('Transcript count', () => {
        cy.get('#transcripts-tab .count').should('contain', '7');
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

    describe('Annotations Tab', () => {
      it('Tab exists', () => {
        cy.get('a.moj-sub-navigation__link').last().should('contain', 'All annotations');
      });

      it('Annotations count', () => {
        cy.get('#annotations-tab .count').should('contain', '2');
      });

      it('Displays table of annotations', () => {
        cy.injectAxe();
        cy.contains('All annotations').click();
        cy.get('#annotationsTable')
          .find('tr')
          .then((rows) => {
            expect(rows.length).equal(3); // 3 including header row
          });

        cy.a11y();
      });
    });
  });

  describe('retention date', () => {
    it('should show retain until for valid role', () => {
      //Defaults to valid role
      cy.contains('Search').click();
      cy.get('#case_number').type('C20220620001');
      cy.get('button').contains('Search').click();
      cy.contains('C20220620001').click();

      cy.get('h3.govuk-heading-s').should('contain', 'Retained until');
      cy.get('p.govuk-body').should('contain', '15 Sep 2030');
      cy.get('a.govuk-link').should('contain', 'View or change');
    });

    it('should show no date applied for valid role', () => {
      //Defaults to valid role
      cy.contains('Search').click();
      cy.get('#case_number').type('C20220620002');
      cy.get('button').contains('Search').click();
      cy.contains('C20220620002').click();

      cy.get('h3.govuk-heading-s').should('contain', 'Retained until');
      cy.get('p.govuk-body').should('contain', 'No date applied');
      cy.get('a.govuk-link').should('contain', 'View or change');
    });

    it('should hide retain until for invalid role', () => {
      cy.logout();
      cy.login('transcriber');
      cy.contains('Search').click();
      cy.get('#case_number').type('C20220620002');
      cy.get('button').contains('Search').click();
      cy.contains('C20220620002').click();

      cy.contains('Retained until').should('not.exist');
      cy.contains('View or change').should('not.exist');
    });
  });
});
