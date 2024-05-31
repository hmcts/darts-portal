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
      cy.get('#withRestrictions').check();
      cy.get('#withoutRestrictions').check();

      cy.get('app-data-table').contains('Event map 1');
      cy.get('app-data-table').contains('Mapping entry 3');
      cy.get('app-data-table').contains('Fourth event mapping');
      cy.get('app-data-table').contains('Prosecution opened');
    });

    it('Active only, without restrictions', () => {
      cy.get('#withRestrictions').uncheck();
      cy.get('app-data-table').contains('Event map 1');
      cy.get('app-data-table').contains('Fourth event mapping');
    });

    it('Active and inactive, with restrictions', () => {
      cy.get('#activeAndInactiveEvents').check();
      cy.get('#withRestrictions').check();
      cy.get('#withoutRestrictions').check();

      cy.get('app-data-table').contains('Event map 2');
      cy.get('app-data-table').contains('Mapping entry 3');
      cy.get('app-data-table').contains('Prosecution opened');
    });

    it('Active and inactive, with restrictions, without restrictions, event handler set to StandardEventHandler', () => {
      cy.get('#eventSearch').select('StandardEventHandler');

      cy.get('app-data-table').contains('Event map 1');
      cy.get('app-data-table').contains('Fourth event mapping');
      cy.get('app-data-table').contains('Prosecution opened');
    });

    it('Filter via search text, no results', () => {
      cy.get('#eventSearch').select('StandardEventHandler');

      cy.get('#search').type('Mapping entry 3');

      cy.get('#no-data-message').contains('There are no matching results.');
    });

    it('Filter via search text', () => {
      cy.get('#search').type('Prosecution opened');

      cy.get('app-data-table').contains('01 Feb 2024');
      cy.get('app-data-table').contains('Prosecution opened');
      cy.get('app-data-table').contains('StandardEventHandler');
    });
  });

  describe('Add event mapping', () => {
    beforeEach(() => {
      cy.contains('Add event mapping').click();
    });

    it('should display validation errors for required fields', () => {
      cy.get('#confirmButton').click();

      cy.get('#type')
        .parent()
        .within(() => {
          cy.get('.govuk-error-message').should('contain', 'Enter the event type');
        });

      cy.get('#eventName')
        .parent()
        .within(() => {
          cy.get('.govuk-error-message').should('contain', 'Enter the event name');
        });

      cy.get('#eventHandlerSelect')
        .parent()
        .within(() => {
          cy.get('.govuk-error-message').should('contain', 'Select an event handler to map to');
        });

      cy.a11y();
    });

    it('should submit the form with valid data', () => {
      cy.get('#type').type('Test Type');
      cy.get('#subType').type('Test SubType');
      cy.get('#eventName').type('Test Event Name');
      cy.get('#eventHandlerSelect').select('StandardEventHandler');
      cy.get('#withRestrictions').check();

      cy.get('#confirmButton').click();

      cy.contains('Event mapping added').should('be.visible');
    });

    it('should not submit the form with invalid data', () => {
      cy.get('#type').type('Invalid Type');
      cy.get('#eventName').clear();

      cy.get('#confirmButton').click();

      cy.contains('Enter the event name').should('be.visible');
      cy.contains('Select an event handler to map to').should('be.visible');
    });

    it('should not submit without unique combination of type and subtype', () => {
      cy.get('#type').type('1000');
      cy.get('#subType').type('1001');
      cy.get('#eventName').type('Test Event Name');
      cy.get('#eventHandlerSelect').select('StandardEventHandler');
      cy.get('#withRestrictions').check();

      cy.get('#confirmButton').click();

      cy.contains('The combination of event type and subtype should be unique').should('be.visible');

      cy.get('#subType').clear();
      cy.get('#subType').type('1002');

      cy.get('#confirmButton').click();

      cy.contains('Event mapping added').should('be.visible');
    });

    it('should cancel the form and navigate back', () => {
      cy.contains('Cancel').click();
      cy.contains('System configuration').should('exist');
    });
  });

  describe('Change event mapping', () => {
    beforeEach(() => {
      cy.contains('tr', '1010').find('a.govuk-link').contains('Change').click();
    });

    it('should display current data', () => {
      cy.get('#read-only-type').contains('1010');
      cy.get('#read-only-subtype').contains('1011');
      cy.get('#eventName').should('have.value', 'Mapping entry 3');
      cy.get('#eventHandlerSelect').contains('TranscriptionRequestHandler');
      cy.get('#read-only-reporting-restriction').contains('Yes');
      cy.get('#read-only-created').contains('02 Apr 2024');
    });

    it('should display validation errors for required fields', () => {
      cy.get('#eventName').clear();
      cy.get('#confirmButton').click();

      cy.get('#eventName')
        .parent()
        .within(() => {
          cy.get('.govuk-error-message').should('contain', 'Enter the event name');
        });

      cy.a11y();
    });

    it('should submit the form with valid data and data should persist', () => {
      cy.get('#eventName').clear().type('Changed name test');
      cy.get('#eventHandlerSelect').select('StandardEventHandler');

      cy.get('#confirmButton').click();

      cy.contains('Saved new version of event mapping').should('be.visible');

      cy.contains('tr', '1010').find('td').contains('Changed name test');
      cy.contains('tr', '1010').find('td').contains('StandardEventHandler');
    });

    it('should cancel the form and navigate back', () => {
      cy.contains('Cancel').click();
      cy.contains('System configuration').should('exist');
    });

    it('should delete event mapping', () => {
      cy.get('.delete-link').contains('Delete event mapping');

      //TBD
    });
  });
});
