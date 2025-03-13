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
          cy.get('.govuk-summary-list__value').first().should('contain.text', '31 Jan 2020');
        });

      cy.get('.govuk-summary-list__row')
        .eq(6)
        .within(() => {
          cy.get('.govuk-link').should('have.text', 'View or change').should('have.attr', 'href', '/case/1/retention');
        });
    });

    cy.a11y();
  });

  describe('Additional case details tab', () => {
    it('should verify additional case details', () => {
      cy.visit('admin/case/1');
      cy.injectAxe();

      cy.get('#additional-tab').click();

      cy.get('h2.govuk-heading-m').should('contain.text', 'Additional case details');

      cy.get('.govuk-summary-list')
        .eq(1)
        .within(() => {
          const expectedData = [
            ['Database ID', '1'],
            ['Case object ID', '12345'],
            ['Case object name', 'NAME'],
            ['Case type', 'Type A'],
            ['Upload priority', '0'],
            ['Case closed?', 'No'],
            ['Date case closed', '20/07/2023'],
            ['Interpreter used?', 'No'],
            ['Retention updated?', 'Yes'],
            ['Retention retries?', '0'],
            ['Case anonymised?', 'No'],
            ['Case anonymised by', '-'],
            ['Date anonymised', '01/01/2024'],
            ['Retention confidence score', '123'],
            ['Retention confidence reason', 'Some reason'],
            ['Retention confidence date updated', '01/01/2024'],
            ['Case deleted?', 'No'],
            ['Case deleted by', '-'],
            ['Date deleted', '01/01/2024'],
            ['Date created', '01/01/2024'],
            ['Created by', 'Michael van Gerwen'],
            ['Date last modified', '01/01/2024'],
            ['Last modified by', 'Fallon Sherrock'],
          ];

          expectedData.forEach(([key, value], index) => {
            cy.get('.govuk-summary-list__row')
              .eq(index)
              .within(() => {
                cy.get('.govuk-summary-list__key').should('have.text', key);
                cy.get('.govuk-summary-list__value').should('contain.text', value);
              });
          });
        });

      cy.a11y();
    });
  });

  describe('Hearing details tab', () => {
    it('should show correct case hearing information', () => {
      cy.visit('admin/case/1');

      cy.get('app-govuk-heading').should('contain.text', 'Case').should('contain.text', 'CASE1001');

      cy.get('#hearingsTable thead tr').within(() => {
        cy.get('th').eq(0).should('contain.text', 'Hearing date');
        cy.get('th').eq(1).should('contain.text', 'Judge');
        cy.get('th').eq(2).should('contain.text', 'Courtroom');
        cy.get('th').eq(3).should('contain.text', 'No. of transcripts');
      });

      cy.get('#hearingsTable tbody tr')
        .eq(0)
        .within(() => {
          cy.get('td').eq(0).should('contain.text', '01 Sep 2023');
          cy.get('td').eq(1).should('contain.text', 'HHJ M. Hussain KC');
          cy.get('td').eq(2).should('contain.text', '3');
          cy.get('td').eq(3).should('contain.text', '1');
        });

      cy.get('#hearingsTable tbody tr')
        .eq(1)
        .within(() => {
          cy.get('td').eq(0).should('contain.text', '10 Oct 2023');
          cy.get('td').eq(1).should('contain.text', 'Judge Jonny');
          cy.get('td').eq(2).should('contain.text', '4');
          cy.get('td').eq(3).should('contain.text', '2');
        });

      cy.get('#hearingsTable tbody tr')
        .eq(0)
        .within(() => {
          cy.get('td')
            .eq(0)
            .find('a')
            .should('have.attr', 'href', '/admin/case/1/hearing/1?backUrl=%2Fadmin%2Fcase%2F1')
            .click();
        });

      // TO DO: Uncomment once admin hearing file is in
      // cy.url().should('include', '/admin/case/1/hearing/1');
    });
  });
});
