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
      cy.get('.moj-sub-navigation a').contains('Transcript requests').should('exist');

      //Dates
      cy.get('#date-created-container p.label').contains('Date created').should('exist');
      cy.get('#last-updated-container p.label').contains('Last updated').should('exist');
      cy.get('#last-active-container p.label').contains('Last active').should('exist');
      cy.get('#date-created-container p.value').contains('Sat 11 Jan 2020').should('exist');
      cy.get('#last-updated-container p.value').contains('Tue 21 Jan 2020').should('exist');
      cy.get('#last-active-container p.value').contains('Mon 11 Dec 2023').should('exist');

      //Table
      cy.get('app-details-table').contains('Details').should('be.visible');
      cy.get('dt').contains('Full name').should('be.visible');
      cy.get('dd').contains('Eric Bristow').should('be.visible');
      cy.get('dt').contains('Email').should('be.visible');
      cy.get('dd').contains('eric.bristow@darts.local').should('be.visible');
      cy.get('dt').contains('Description').should('be.visible');
      cy.get('dd').contains('Stub Active User').should('be.visible');

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
      cy.get('.moj-sub-navigation a').contains('Transcript requests').should('exist');

      //Dates
      cy.get('#date-created-container p.label').contains('Date created').should('exist');
      cy.get('#last-updated-container p.label').contains('Last updated').should('exist');
      cy.get('#last-active-container p.label').contains('Last active').should('exist');
      cy.get('#date-created-container p.value').contains('Tue 31 Mar 2020').should('exist');
      cy.get('#last-updated-container p.value').contains('Fri 10 Apr 2020').should('exist');
      cy.get('#last-active-container p.value').should('be.empty');

      //Table
      cy.get('app-details-table').contains('Details').should('be.visible');
      cy.get('dt').contains('Full name').should('be.visible');
      cy.get('dd').contains('Peter Wright').should('be.visible');
      cy.get('dt').contains('Email').should('be.visible');
      cy.get('dd').contains('peter.wright@darts.local').should('be.visible');

      //Tags
      cy.get('.govuk-tag--green').contains('User record').should('exist');
      cy.get('.govuk-tag--grey').contains('Inactive').should('exist');

      //Buttons
      cy.contains('button', 'Edit user').should('exist');
      cy.contains('button', 'Activate user').should('exist');

      cy.a11y();
    });
  });

  describe('Activate user', () => {
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

    it('error if user does not have email or full name on activate user', () => {
      cy.get('#inactiveUsers').click();
      cy.get('button[type="submit"]').click();

      cy.contains('Gary Anderson').parents('tr').contains('View').click();

      cy.get('button').contains('Activate user').click();

      cy.get('h1').should('contain', 'Reactivate user');
      cy.get('h1').should('contain', 'Gary Anderson');

      cy.get('#activate-button').click();

      cy.get('app-govuk-banner').should(
        'contain',
        'User cannot be activated without a full name and valid email address.'
      );

      cy.get('.govuk-tag--green').contains('User record').should('exist');
      cy.get('.govuk-tag--grey').contains('Inactive').should('exist');
    });
  });

  describe('Deactivate user', () => {
    it('when user has transcripts rolled back', () => {
      cy.contains('Phil Taylor').parents('tr').contains('View').click();

      cy.get('button').contains('Deactivate user').click();

      cy.get('h1').should('contain', 'Deactivate user');
      cy.get('h1').should('contain', 'Phil Taylor');

      cy.get('#deactivate-button').click();

      cy.get('app-govuk-banner').should('contain', 'User record deactivated');
      cy.get('app-govuk-banner').should(
        'contain',
        'The following transcript requests have been moved back to the pool to be reallocated:'
      );
      cy.get('app-govuk-banner').should('contain', '1').and('contain', '2').and('contain', '3');

      cy.get('.govuk-tag--green').contains('User record').should('exist');
      cy.get('.govuk-tag--grey').contains('Inactive').should('exist');
    });

    it('when user is the only member of groups', () => {
      cy.get('app-user-search-results').should('contain', 'Eric Bristow');
      cy.contains('Eric Bristow').parents('tr').contains('View').click();

      cy.get('button').contains('Deactivate user').click();

      cy.get('h1').should('contain', 'Deactivate user');
      cy.get('h1').should('contain', 'Eric Bristow');

      cy.get('.govuk-task-list').should('contain', 'Judiciary');
      cy.get('.govuk-task-list').should('contain', 'Skriber Tech UK');

      cy.a11y();

      cy.get('#deactivate-button').click();

      cy.get('app-govuk-banner').should('contain', 'User record deactivated');
      cy.get('.govuk-tag--grey').contains('Inactive').should('exist');
    });

    it('when user is the only SUPER_ADMIN user', () => {
      cy.contains('Fallon Sherrock').parents('tr').contains('View').click();
      cy.get('button').contains('Deactivate user').click();

      cy.get('app-govuk-heading').should('contain', 'You cannot deactivate this user');
      cy.get('p.govuk-body').should(
        'contain',
        'This is the only active user in the Super Admin (Admin Portal) group. '
      );
      cy.a11y();

      cy.get('#back-button').click();

      cy.get('h1').should('contain', 'Fallon Sherrock');
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
      cy.get('dd').contains('luke.littler@darts.local').should('be.visible');
      cy.get('dd').contains('Stub Active User Edit').should('be.visible');
    });

    it('Change email flow', () => {
      cy.get('#allUsers').click();
      cy.get('button[type="submit"]').click();
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
      cy.get('dd').contains('phil.taylor@darts.edit').should('be.visible');
      cy.get('dd').contains('Stub Active User EDIT').should('be.visible');
    });
  });

  describe('Groups tab', () => {
    it('Verify groups tab', () => {
      cy.get('app-user-search-results').should('contain', 'Fallon Sherrock');
      cy.contains('Fallon Sherrock').parents('tr').contains('View').click();

      cy.get('#groups-tab').click();

      cy.contains('h2', 'Groups').should('exist');

      cy.tableRowShouldContain('Judiciary', 'Approver');
      cy.tableRowShouldContain('Opus Transcribers', 'Transcriber');

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
      cy.selectedListShouldContain('Opus Transcribers', 'Transcriber');

      cy.checkGroup('Super user (DARTS portal)');

      cy.a11y();

      cy.get('#assign-button').click();

      cy.get('app-govuk-banner').should('contain', 'Assigned 3 groups');

      cy.tableRowShouldContain('Judiciary', 'Approver');
      cy.tableRowShouldContain('Opus Transcribers', 'Transcriber');
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

      cy.get('h1').should('contain', 'Are you sure you want to remove Fallon Sherrock from this group?');

      cy.get('#confirm-button').click();

      cy.get('app-govuk-banner').should('contain', 'Removed 1 group');

      cy.get('.govuk-table__body').contains('Judiciary').should('not.exist');
      cy.tableRowShouldContain('Opus Transcribers', 'Transcriber');
      cy.tableRowShouldContain('Super user (DARTS portal)', 'Judge');
    });
  });

  describe('Transcript requests tab', () => {
    it('Verify transcript requests tab', () => {
      cy.get('app-user-search-results').should('contain', 'Fallon Sherrock');
      cy.contains('Fallon Sherrock').parents('tr').contains('View').click();

      cy.get('#transcripts-tab').click();

      cy.get('#transcripts-tab .count').should('contain', '1');

      cy.contains('h2', 'Transcript requests').should('exist');

      cy.get('#showLastSixMonths').should('be.checked');
      cy.get('#showAll').should('not.be.checked');

      cy.get('#transcriptRequestsTable tbody tr').should('have.length', 1);

      cy.get('#transcriptRequestsTable tbody tr')
        .eq(0)
        .within(() => {
          cy.get('td').eq(0).should('contain.text', '7');
          cy.get('td').eq(1).should('contain.text', 'C0000000007');
          cy.get('td').eq(2).should('contain.text', 'Southampton');
          cy.get('td').eq(3).should('contain.text', '06 Jan 2022');
          cy.get('td').eq(5).should('contain.text', 'With Transcriber');
          cy.get('td').eq(6).should('contain.text', 'Manual');
        });

      cy.a11y();
    });

    it('should display correct data and table headings', () => {
      cy.get('app-user-search-results').should('contain', 'Fallon Sherrock');
      cy.contains('Fallon Sherrock').parents('tr').contains('View').click();

      cy.get('#transcripts-tab').click();

      cy.get('#showAll').check();
      cy.get('#transcripts-tab .count').should('contain', '7');

      cy.get('#transcriptRequestsTable tbody tr').should('have.length', 7);
      cy.get('#transcriptRequestsTable thead tr').within(() => {
        cy.get('th').eq(0).should('contain.text', 'Request ID');
        cy.get('th').eq(1).should('contain.text', 'Case ID');
        cy.get('th').eq(2).should('contain.text', 'Courthouse');
        cy.get('th').eq(3).should('contain.text', 'Hearing date');
        cy.get('th').eq(4).should('contain.text', 'Requested on');
        cy.get('th').eq(5).should('contain.text', 'Status');
        cy.get('th').eq(6).should('contain.text', 'Request type');
      });

      cy.get('#transcriptRequestsTable tbody tr')
        .eq(0)
        .within(() => {
          cy.get('td').eq(0).should('contain.text', '1');
          cy.get('td').eq(1).should('contain.text', 'C0000000001');
          cy.get('td').eq(2).should('contain.text', 'Slough');
          cy.get('td').eq(3).should('contain.text', '01 Jan 2022');
          cy.get('td').eq(4).should('contain.text', '01 Jan 2023 02:00');
          cy.get('td').eq(5).should('contain.text', 'Requested');
          cy.get('td').eq(6).should('contain.text', 'Manual');
        });

      cy.get('#transcriptRequestsTable tbody tr')
        .eq(1)
        .within(() => {
          cy.get('td').eq(0).should('contain.text', '2');
          cy.get('td').eq(1).should('contain.text', 'C0000000002');
          cy.get('td').eq(2).should('contain.text', 'Kingston');
          cy.get('td').eq(3).should('contain.text', '02 Jan 2022');
          cy.get('td').eq(4).should('contain.text', '02 Jan 2023 04:00');
          cy.get('td').eq(5).should('contain.text', 'Requested');
          cy.get('td').eq(6).should('contain.text', 'Automatic');
        });

      cy.a11y();
    });
  });

  after(() => {
    cy.request('/api/admin/users/reset');
  });
});
