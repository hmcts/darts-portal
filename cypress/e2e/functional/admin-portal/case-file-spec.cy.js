import 'cypress-axe';
import '../commands';

describe('Case file screen', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should go to admin case screen file from case search', () => {
    cy.visit('admin/search');

    cy.get('#confirm-button').click();

    cy.get('td.case_number a.govuk-link').first().click();

    cy.url().should('include', '/admin/case/1');
  });

  it('should show correct case file information', () => {
    cy.visit('admin/case/1');
    cy.injectAxe();

    cy.get('app-govuk-heading').should('contain.text', 'Case').should('contain.text', 'CASE1001');

    cy.get('h2.govuk-heading-m').should('contain.text', 'Case details');

    cy.get('.govuk-summary-list').within(() => {
      cy.get('.govuk-summary-list__row')
        .eq(0)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Case ID');
          cy.get('.govuk-summary-list__value').should('have.text', 'CASE1001');
        });

      cy.get('.govuk-summary-list__row')
        .eq(1)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Courthouse');
          cy.get('.govuk-summary-list__value').should('have.text', 'SWANSEA');
        });

      cy.get('.govuk-summary-list__row')
        .eq(2)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Judge(s)');
          cy.get('.govuk-summary-list__value').should('have.text', 'Mr Judge');
        });

      cy.get('.govuk-summary-list__row')
        .eq(3)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Defendant(s)');
          cy.get('.govuk-summary-list__value').should('have.text', 'Joe Bloggs');
        });

      cy.get('.govuk-summary-list__row')
        .eq(4)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Defence');
          cy.get('.govuk-summary-list__value').should('have.text', 'Mr Defender');
        });

      cy.get('.govuk-summary-list__row')
        .eq(5)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Prosecutor(s)');
          cy.get('.govuk-summary-list__value').should('have.text', 'Mrs Prosecutor');
        });

      cy.get('.govuk-summary-list__row')
        .eq(6)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Retained until');
          cy.get('.govuk-summary-list__value').first().should('have.text', '31 Jan 2030');
        });

      cy.get('.govuk-summary-list__row')
        .eq(6)
        .within(() => {
          cy.get('.govuk-link').should('have.text', 'View or change').should('have.attr', 'href', '/case/1/retention');
        });
    });

    cy.a11y();
  });

  describe('Case file tabs', () => {
    it('should verify additional case details', () => {
      cy.visit('admin/case/1');
      cy.injectAxe();

      cy.get('#additional-tab').click();

      cy.get('h2.govuk-heading-m').should('contain.text', 'Additional case details');

      cy.get('.govuk-summary-list')
        .eq(1)
        .within(() => {
          cy.get('.govuk-summary-list__row')
            .eq(0)
            .within(() => {
              cy.get('.govuk-summary-list__key').should('have.text', 'Database ID');
              cy.get('.govuk-summary-list__value').should('contain.text', '1');
            });

          cy.get('.govuk-summary-list__row')
            .eq(1)
            .within(() => {
              cy.get('.govuk-summary-list__key').should('have.text', 'Case object ID');
              cy.get('.govuk-summary-list__value').should('contain.text', '12345');
            });

          cy.get('.govuk-summary-list__row')
            .eq(2)
            .within(() => {
              cy.get('.govuk-summary-list__key').should('have.text', 'Case status');
              cy.get('.govuk-summary-list__value').should('contain.text', 'OPEN');
            });

          cy.get('.govuk-summary-list__row')
            .eq(3)
            .within(() => {
              cy.get('.govuk-summary-list__key').should('have.text', 'Date created');
              cy.get('.govuk-summary-list__value').should('contain.text', '01/01/2024');
            });

          cy.get('.govuk-summary-list__row')
            .eq(4)
            .within(() => {
              cy.get('.govuk-summary-list__key').should('have.text', 'Created by');
              cy.get('.govuk-summary-list__value').should('contain.text', 'Phil Taylor');
            });

          cy.get('.govuk-summary-list__row')
            .eq(5)
            .within(() => {
              cy.get('.govuk-summary-list__key').should('have.text', 'Date last modified');
              cy.get('.govuk-summary-list__value').should('contain.text', '01/01/2024');
            });

          cy.get('.govuk-summary-list__row')
            .eq(6)
            .within(() => {
              cy.get('.govuk-summary-list__key').should('have.text', 'Last modified by');
              cy.get('.govuk-summary-list__value').should('contain.text', 'Phil Taylor');
            });

          cy.get('.govuk-summary-list__row')
            .eq(7)
            .within(() => {
              cy.get('.govuk-summary-list__key').should('have.text', 'Date case closed');
              cy.get('.govuk-summary-list__value').should('contain.text', '20/07/2023');
            });

          cy.get('.govuk-summary-list__row')
            .eq(8)
            .within(() => {
              cy.get('.govuk-summary-list__key').should('have.text', 'Case deleted?');
              cy.get('.govuk-summary-list__value').should('contain.text', 'No');
            });

          cy.get('.govuk-summary-list__row')
            .eq(9)
            .within(() => {
              cy.get('.govuk-summary-list__key').should('have.text', 'Date deleted');
              cy.get('.govuk-summary-list__value').should('contain.text', '01/01/2024');
            });

          cy.get('.govuk-summary-list__row')
            .eq(10)
            .within(() => {
              cy.get('.govuk-summary-list__key').should('have.text', 'Case anonymised?');
              cy.get('.govuk-summary-list__value').should('contain.text', 'No');
            });

          cy.get('.govuk-summary-list__row')
            .eq(11)
            .within(() => {
              cy.get('.govuk-summary-list__key').should('have.text', 'Date anonymised');
              cy.get('.govuk-summary-list__value').should('contain.text', '01/01/2024');
            });

          cy.get('.govuk-summary-list__row')
            .eq(12)
            .within(() => {
              cy.get('.govuk-summary-list__key').should('have.text', 'Interpreter used?');
              cy.get('.govuk-summary-list__value').should('contain.text', 'No');
            });
        });

      cy.a11y();
    });
  });
});
