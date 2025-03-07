import 'cypress-axe';
import '../commands';

describe('Admin - Hearing file screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/case/2/hearing/2');
  });

  it('should display the hearing heading correctly', () => {
    cy.get('h1.govuk-heading-l').should('contain.text', '23 January 2025');
  });

  it('should verify all hearing details', () => {
    cy.get('.govuk-summary-list').within(() => {
      cy.get('.govuk-summary-list__row')
        .eq(0)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Case ID');
          cy.get('.govuk-summary-list__value a')
            .should('have.attr', 'href', '/admin/case/1?backUrl=%2Fadmin%2Fcase%2F1%2Fhearing%2F1')
            .and('contain.text', 'CASE1');
        });

      cy.get('.govuk-summary-list__row')
        .eq(1)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Courthouse');
          cy.get('.govuk-summary-list__value').should('have.text', 'Courthouse 12');
        });

      cy.get('.govuk-summary-list__row')
        .eq(2)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Courtroom');
          cy.get('.govuk-summary-list__value').should('have.text', 'ROOM CD');
        });

      cy.get('.govuk-summary-list__row')
        .eq(3)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Hearing date');
          cy.get('.govuk-summary-list__value').should('contain.text', '23 Jan 2025');
        });

      cy.get('.govuk-summary-list__row')
        .eq(4)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Defendant(s)');
          cy.get('.govuk-summary-list__value').should('have.text', 'Joe Bloggs');
        });

      cy.get('.govuk-summary-list__row')
        .eq(5)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Defence');
          cy.get('.govuk-summary-list__value').should('have.text', 'Mr Defender');
        });

      cy.get('.govuk-summary-list__row')
        .eq(6)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Prosecutor(s)');
          cy.get('.govuk-summary-list__value').should('have.text', 'Mrs Prosecutor');
        });

      cy.get('.govuk-summary-list__row')
        .eq(7)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Judge(s)');
          cy.get('.govuk-summary-list__value').should('have.text', 'Mr Judge');
        });

      cy.get('.govuk-summary-list__row')
        .eq(8)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Scheduled start time');
          cy.get('.govuk-summary-list__value').should('contain.text', '06 Mar 2025 08:00:00');
        });

      cy.get('.govuk-summary-list__row')
        .eq(9)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Hearing took place');
          cy.get('.govuk-summary-list__value').should('have.text', 'Yes');
        });

      cy.get('.govuk-summary-list__row')
        .eq(10)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Date created');
          cy.get('.govuk-summary-list__value').should('contain.text', '01 Jan 2024 00:00:00');
        });

      cy.get('.govuk-summary-list__row')
        .eq(11)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Created by');
          cy.get('.govuk-summary-list__value').should('contain.text', 'Michael van Gerwen');
        });

      cy.get('.govuk-summary-list__row')
        .eq(12)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Date last modified');
          cy.get('.govuk-summary-list__value').should('contain.text', '01 Jan 2024 00:00:00');
        });

      cy.get('.govuk-summary-list__row')
        .eq(13)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Last modified by');
          cy.get('.govuk-summary-list__value').should('contain.text', 'Fallon Sherrock');
        });
    });
  });

  it('should navigate to the correct case page when clicking Case ID', () => {
    cy.get('.govuk-summary-list__row')
      .eq(0)
      .within(() => {
        cy.get('.govuk-summary-list__value a')
          .should('have.attr', 'href', '/admin/case/1?backUrl=%2Fadmin%2Fcase%2F1%2Fhearing%2F1')
          .click();
      });

    cy.url().should('include', '/admin/case/1');
  });
});
