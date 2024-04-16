import 'cypress-axe';
import '../commands';

describe('Admin - Retention Policies screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/system-configuration/retention-policies');
    cy.injectAxe();
  });

  it('show active policies', () => {
    cy.get('#active-policies-table').contains('Legacy Permanent');
    cy.a11y();
  });
  it('show inactive policies', () => {
    cy.contains('Inactive').click();
    cy.get('#inactive-policies-table').contains('Not Guilty');
    cy.a11y();
  });

  it('create new policy', () => {
    cy.contains('Create policy').click();
    cy.get('h1').contains('Create new policy');

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

    cy.a11y();

    cy.get('button').contains('Create').click();

    cy.get('app-govuk-banner').contains('Retention policy created');

    cy.get('#active-policies-table').contains('New Policy');
  });

  it('edit policy', () => {
    cy.get('td').contains('Retention Policy 1').parents('tr').contains('Edit Policy').click();
    cy.get('h1').contains('Edit policy');

    // populate form
    cy.get('#name').should('have.value', 'Retention Policy 1');
    cy.get('#displayName').should('have.value', 'Retention Policy 1');
    cy.get('#description').should('have.value', 'description ipsum');
    cy.get('#fixedPolicyKey').should('have.value', 'DEF');
    cy.get('#years').should('have.value', '3');
    cy.get('#months').should('have.value', '10');
    cy.get('#days').should('have.value', '9');
    cy.get('#startDate').should('have.value', '01/02/2088');
    cy.get('#start-time-hour-input').should('have.value', '17');
    cy.get('#start-time-minutes-input').should('have.value', '30');

    // update form
    cy.get('#name').clear().type('Updated Policy');
    cy.get('#displayName').clear().type('Updated Policy');
    cy.get('#description').clear().type('Updated Policy Description');
    cy.get('#fixedPolicyKey').clear().type('999');
    cy.get('#years').clear().type('1');
    cy.get('#months').clear().type('1');
    cy.get('#days').clear().type('1');
    cy.get('#startDate').clear().type('01/01/3000');
    cy.get('#start-time-hour-input').clear().type('12');
    cy.get('#start-time-minutes-input').clear().type('00');

    cy.contains('Save').click();

    cy.get('app-govuk-banner').contains('Retention policy updated');

    cy.get('#active-policies-table').contains('Updated Policy');
    cy.get('#active-policies-table').contains('01 Jan 3000 12:00 PM');
    cy.get('#active-policies-table').contains('999');
    cy.get('#active-policies-table').contains('Updated Policy Description');
  });

  it('create policy revision', () => {
    cy.get('td').contains('Legacy Standard').parents('tr').contains('Create new version').click();
    cy.get('h1').contains('Create new version');

    cy.get('#displayName').should('have.value', 'Legacy Standard');
    cy.get('#name').should('have.value', 'DARTS Standard Retention v3');
    cy.get('#description').should('have.value', 'lorem ipsum');
    // fixed policy is readonly
    cy.get('#read-only-fixed-policy-key').contains('ABC');
    // below fields should not have values pre populated
    cy.get('#years').should('have.value', '');
    cy.get('#months').should('have.value', '');
    cy.get('#days').should('have.value', '');
    cy.get('#startDate').should('have.value', '');
    cy.get('#start-time-hour-input').should('have.value', '');
    cy.get('#start-time-minutes-input').should('have.value', '');

    // update form
    cy.get('#displayName').clear().type('Legacy Standard v4');
    cy.get('#name').clear().type('DARTS Standard Retention v4');
    cy.get('#description').clear().type('lorem ipsum v4');
    cy.get('#years').clear().type('1');
    cy.get('#months').clear().type('6');
    cy.get('#days').clear().type('0');
    cy.get('#startDate').clear().type('01/01/3000');
    cy.get('#start-time-hour-input').clear().type('12');
    cy.get('#start-time-minutes-input').clear().type('00');

    cy.get('button').contains('Create').click();

    cy.get('app-govuk-banner').contains('Retention policy version created');
  });

  it('Edit policy revision', () => {
    cy.get('td').contains('Legacy Standard v4').parents('tr').contains('Edit').click();
    cy.get('h1').contains('Edit policy');

    // populate form
    cy.get('#displayName').should('have.value', 'Legacy Standard v4');
    cy.get('#name').should('have.value', 'DARTS Standard Retention v4');
    cy.get('#description').should('have.value', 'lorem ipsum v4');
    cy.get('#read-only-fixed-policy-key').contains('ABC');
    cy.get('#years').should('have.value', '1');
    cy.get('#months').should('have.value', '6');
    cy.get('#days').should('have.value', '0');
    cy.get('#startDate').should('have.value', '01/01/3000');
    cy.get('#start-time-hour-input').should('have.value', '12');
    cy.get('#start-time-minutes-input').should('have.value', '00');

    // update form
    cy.get('#displayName').clear().type('Legacy Standard v5');
    cy.get('#name').clear().type('DARTS Standard Retention v5');
    cy.get('#description').clear().type('lorem ipsum v5');

    cy.contains('Save').click();

    cy.get('app-govuk-banner').contains('Retention policy updated');
  });
});
