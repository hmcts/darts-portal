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
      cy.get('app-automated-task-status').contains('Task start request sent: Task 1');
      cy.a11y();
    });

    it('Not found', () => {
      cy.get('app-data-table').contains('Task 2').parents('tr').contains('Run task').click();
      cy.get('app-automated-task-status').contains('Task not found: Task 2');
    });

    it('Already running', () => {
      cy.get('app-data-table').contains('Task 3').parents('tr').contains('Run task').click();
      cy.get('app-automated-task-status').contains('Task is already running: Task 3');
    });
  });

  describe('View task', () => {
    beforeEach(() => {
      cy.get('app-data-table').contains('Task 1').parents('tr').get('a').contains('1').click();
    });
    it('page elements', () => {
      cy.get('app-govuk-heading h1').contains('Task 1');
      cy.get('app-govuk-heading .caption').contains('Automated task');
      cy.get('.govuk-tag').contains('Active');

      cy.get('app-details-table dt').contains('ID');
      cy.get('app-details-table dd').contains('1');

      cy.get('app-details-table dt').contains('Name');
      cy.get('app-details-table dd').contains('Task 1');

      cy.get('app-details-table dt').contains('Description');
      cy.get('app-details-table dd').contains('Simulate 202 success');

      cy.get('app-details-table dt').contains('Cron expression');
      cy.get('app-details-table dd').contains('0 0 1 * * *');

      cy.get('app-details-table dt').contains('Cron editable');
      cy.get('app-details-table dd').contains('Yes');

      cy.get('app-details-table dt').contains('Date created');
      cy.get('app-details-table dd').contains('Mon 1 Jan 2024 at 00:00:00');

      cy.get('app-details-table dt').contains('Created by');
      cy.get('app-details-table dd').contains('Eric Bristow');

      cy.get('app-details-table dt').contains('Date modified');
      cy.get('app-details-table dd').contains('Mon 1 Jan 2024 at 00:00:00');

      cy.get('app-details-table dt').contains('Modified by');
      cy.get('app-details-table dd').contains('Fallon Sherrock');

      cy.a11y();
    });

    it('runs task', () => {
      cy.get('.govuk-button').contains('Run task').click();
      cy.get('app-automated-task-status').contains('Task start request sent: Task 1');
    });

    it('deactivates task', () => {
      cy.get('.govuk-button').contains('Make inactive').click();
      cy.get('app-automated-task-status').contains('Task 1 is inactive: Task 1');
      cy.get('.govuk-tag.govuk-tag--grey').contains('Inactive');
    });

    it('activates task', () => {
      cy.get('.govuk-button').contains('Make active').click();
      cy.get('app-automated-task-status').contains('Task 1 is active: Task 1');
      cy.get('.govuk-tag').contains('Active');
    });
  });

  after(() => {
    cy.request('/api/admin/automated-tasks/reset');
  });
});
