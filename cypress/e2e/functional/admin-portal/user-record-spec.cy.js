import 'cypress-axe';
import '../commands';
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
      cy.get('#date-created-container p').contains('Mon 30 Mar 2020').should('exist');
      cy.get('#last-updated-container p').contains('Thu 9 Apr 2020').should('exist');
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
  });

  describe('Edit user', () => {
    it('No email change flow', () => {
      cy.get('app-user-search-results').should('contain', 'Edit Functional Test');
      cy.contains('Edit Functional Test').parents('tr').contains('View').click();

      cy.get('button').contains('Edit user').click();
      cy.get('h1').should('contain', 'Edit user record');

      cy.get('#fullName').should('have.value', 'Edit Functional Test');
      cy.get('#description').should('have.value', 'Edit description');

      cy.get('#fullName').clear().type('Edit Functional Test (Updated)');
      cy.get('#description').clear().type('This is an edited test user');

      cy.a11y();

      cy.get('button[type="submit"]').click();

      cy.get('app-govuk-banner').should('contain', 'User updated');

      cy.contains('h1', 'Edit Functional Test (Updated)').should('exist');
      cy.get('td').contains('dont.edit@me.net').should('be.visible');
      cy.get('td').contains('This is an edited test user').should('be.visible');
    });

    it('Change email flow', () => {
      cy.get('app-user-search-results').should('contain', 'Edit Email Functional Test');
      cy.contains('Edit Email Functional Test').parents('tr').contains('View').click();

      cy.get('button').contains('Edit user').click();
      cy.get('h1').should('contain', 'Edit user record');

      cy.get('#fullName').should('have.value', 'Edit Email Functional Test');
      cy.get('#email').should('have.value', 'edit@me.net');
      cy.get('#description').should('have.value', 'Edit me');

      cy.get('#fullName').clear().type('Edit Email Functional Test (updated)');
      cy.get('#email').clear().type('edit@me.com');
      cy.get('#description').clear().type('Edit me 2');

      cy.a11y();

      cy.get('button[type="submit"]').click();

      cy.get('h1').should('contain', 'Confirm change of user email address');

      cy.get('#yes').click();

      cy.a11y();

      cy.get('#confirm-button').click();

      cy.get('app-govuk-banner').should('contain', 'User updated');

      cy.contains('h1', 'Edit Email Functional Test (updated)').should('exist');
      cy.get('td').contains('edit@me.com').should('be.visible');
      cy.get('td').contains('Edit me 2').should('be.visible');
    });
  });
});
