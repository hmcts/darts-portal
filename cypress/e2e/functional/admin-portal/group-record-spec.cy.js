import 'cypress-axe';
import '../commands';
describe('Admin - Groups screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/groups/2');
    cy.injectAxe();
  });

  it('load page', () => {
    cy.get('h1').should('contain', 'Group details');
    cy.a11y();
  });

  it('assigns courthouse to group', () => {
    cy.get('#select-courthouse').select('Cardiff');

    cy.get('button').contains('Add courthouse').click();

    cy.get('#courthouse-table').should('contain', 'Slough');
    cy.get('#courthouse-table').should('contain', 'Kingston');
    cy.get('#courthouse-table').should('contain', 'Cardiff');
  });

  it('removes courthouse from group', () => {
    cy.get('#courthouse-table').contains('Cardiff').siblings('td').contains('Remove').click();
    cy.get('#courthouse-table').should('not.contain', 'Cardiff');
  });

  it('assigns user to group', () => {
    cy.get('a.moj-sub-navigation__link').contains('Users').click();
    cy.get('h2').should('contain', 'Users');

    cy.get('#group-users-table').should('not.contain', 'Phil Taylor');

    cy.get('#users-autocomplete').click();
    cy.get('li').contains('Phil Taylor').click();

    cy.get('button').contains('Add user').click();

    cy.get('#group-users-table').should('contain', 'Phil Taylor');
  });

  it('removes user from group', () => {
    cy.get('a.moj-sub-navigation__link').contains('Users').click();
    cy.get('h2').should('contain', 'Users');

    cy.get('#group-users-table').should('contain', 'Phil Taylor');

    cy.get('#group-users-table').contains('Phil Taylor').parents('tr').find('input').check();

    cy.get('button').contains('Remove users').click();

    cy.get('h1').should('contain', 'Are you sure you want to remove 1 user from this group?');

    cy.get('button').contains('Yes - continue').click();

    cy.get('app-govuk-banner').should('contain', '1 user removed');
    cy.get('#group-users-table').should('not.contain', 'Phil Taylor');
  });

  it('removes all users from group', () => {
    cy.get('a.moj-sub-navigation__link').contains('Users').click();
    cy.get('h2').should('contain', 'Users');

    cy.get('button').contains('Remove users').click();

    cy.get('h1').should('contain', 'Are you sure you want to remove all users from this group?');

    cy.get('button').contains('Yes - continue').click();

    cy.get('app-govuk-banner').should('contain', '2 users removed');
    cy.get('#group-users-table').should('contain', 'There are no users assigned to this group.');
  });

  it('edits group details', () => {
    cy.get('#group-name').should('contain', 'Opus Transcribers');
    cy.get('#group-description').should('contain', 'Dummy description 2');
    cy.get('#group-role').should('contain', 'Transcriber');

    cy.get('button').contains('Edit group details').click();

    cy.get('#name').clear().type('Opus Transcribers Edit');
    cy.get('#description').clear().type('Dummy description Edit');
    cy.get('#role').should('contain', 'Transcriber');
    cy.get('#role-hint').should('contain', 'Cannot be changed.');

    cy.get('button').contains('Save changes').click();

    cy.get('app-govuk-banner').should('contain', 'Group details updated');
    cy.get('h1').should('contain', 'Group details');

    cy.get('#group-name').should('contain', 'Opus Transcribers Edit');
    cy.get('#group-description').should('contain', 'Dummy description Edit');
    cy.get('#group-role').should('contain', 'Transcriber');
  });

  it('edit group details prevents duplicate name entry', () => {
    cy.get('button').contains('Edit group details').click();

    cy.get('#name').clear().type('Judiciary');
    cy.get('button').contains('Save changes').click();

    cy.get('.fullName-error').should('contain', 'There is an existing group with this name');
  });

  after(() => {
    cy.request('/api/admin/security-groups/reset');
  });
});
