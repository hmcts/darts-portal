import 'cypress-axe';
import '../commands';

describe('Admin - Retention Policies screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/retention-policies');
    cy.injectAxe();
  });

  it('show active policies', () => {
    cy.get('#active-policies-table').contains('td', '-');
    cy.get('#active-policies-table').contains('td', '01 Jan 2099 12:00 AM');
  });
  it('show inactive policies', () => {
    cy.contains('Inactive').click();
    cy.get('#inactive-policies-table').contains('td', '31 Jan 2024 12:00 AM');
  });

  it('create new policy', () => {
    cy.contains('Create policy').click();
    cy.get('#name').type('New Policy');
    cy.get('#displayName').type('New Policy Display Name');
    cy.get('#description').type('New Policy Description');
    cy.get('#fixedPolicyKey').type('key');
    cy.get('#years').type('1');
    cy.get('#months').type('2');
    cy.get('#days').type('3');
    cy.get('#startDate').type('10/10/3000');
    cy.get('#start-time-hour-input').type('23');
    cy.get('#start-time-minutes-input').type('59');

    cy.contains('Save').click();

    cy.get('app-govuk-banner').contains('Retention policy created');

    cy.get('#active-policies-table').contains('New Policy');
  });
});
