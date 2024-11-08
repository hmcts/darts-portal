import 'cypress-axe';
import '../commands';

const rowSelector = '[govukSummaryListRow]';

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

      cy.get(rowSelector).contains('ID').parent().get('dd').contains('1');
      cy.get(rowSelector).contains('Name').parent().get('dd').contains('Task 1');
      cy.get(rowSelector).contains('Description').parent().get('dd').contains('Simulate 202 success');
      cy.get(rowSelector).contains('Cron expression').parent().get('dd').contains('0 0 1 * * *');
      cy.get(rowSelector).contains('Cron editable').parent().get('dd').contains('Yes');
      cy.get(rowSelector).contains('Batch size').parent().get('dd').contains('1000');
      cy.get(rowSelector).contains('RPO CSV start hour').parent().get('dd').contains('Thu 1 Feb 2024 at 02:00:00');
      cy.get(rowSelector).contains('RPO CSV end hour').parent().get('dd').contains('Thu 1 Feb 2024 at 03:00:00');
      cy.get(rowSelector).contains('Date created').parent().get('dd').contains('Mon 1 Jan 2024 at 00:00:00');
      cy.get(rowSelector).contains('Created by').parent().get('dd').contains('Eric Bristow');
      cy.get(rowSelector).contains('Date modified').parent().get('dd').contains('Mon 1 Jan 2024 at 00:00:00');
      cy.get(rowSelector).contains('Modified by').parent().get('dd').contains('Fallon Sherrock');

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

  describe('Change batch size', () => {
    it('Success', () => {
      cy.get('app-data-table').contains('Task 1').parents('tr').get('a').contains('1').click();
      cy.get('.govuk-link').contains('Change').click();
      cy.get('#batch-size').clear().type('2000');
      cy.get('.govuk-button').contains('Confirm').click();
      cy.get('app-govuk-banner').contains('Batch size successfully updated');
      cy.get(rowSelector).contains('Batch size').parents().get('dd').contains('2000');
    });
  });

  after(() => {
    cy.request('/api/admin/automated-tasks/reset');
  });
});
