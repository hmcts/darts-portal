import 'cypress-axe';
import '../commands';

describe('Admin - Event mappings screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/system-configuration/event-mappings');
    cy.injectAxe();
  });

  it('page elements', () => {
    cy.get('app-govuk-heading h1').contains('System configuration');
    cy.get('app-govuk-heading h2').contains('Event mappings');
    cy.get('.govuk-button--secondary').contains('Add event mapping');

    cy.get('app-data-table').contains('Event map 1');
    cy.get('app-data-table').contains('Mapping entry 3');
    cy.get('app-data-table').contains('Fourth event mapping');
    cy.get('app-data-table').contains('Prosecution opened');

    cy.get('.govuk-link').contains('Change');

    cy.a11y();
  });

  describe('Filter results', () => {
    it('Active only, with restrictions, without restrictions', () => {
      cy.get('#activeEvents').check();
      cy.get('#with-restrictions').check();
      cy.get('#without-restrictions').check();

      cy.get('app-data-table').contains('Event map 1');
      cy.get('app-data-table').contains('Mapping entry 3');
      cy.get('app-data-table').contains('Fourth event mapping');
      cy.get('app-data-table').contains('Prosecution opened');
    });

    it('Active only, without restrictions', () => {
      cy.get('#with-restrictions').uncheck();
      cy.get('app-data-table').contains('Event map 1');
      cy.get('app-data-table').contains('Fourth event mapping');
    });

    it('Active and inactive, with restrictions', () => {
      cy.get('#activeAndInactiveEvents').check();
      cy.get('#with-restrictions').check();
      cy.get('#without-restrictions').check();

      cy.get('app-data-table').contains('Event map 2');
      cy.get('app-data-table').contains('Mapping entry 3');
      cy.get('app-data-table').contains('Prosecution opened');
    });

    it('Active and inactive, with restrictions, without restrictions, event handler set to StandardEventHandler', () => {
      cy.get('#event-search').select('StandardEventHandler');

      cy.get('app-data-table').contains('Event map 1');
      cy.get('app-data-table').contains('Fourth event mapping');
      cy.get('app-data-table').contains('Prosecution opened');
    });

    it('Filter via search text, no results', () => {
      cy.get('#event-search').select('StandardEventHandler');

      cy.get('#search').type('Mapping entry 3');

      cy.get('#no-data-message').contains('No data to display.');
    });

    it('Filter via search text', () => {
      cy.get('#search').type('Prosecution opened');

      cy.get('app-data-table').contains('01 Feb 2024');
      cy.get('app-data-table').contains('Prosecution opened');
      cy.get('app-data-table').contains('StandardEventHandler');
    });
  });
});
