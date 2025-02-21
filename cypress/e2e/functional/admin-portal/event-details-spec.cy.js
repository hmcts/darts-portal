import 'cypress-axe';
import '../commands';

describe('Admin - Event details', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/events/111');
    cy.injectAxe();
  });

  it('load page', () => {
    cy.get('h1').should('contain', '111');
    cy.a11y();
  });

  it('should verify data in the "Basic Details" tab', () => {
    cy.get('.moj-sub-navigation__link').contains('Basic details').should('have.attr', 'aria-current', 'page');

    cy.get('dl.govuk-summary-list').within(() => {
      cy.get('dt').contains('Name').next('dd').should('contain.text', 'Event map 1');
      cy.get('dt').contains('Text').next('dd').should('contain.text', 'This is an event');
      cy.get('dt').contains('Courthouse').next('dd').should('contain.text', 'Cardiff');
      cy.get('dt').contains('Courtroom').next('dd').should('contain.text', 'Room 1');
      cy.get('dt').contains('Timestamp').next('dd').should('contain.text', '01 Jan 2024 at 04:14:44');
    });
  });

  it('should verify data in the "Advanced Details" tab', () => {
    cy.get('.moj-sub-navigation__link').contains('Advanced details').click();

    cy.get('.moj-sub-navigation__link').contains('Advanced details').should('have.attr', 'aria-current', 'page');

    cy.get('app-advanced-event-details dl.govuk-summary-list')
      .first()
      .within(() => {
        cy.get('dt').contains('Documentum ID').next('dd').should('contain.text', '123456');
        cy.get('dt').contains('Source event ID').next('dd').should('contain.text', 'source123');
        cy.get('dt').contains('Message ID').next('dd').should('contain.text', '654321');
        cy.get('dt').contains('Type').next('dd').should('contain.text', '1000');
        cy.get('dt').contains('Subtype').next('dd').should('contain.text', '1001');
        cy.get('dt').contains('Event Handler').next('dd').should('contain.text', 'StandardEventHandler');
        cy.get('dt').contains('Reporting restriction?').next('dd').should('contain.text', 'No');
        cy.get('dt').contains('Log entry?').next('dd').should('contain.text', 'No');
        cy.get('dt').contains('Is current?').next('dd').should('contain.text', 'Yes');
      });

    cy.get('.versions-heading').within(() => {
      cy.get('h2').should('contain.text', 'Version data');
      cy.get('a').should('contain.text', 'Show versions');
    });

    cy.get('app-advanced-event-details dl.govuk-summary-list')
      .eq(1)
      .within(() => {
        cy.get('dt').contains('Version').next('dd').should('contain.text', 'v1');
        cy.get('dt').contains('Chronicle ID').next('dd').should('contain.text', '123');
        cy.get('dt').contains('Antecedent ID').next('dd').should('contain.text', '456');
        cy.get('dt').contains('Date created').next('dd').should('contain.text', '01 Jan 2024 at 04:14:51');
        cy.get('dt').contains('Created by').next('dd').should('contain.text', 'Eric Bristow');
        cy.get('dt').contains('Date last modified').next('dd').should('contain.text', '01 Jun 2024 at 14:00:00');
        cy.get('dt').contains('Last modified by').next('dd').should('contain.text', 'Fallon Sherrock');
      });
  });

  it('Show all versions', () => {
    cy.get('.moj-sub-navigation__link').contains('Advanced details').click();
    cy.get('.versions-heading a').should('contain.text', 'Show versions').click();

    cy.url().should('include', '/admin/events/111/versions');

    cy.get('.govuk-back-link').should('contain.text', 'Back');

    cy.get('h1.govuk-heading-l').should('contain.text', 'All versions of this event');

    cy.get('h2.govuk-heading-s').should('contain.text', 'Source event ID');
    cy.get('p.govuk-body').should('contain.text', '111');

    cy.get('h2.govuk-heading-m').contains('Current version').should('be.visible');
    cy.get('app-data-table')
      .first()
      .within(() => {
        cy.get('caption').should('contain.text', 'Current version of this event');
        cy.get('thead').within(() => {
          cy.get('th').eq(0).should('contain.text', 'Event ID');
          cy.get('th').eq(1).should('contain.text', 'Timestamp');
          cy.get('th').eq(2).should('contain.text', 'Name');
          cy.get('th').eq(3).should('contain.text', 'Courthouse');
          cy.get('th').eq(4).should('contain.text', 'Courtroom');
          cy.get('th').eq(5).should('contain.text', 'Text');
        });
        cy.get('tbody tr').within(() => {
          cy.get('td').eq(0).should('contain.text', '1001');
          cy.get('td').eq(1).should('contain.text', '17 Feb 2025 at 15:34:55');
          cy.get('td').eq(2).should('contain.text', 'Defendant Appearance');
          cy.get('td').eq(3).should('contain.text', 'Manchester Crown Court');
          cy.get('td').eq(4).should('contain.text', 'Courtroom 3');
          cy.get('td').eq(5).should('contain.text', 'Defendant entered the courtroom and proceedings began.');
        });
      });

    cy.get('h2.govuk-heading-m').contains('Previous versions').should('be.visible');
    cy.get('app-data-table')
      .last()
      .within(() => {
        cy.get('caption').should('contain.text', 'Previous versions of this event');
        cy.get('thead').within(() => {
          cy.get('th').eq(0).should('contain.text', 'Event ID');
          cy.get('th').eq(1).should('contain.text', 'Timestamp');
          cy.get('th').eq(2).should('contain.text', 'Name');
          cy.get('th').eq(3).should('contain.text', 'Courthouse');
          cy.get('th').eq(4).should('contain.text', 'Courtroom');
          cy.get('th').eq(5).should('contain.text', 'Text');
        });

        cy.get('tbody tr')
          .eq(0)
          .within(() => {
            cy.get('td').eq(0).should('contain.text', '1000');
            cy.get('td').eq(1).should('contain.text', '10 Feb 2025 at 10:30:00');
            cy.get('td').eq(2).should('contain.text', 'Judge Seated');
            cy.get('td').eq(3).should('contain.text', 'Manchester Crown Court');
            cy.get('td').eq(4).should('contain.text', 'Courtroom 3');
            cy.get('td').eq(5).should('contain.text', 'Proceedings started at 10:00 AM with the judge presiding.');
          });

        cy.get('tbody tr')
          .eq(1)
          .within(() => {
            cy.get('td').eq(0).should('contain.text', '999');
            cy.get('td').eq(1).should('contain.text', '30 Jan 2025 at 09:00:00');
            cy.get('td').eq(2).should('contain.text', 'Courtroom Prepared');
            cy.get('td').eq(3).should('contain.text', 'Manchester Crown Court');
            cy.get('td').eq(4).should('contain.text', 'Courtroom 3');
            cy.get('td').eq(5).should('contain.text', 'Courtroom preparation completed, awaiting judge arrival.');
          });

        cy.get('tbody tr')
          .eq(2)
          .within(() => {
            cy.get('td').eq(0).should('contain.text', '998');
            cy.get('td').eq(1).should('contain.text', '20 Jan 2025 at 08:00:00');
            cy.get('td').eq(2).should('contain.text', 'Trial Scheduled');
            cy.get('td').eq(3).should('contain.text', 'Manchester Crown Court');
            cy.get('td').eq(4).should('contain.text', 'Courtroom 3');
            cy.get('td').eq(5).should('contain.text', 'Case scheduled for upcoming trial session.');
          });
      });

    cy.get('a.govuk-link').contains('Back to event details').should('be.visible').click();

    cy.url().should('eq', Cypress.config().baseUrl + '/admin/events/111');
  });

  it('obfuscates event text', () => {
    cy.get('#obfuscate-button').click();
    cy.get('h1').should('contain', 'Are you sure you want to obfuscate the event text?');
    cy.a11y();
    cy.get('#confirm-button').click();
    cy.get('#success-message').should('contain', 'Event text successfully obfuscated ');
    cy.get('#warning-message').should('contain', 'This event text has been anonymised in line with HMCTS policy.');
    cy.get('app-basic-event-details').should('contain', 'This event has been anonymised in line with HMCTS policy ');
    cy.a11y();
  });

  after(() => {
    cy.request('/api/admin/events/reset');
  });
});
