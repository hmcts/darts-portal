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

    it('Task not found', () => {
      cy.get('app-data-table').contains('Task 2').parents('tr').contains('Run task').click();
      cy.get('app-automated-task-status').contains('Task not found: Task 2');
    });

    it('Already running', () => {
      cy.get('app-data-table').contains('Task 3').parents('tr').contains('Run task').click();
      cy.get('app-automated-task-status').contains('Task is already running: Task 3');
    });

    it('Inactive task', () => {
      cy.get('app-data-table').contains('Task 4').parents('tr').contains('Run task').click();
      cy.get('app-govuk-heading').contains('Are you sure you want to run the inactive task "Task 4"?');
      cy.get('.govuk-button').contains('Yes').click();
      cy.get('app-automated-task-status').contains('Task start request sent: Task 4');
    });
  });

  describe('View task', () => {
    it('page elements', () => {
      cy.get('app-data-table').contains('Task 1').parents('tr').get('a').contains('1').click();
      cy.get('app-govuk-heading h1').contains('Task 1');
      cy.get('app-govuk-heading .caption').contains('Automated task');
      cy.get('.govuk-tag').contains('Active');

      cy.get(rowSelector).contains('ID').parent().get('dd').contains('1');
      cy.get(rowSelector).contains('Name').parent().get('dd').contains('Task 1');
      cy.get(rowSelector).contains('Description').parent().get('dd').contains('Simulate 202 success');
      cy.get(rowSelector).contains('Cron expression').parent().get('dd').contains('0 0 1 * * *');
      cy.get(rowSelector).contains('Cron editable').parent().get('dd').contains('Yes');
      cy.get(rowSelector).contains('Batch size').parent().get('dd').contains('1000');
      cy.get(rowSelector).contains('RPO CSV start hour').parent().get('dd').contains('24');
      cy.get(rowSelector).contains('RPO CSV end hour').parent().get('dd').contains('72');
      cy.get(rowSelector).contains('Date created').parent().get('dd').contains('Mon 1 Jan 2024 at 00:00:00');
      cy.get(rowSelector).contains('Created by').parent().get('dd').contains('Eric Bristow');
      cy.get(rowSelector).contains('Date modified').parent().get('dd').contains('Mon 1 Jan 2024 at 00:00:00');
      cy.get(rowSelector).contains('Modified by').parent().get('dd').contains('Fallon Sherrock');

      cy.a11y();
    });

    it('runs active task', () => {
      cy.get('app-data-table').contains('Task 1').parents('tr').get('a').contains('1').click();
      cy.get('.govuk-button').contains('Run task').click();
      cy.get('app-automated-task-status').contains('Task start request sent: Task 1');
    });

    it('deactivates task', () => {
      cy.get('app-data-table').contains('Task 1').parents('tr').get('a').contains('1').click();
      cy.get('.govuk-button').contains('Make inactive').click();
      cy.get('app-automated-task-status').contains('Task 1 is inactive: Task 1');
      cy.get('.govuk-tag.govuk-tag--grey').contains('Inactive');
      cy.get(rowSelector).contains('Modified by').parent().get('dd').contains('Michael van Gerwen');
    });

    it('activates task', () => {
      cy.get('app-data-table').contains('Task 1').parents('tr').get('a').contains('1').click();
      cy.get('.govuk-button').contains('Make active').click();
      cy.get('app-automated-task-status').contains('Task 1 is active: Task 1');
      cy.get('.govuk-tag').contains('Active');
    });

    it('runs inactive task with confirmation screen', () => {
      cy.get('app-data-table').contains('Task 4').parents('tr').get('a').contains('4').click();
      cy.get('.govuk-button').contains('Run task').click();
      cy.get('app-govuk-heading').contains('Are you sure you want to run the inactive task "Task 4"?');
      cy.get('.govuk-button').contains('Yes').click();
      cy.get('app-automated-task-status').contains('Task start request sent: Task 4');
    });
  });

  describe('Change batch size', () => {
    it('Success', () => {
      cy.get('app-data-table').contains('Task 1').parents('tr').get('a').contains('1').click();
      cy.get('.govuk-link').contains('Change').click();
      cy.get('#batchSize').clear().type('2000');
      cy.get('.govuk-button').contains('Confirm').click();
      cy.get('app-govuk-banner').contains('Batch size successfully updated');
      cy.get(rowSelector).contains('Batch size').parents().get('dd').contains('2000');
    });
  });

  describe('Change RPO CSV start hour', () => {
    it('Success', () => {
      cy.get('app-data-table').contains('Task 1').parents('tr').get('a').contains('1').click();

      cy.contains('dt.govuk-summary-list__key', 'RPO CSV start hour')
        .parents('div.govuk-summary-list__row')
        .find('a.govuk-link')
        .click();

      cy.get('#rpoCsvStartHour').clear().type('30');
      cy.get('.govuk-button').contains('Confirm').click();
      cy.get('app-govuk-banner').contains('RPO CSV start hour successfully updated');
      cy.get(rowSelector).contains('RPO CSV start hour').parents().get('dd').contains('30');
    });
  });

  describe('Change RPO CSV end hour', () => {
    it('Success', () => {
      cy.get('app-data-table').contains('Task 1').parents('tr').get('a').contains('1').click();

      cy.contains('dt.govuk-summary-list__key', 'RPO CSV end hour')
        .parents('div.govuk-summary-list__row')
        .find('a.govuk-link')
        .click();

      cy.get('#rpoCsvEndHour').clear().type('99');

      cy.get('.govuk-button').contains('Confirm').click();
      cy.get('app-govuk-banner').contains('RPO CSV end hour successfully updated');
      cy.get(rowSelector).contains('RPO CSV end hour').parents().get('dd').contains('99');
    });
  });

  describe('Change ARM Replay start time', () => {
    it('Success', () => {
      cy.get('app-data-table').contains('Task 2').parents('tr').get('a').contains('2').click();

      cy.contains('dt.govuk-summary-list__key', 'ARM Replay start time')
        .parents('div.govuk-summary-list__row')
        .find('a.govuk-link')
        .click();

      cy.get('#date').clear().type('21/05/2024');

      cy.get('#edit-time-hour-input').clear().type('17');
      cy.get('#edit-time-minutes-input').clear().type('30');
      cy.get('#edit-time-seconds-input').clear().type('11');

      cy.get('.govuk-button').contains('Confirm').click();
      cy.get('app-govuk-banner').contains('ARM Replay start time successfully updated');
      cy.get(rowSelector).contains('ARM Replay start time').parents().get('dd').contains('Tue 21 May 2024 at 17:30:11');
    });
  });

  describe('Change ARM Replay end time', () => {
    it('Success', () => {
      cy.get('app-data-table').contains('Task 2').parents('tr').get('a').contains('2').click();

      cy.contains('dt.govuk-summary-list__key', 'ARM Replay end time')
        .parents('div.govuk-summary-list__row')
        .find('a.govuk-link')
        .click();

      cy.get('#date').clear().type('21/10/2024');

      cy.get('#edit-time-hour-input').clear().type('09');
      cy.get('#edit-time-minutes-input').clear().type('00');
      cy.get('#edit-time-seconds-input').clear().type('31');

      cy.get('.govuk-button').contains('Confirm').click();
      cy.get('app-govuk-banner').contains('ARM Replay end time successfully updated');
      cy.get(rowSelector).contains('ARM Replay end time').parents().get('dd').contains('Mon 21 Oct 2024 at 09:00:31');
    });
  });

  after(() => {
    cy.request('/api/admin/automated-tasks/reset');
  });
});
