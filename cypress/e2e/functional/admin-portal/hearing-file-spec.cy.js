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
          cy.get('.govuk-summary-list__value').should('contain.text', '08:00:00');
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

  it('should display correct data in the Audio tab', () => {
    cy.contains('#audio-tab', 'Audio').click();

    cy.get('table.govuk-table thead tr').within(() => {
      cy.get('th').eq(0).should('contain.text', 'Audio ID');
      cy.get('th').eq(1).should('contain.text', 'Filename');
      cy.get('th').eq(2).should('contain.text', 'Start time');
      cy.get('th').eq(3).should('contain.text', 'End time');
      cy.get('th').eq(4).should('contain.text', 'Channel number');
    });

    cy.get('table.govuk-table tbody tr')
      .eq(0)
      .within(() => {
        cy.get('td')
          .eq(0)
          .find('a')
          .should('have.attr', 'href', '/admin/audio-file/1?backUrl=%2Fadmin%2Fcase%2F2%2Fhearing%2F2')
          .and('contain.text', '1');
        cy.get('td').eq(1).should('contain.text', 'Test recording.mp3');
        cy.get('td').eq(2).should('contain.text', '8:55 AM');
        cy.get('td').eq(3).should('contain.text', '12:11 PM');
        cy.get('td').eq(4).should('contain.text', '1');
      });

    cy.get('table.govuk-table tbody tr')
      .eq(1)
      .within(() => {
        cy.get('td')
          .eq(0)
          .find('a')
          .should('have.attr', 'href', '/admin/audio-file/2?backUrl=%2Fadmin%2Fcase%2F2%2Fhearing%2F2')
          .and('contain.text', '2');
        cy.get('td').eq(1).should('contain.text', 'Test recording 1.mp3');
        cy.get('td').eq(2).should('contain.text', '2:12 PM');
        cy.get('td').eq(3).should('contain.text', '8:33 PM');
        cy.get('td').eq(4).should('contain.text', '2');
      });
  });

  it('should display correct data in the Events tab', () => {
    cy.contains('#events-tab', 'Events').click();

    cy.get('table.govuk-table thead tr').within(() => {
      cy.get('th').eq(0).should('contain.text', 'Event ID');
      cy.get('th').eq(1).should('contain.text', 'Time stamp');
      cy.get('th').eq(2).should('contain.text', 'Name');
    });

    cy.get('table.govuk-table tbody tr')
      .eq(0)
      .within(() => {
        cy.get('td')
          .eq(0)
          .find('a')
          .should('have.attr', 'href', '/admin/events/4?backUrl=%2Fadmin%2Fcase%2F2%2Fhearing%2F2')
          .and('contain.text', '4');
        cy.get('td').eq(1).should('contain.text', '31 Jul 2023 at 15:32:24');
        cy.get('td').eq(2).should('contain.text', 'Case called on');
      });
  });

  it('should display correct data in the Transcripts tab', () => {
    cy.contains('#transcripts-tab', 'Transcripts').click();

    cy.get('table.govuk-table thead tr').within(() => {
      cy.get('th').eq(0).should('contain.text', 'Request ID');
      cy.get('th').eq(1).should('contain.text', 'Type');
      cy.get('th').eq(2).should('contain.text', 'Requested by');
      cy.get('th').eq(3).should('contain.text', 'Requested on');
      cy.get('th').eq(4).should('contain.text', 'Status');
    });

    cy.get('table.govuk-table tbody tr')
      .eq(0)
      .within(() => {
        cy.get('td')
          .eq(0)
          .find('a')
          .should('have.attr', 'href', '/admin/transcripts/1?backUrl=%2Fadmin%2Fcase%2F2%2Fhearing%2F2')
          .and('contain.text', '1');
        cy.get('td').eq(1).should('contain.text', 'Sentencing remarks');
        cy.get('td').eq(2).should('contain.text', 'Joe Bloggs');
        cy.get('td').eq(3).should('contain.text', '12 Oct 2023');
        cy.get('td').eq(4).should('contain.text', 'Requested');
      });

    cy.get('table.govuk-table tbody tr')
      .eq(2)
      .within(() => {
        cy.get('td').eq(4).should('contain.text', 'Complete');
      });
  });
});
