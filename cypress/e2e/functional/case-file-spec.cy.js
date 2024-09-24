import 'cypress-axe';
import './commands';

describe('Case file screen', () => {
  describe('error scenarios', () => {
    beforeEach(() => {
      cy.login();
    });

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

  describe('expired cases', () => {
    beforeEach(() => {
      cy.login();
    });

    it('should show limited information for an expired case', () => {
      cy.visit('/case/10');
      cy.injectAxe();
      cy.get('h1').should('contain', 'C20220622031');

      cy.get('.govuk-body').should('contain', 'Swansea');
      cy.get('.govuk-body').should('contain', '10 Aug 2023');

      //Should not contain

      cy.get('a.govuk-link').should('not.exist'); //View or change
      cy.get('a.moj-sub-navigation__link').should('not.exist'); //Tabs

      cy.get('#warning-message').should(
        'contain',
        'This case has passed its retention date on 10 Aug 2023. Data was deleted in line with HMCTS policy.'
      );

      cy.a11y();
    });

    it('should route to expired case page for expired case links', () => {
      cy.visit('/case/10/transcripts/1');
      cy.get('.govuk-heading-xl').contains('The page you are looking for no longer exists');
      cy.get('.govuk-body').contains('The case has passed its retention date and expired.');
      cy.get('.govuk-link').contains('Go back');

      cy.visit('/case/10/retention');
      cy.get('.govuk-heading-xl').contains('The page you are looking for no longer exists');
      cy.get('.govuk-body').contains('The case has passed its retention date and expired.');
      cy.get('.govuk-link').contains('Go back');

      cy.visit('/case/10/hearing/1');
      cy.get('.govuk-heading-xl').contains('The page you are looking for no longer exists');
      cy.get('.govuk-body').contains('The case has passed its retention date and expired.');
      cy.get('.govuk-link').contains('Go back');

      cy.visit('/case/10/hearing/1/request-transcript');
      cy.get('.govuk-heading-xl').contains('The page you are looking for no longer exists');
      cy.get('.govuk-body').contains('The case has passed its retention date and expired.');
      cy.get('.govuk-link').contains('Go back');

      cy.visit('/case/10/hearing/1/transcript/1');
      cy.get('.govuk-heading-xl').contains('The page you are looking for no longer exists');
      cy.get('.govuk-body').contains('The case has passed its retention date and expired.');
      cy.get('.govuk-link').contains('Go back');

      cy.visit('/case/10/hearing/1/add-annotation');
      cy.get('.govuk-heading-xl').contains('The page you are looking for no longer exists');
      cy.get('.govuk-body').contains('The case has passed its retention date and expired.');
      cy.get('.govuk-link').contains('Go back');
    });
  });

  describe('valid cases', () => {
    beforeEach(() => {
      cy.login();
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

    describe('Court log tab', () => {
      it('Tab exists', () => {
        cy.get('a.moj-sub-navigation__link').eq(1).should('contain', 'Court log');
      });

      it('Displays table of court log', () => {
        cy.injectAxe();
        cy.contains('Court log').click();
        cy.get('#court-log-table')
          .find('.govuk-table__row')
          .then((rows) => {
            expect(rows.length).equal(4);
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
    describe('valid role', () => {
      beforeEach(() => {
        cy.login();
      });

      it('should show retain until for valid role', () => {
        //Defaults to valid role
        cy.contains('Search').click();
        cy.get('#case_number').type('C20220620001');
        cy.get('button').contains('Search').click();
        cy.contains('C20220620001').click();

        cy.get('h2.govuk-heading-s').should('contain', 'Retained until');
        cy.get('p.govuk-body').should('contain', '15 Sep 2030');
        cy.get('a.govuk-link').should('contain', 'View or change');
      });

      it('should show no date applied for valid role', () => {
        //Defaults to valid role
        cy.contains('Search').click();
        cy.get('#case_number').type('C20220620002');
        cy.get('button').contains('Search').click();
        cy.contains('C20220620002').click();

        cy.get('h2.govuk-heading-s').should('contain', 'Retained until');
        cy.get('p.govuk-body').should('contain', 'No date applied');
        cy.get('a.govuk-link').should('contain', 'View or change');
      });
    });

    describe('invalid role', () => {
      beforeEach(() => {
        cy.login('transcriber');
      });

      it('should hide retain until for invalid role', () => {
        cy.contains('Search').click();
        cy.get('#case_number').type('C20220620002');
        cy.get('button').contains('Search').click();
        cy.contains('C20220620002').click();

        cy.contains('Retained until').should('not.exist');
        cy.contains('View or change').should('not.exist');
      });
    });
  });
});
