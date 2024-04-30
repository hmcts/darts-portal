import 'cypress-axe';
import '../commands';

describe('Admin - Automated tasks screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/system-configuration/automated-tasks');
    cy.injectAxe();
  });

  it('page elements', () => {
    cy.get('app-govuk-heading h1').contains('System configuration');
    cy.get('app-govuk-heading h2').contains('Automated tasks');

    cy.get('app-data-table').contains('Task 1');
    cy.get('app-data-table').contains('Task 2');
    cy.get('app-data-table').contains('Task 3');

    cy.get('app-data-table').contains('Simulate 202 success');
    cy.get('app-data-table').contains('Simulate 404 not found');
    cy.get('app-data-table').contains('Simulate 409 already running task');

    cy.get('app-data-table').contains('0 0 1 * * *');
    cy.get('app-data-table').contains('0 0 2 * * *');
    cy.get('app-data-table').contains('0 0 3 * * *');

    cy.get('app-data-table').contains('Active');
    cy.get('app-data-table').contains('Inactive');

    cy.a11y();
  });

  describe('Run task', () => {
    it('Success', () => {
      cy.get('app-data-table').contains('Task 1').parents('tr').contains('Run task').click();
      cy.get('app-govuk-banner').contains('Task start request sent');
      cy.a11y();
    });

    it('Not found', () => {
      cy.get('app-data-table').contains('Task 2').parents('tr').contains('Run task').click();
      cy.get('app-govuk-banner').contains('Task not found');
    });

    it('Already running', () => {
      cy.get('app-data-table').contains('Task 3').parents('tr').contains('Run task').click();
      cy.get('app-govuk-banner').contains('Task is already running');
    });
  });
});
