import 'cypress-axe';
import '../commands';

describe('Admin - Manual Deletion - Disabled', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.intercept('GET', 'app/config', {
      body: {
        appInsightsKey: '00000000-0000-0000-0000-000000000000',
        support: {
          name: 'DTS-IT Service Desk',
          emailAddress: 'DTS-ITServiceDesk@justice.gov.uk',
        },
        environment: 'development',
        dynatrace: {
          scriptUrl: null,
        },
        features: {
          manualDeletion: {
            enabled: false,
          },
        },
      },
    }).as('getAppConfig');
    cy.visit('/admin/file-deletion');
    cy.injectAxe();
  });

  it('should redirect to page-not-found when manual deletion is disabled', () => {
    cy.wait('@getAppConfig');
    cy.url().should('include', '/page-not-found');
    cy.get('h1').should('contain', 'Page not found');
  });
});
