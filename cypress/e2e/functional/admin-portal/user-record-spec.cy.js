import 'cypress-axe';
import '../commands';

Cypress.Commands.add('tableRowShouldContain', (groupName, role) => {
  cy.get('.govuk-table__body').contains(groupName).parents('tr').contains(role).should('exist');
});

Cypress.Commands.add('selectedListShouldContain', (groupName, role) => {
  cy.get('.govuk-summary-list__row').contains(groupName).parents('dl').contains(role).should('exist');
});

Cypress.Commands.add('checkGroup', (groupName) => {
  cy.get('.govuk-table__body').contains(groupName).parents('tr').find('input[type="checkbox"]').check();
});

describe('Admin - User record screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/users');
    cy.get('#email').type('darts');
    cy.get('button[type="submit"]').click();
    cy.injectAxe();
  });

  describe('User Record - Details', () => {
    it('Verify active user details', () => {
      cy.get('app-user-search-results').should('contain', 'Eric Bristow');
      cy.contains('Eric Bristow').parents('tr').contains('View').click();

      cy.contains('h1', 'Eric Bristow').should('exist');

      //Check tabs
      cy.get('.moj-sub-navigation a').contains('Details').should('exist');
      cy.get('.moj-sub-navigation a').contains('Groups').should('exist');
      cy.get('.moj-sub-navigation a').contains('Transcript Requests').should('exist');
      cy.get('.moj-sub-navigation a').contains('Audio Files').should('exist');

      //Dates
      cy.get('#date-created-container h3').contains('Date created').should('exist');
      cy.get('#last-updated-container h3').contains('Last updated').should('exist');
      cy.get('#last-active-container h3').contains('Last active').should('exist');
      cy.get('#date-created-container p').contains('Sat 11 Jan 2020').should('exist');
      cy.get('#last-updated-container p').contains('Tue 21 Jan 2020').should('exist');
      cy.get('#last-active-container p').contains('Mon 11 Dec 2023').should('exist');

      //Table
      cy.get('.govuk-table__caption').contains('Details').should('be.visible');
      cy.get('th#detail-th-0').contains('Full name').should('be.visible');
      cy.get('td').contains('Eric Bristow').should('be.visible');
      cy.get('th#detail-th-1').contains('Email').should('be.visible');
      cy.get('td').contains('eric.bristow@darts.local').should('be.visible');
      cy.get('th#detail-th-2').contains('Description').should('be.visible');
      cy.get('td').contains('Stub Active User').should('be.visible');

      //Tags
      cy.get('.govuk-tag--green').contains('User record').should('exist');
      cy.get('.govuk-tag').contains('Active user').should('exist');

      //Buttons
      cy.contains('button', 'Edit user').should('exist');
      cy.contains('button', 'Deactivate user').should('exist');

      cy.a11y();
    });

    it('Verify inactive user details', () => {
      cy.get('#allUsers').click();
      cy.get('button[type="submit"]').click();
      cy.get('app-user-search-results').should('contain', 'Peter Wright');

      cy.get('td').contains('Peter Wright').parents('tr').contains('View').click();

      cy.contains('h1', 'Peter Wright').should('exist');

      //Check tabs
      cy.get('.moj-sub-navigation a').contains('Details').should('exist');
      cy.get('.moj-sub-navigation a').contains('Groups').should('exist');
      cy.get('.moj-sub-navigation a').contains('Transcript Requests').should('exist');
      cy.get('.moj-sub-navigation a').contains('Audio Files').should('exist');

      //Dates
      cy.get('#date-created-container h3').contains('Date created').should('exist');
      cy.get('#last-updated-container h3').contains('Last updated').should('exist');
      cy.get('#last-active-container h3').contains('Last active').should('exist');
      cy.get('#date-created-container p').contains('Tue 31 Mar 2020').should('exist');
      cy.get('#last-updated-container p').contains('Fri 10 Apr 2020').should('exist');
      cy.get('#last-active-container p').should('be.empty');

      //Table
      cy.get('.govuk-table__caption').contains('Details').should('be.visible');
      cy.get('th#detail-th-0').contains('Full name').should('be.visible');
      cy.get('td').contains('Peter Wright').should('be.visible');
      cy.get('th#detail-th-1').contains('Email').should('be.visible');
      cy.get('td').contains('peter.wright@darts.local').should('be.visible');
      cy.get('th#detail-th-2').should('not.exist');

      //Tags
      cy.get('.govuk-tag--green').contains('User record').should('exist');
      cy.get('.govuk-tag--grey').contains('Inactive').should('exist');

      //Buttons
      cy.contains('button', 'Edit user').should('exist');
      cy.contains('button', 'Activate user').should('exist');

      cy.a11y();
    });

    it('Reactivate user', () => {
      cy.get('#inactiveUsers').click();
      cy.get('button[type="submit"]').click();

      cy.get('app-user-search-results').should('contain', 'Peter Wright');
      cy.contains('Peter Wright').parents('tr').contains('View').click();

      cy.get('button').contains('Activate user').click();

      cy.get('h1').should('contain', 'Reactivate user');
      cy.get('h1').should('contain', 'Peter Wright');

      cy.get('p.govuk-body').should(
        'contain',
        'Reactivating this user will give them access to DARTS. They will not be able to see any data until they are added to at least one group.'
      );

      cy.a11y();

      cy.get('#activate-button').click();

      cy.get('app-govuk-banner').should('contain', 'User record activated');

      cy.get('.govuk-tag--green').contains('User record').should('exist');
      cy.get('.govuk-tag').contains('Active user').should('exist');
    });
  });

  describe('Edit user', () => {
    it('No email change flow', () => {
      cy.get('app-user-search-results').should('contain', 'Luke Littler');
      cy.contains('Luke Littler').parents('tr').contains('View').click();

      cy.get('button').contains('Edit user').click();
      cy.get('h1').should('contain', 'Edit user record');

      cy.get('#fullName').should('have.value', 'Luke Littler');
      cy.get('#description').should('have.value', 'Stub Active User');

      cy.get('#fullName').clear().type('Luke Littler Edit');
      cy.get('#description').clear().type('Stub Active User Edit');

      cy.a11y();

      cy.get('button[type="submit"]').click();

      cy.get('app-govuk-banner').should('contain', 'User updated');

      cy.contains('h1', 'Luke Littler Edit').should('exist');
      cy.get('td').contains('luke.littler@darts.local').should('be.visible');
      cy.get('td').contains('Stub Active User Edit').should('be.visible');
    });

    it('Change email flow', () => {
      cy.get('app-user-search-results').should('contain', 'phil.taylor@darts.local');
      cy.contains('phil.taylor@darts.local').parents('tr').contains('View').click();

      cy.get('button').contains('Edit user').click();
      cy.get('h1').should('contain', 'Edit user record');

      cy.get('#fullName').should('have.value', 'Phil Taylor');
      cy.get('#email').should('have.value', 'phil.taylor@darts.local');
      cy.get('#description').should('have.value', 'Stub Active User');

      cy.get('#fullName').clear().type('Phil Taylor EDIT');
      cy.get('#email').clear().type('phil.taylor@darts.edit');
      cy.get('#description').clear().type('Stub Active User EDIT');

      cy.a11y();

      cy.wait(500);

      cy.get('button[type="submit"]').click();

      cy.get('h1').should('contain', 'Are you sure you want to change this user’s email address?');

      cy.a11y();

      cy.get('#confirm-button').click();

      cy.get('app-govuk-banner').should('contain', 'User updated');

      cy.contains('h1', 'Phil Taylor EDIT').should('exist');
      cy.get('td').contains('phil.taylor@darts.edit').should('be.visible');
      cy.get('td').contains('Stub Active User EDIT').should('be.visible');
    });
  });

  describe('Groups tab', () => {
    it('Verify groups tab', () => {
      cy.get('app-user-search-results').should('contain', 'Fallon Sherrock');
      cy.contains('Fallon Sherrock').parents('tr').contains('View').click();

      cy.get('#groups-tab').click();

      cy.contains('h2', 'Groups').should('exist');

      cy.tableRowShouldContain('Judiciary', 'Approver');
      cy.tableRowShouldContain('Opus Transcribers', 'Requestor');

      cy.a11y();
    });

    it('Assigns groups to user', () => {
      cy.get('app-user-search-results').should('contain', 'Fallon Sherrock');
      cy.contains('Fallon Sherrock').parents('tr').contains('View').click();

      cy.get('#groups-tab').click();

      cy.get('button').contains('Assign groups').click();

      cy.get('h1').should('contain', 'Assign groups');
      cy.get('h2').should('contain', '2 groups selected');

      cy.selectedListShouldContain('Judiciary', 'Approver');
      cy.selectedListShouldContain('Opus Transcribers', 'Requestor');

      cy.checkGroup('Super user (DARTS portal)');

      cy.a11y();

      cy.get('#assign-button').click();

      cy.get('app-govuk-banner').should('contain', 'Assigned 3 groups');

      cy.tableRowShouldContain('Judiciary', 'Approver');
      cy.tableRowShouldContain('Opus Transcribers', 'Requestor');
      cy.tableRowShouldContain('Super user (DARTS portal)', 'Judge');
    });

    it('Remove groups from user', () => {
      cy.get('app-user-search-results').should('contain', 'Fallon Sherrock');
      cy.contains('Fallon Sherrock').parents('tr').contains('View').click();

      cy.get('#groups-tab').click();

      cy.tableRowShouldContain('Judiciary', 'Approver');
      cy.checkGroup('Judiciary');

      cy.get('#remove-groups-button').click();

      cy.a11y();

      cy.get('h1').should('contain', 'Are you sure you want to remove Fallon Sherrock from these groups?');

      cy.get('#confirm-button').click();

      cy.get('app-govuk-banner').should('contain', 'Removed 1 group');

      cy.get('.govuk-table__body').contains('Judiciary').should('not.exist');
      cy.tableRowShouldContain('Opus Transcribers', 'Requestor');
      cy.tableRowShouldContain('Super user (DARTS portal)', 'Judge');
    });
  });
});
