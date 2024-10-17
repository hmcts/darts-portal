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

  it('obfuscates event text', () => {
    cy.get('#obfuscate-button').click();
    cy.get('h1').should('contain', 'Are you sure you want to obfuscate the event text?');
    cy.a11y();
    cy.get('#confirm-button').click();
    cy.get('#success-message').should('contain', 'Event text successfully obfuscated ');
    cy.get('#warning-message').should('contain', 'This event text has been anonymised in line with HMCTS policy.');
    cy.get('app-basic-event-details').should('contain', 'This event has been anonymised in line with HMCTS policy ');
    cy.a11y();

    cy.request('/api/admin/events/reset');
  });
});
