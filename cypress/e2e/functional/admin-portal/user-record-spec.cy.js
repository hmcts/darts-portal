import 'cypress-axe';
import '../commands';
describe('Admin - User record screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/users');
    cy.get('#fullName').type('Darts User');
    cy.get('button[type="submit"]').click();
    cy.injectAxe();
  });

  describe('User Record - Details', () => {
    it('Verify active user details', () => {
      cy.get('app-user-search-results').should('contain', 'Darts User');
      cy.contains('Darts User').parents('tr').contains('View').click();

      cy.contains('h1', 'Darts User').should('exist');

      //Check tabs
      cy.get('.moj-sub-navigation a').contains('Details').should('exist');
      cy.get('.moj-sub-navigation a').contains('Groups').should('exist');
      cy.get('.moj-sub-navigation a').contains('Transcript Requests').should('exist');
      cy.get('.moj-sub-navigation a').contains('Audio Files').should('exist');

      //Dates
      cy.get('#date-created-container h3').contains('Date created').should('exist');
      cy.get('#last-updated-container h3').contains('Last updated').should('exist');
      cy.get('#last-active-container h3').contains('Last active').should('exist');
      cy.get('#date-created-container p').contains('Sat 20 Jan 2024').should('exist');
      cy.get('#last-updated-container p').contains('Sat 20 Jan 2024').should('exist');
      cy.get('#last-active-container p').contains('Tue 23 Jan 2024').should('exist');

      //Table
      cy.get('.govuk-table__caption').contains('Details').should('be.visible');
      cy.get('th#detail-th-0').contains('Full Name').should('be.visible');
      cy.get('td').contains('Darts User').should('be.visible');
      cy.get('th#detail-th-1').contains('Email').should('be.visible');
      cy.get('td').contains('user@local.net').should('be.visible');
      cy.get('th#detail-th-2').contains('Description').should('be.visible');
      cy.get('td').contains('This is a test user').should('be.visible');

      //Tags
      cy.get('.govuk-tag--green').contains('User record').should('exist');
      cy.get('.govuk-tag').contains('Active user').should('exist');

      //Buttons
      cy.contains('button', 'Edit user').should('exist');
      cy.contains('button', 'Deactivate user').should('exist');

      cy.a11y();
    });

    it('Verify inactive user details', () => {
      cy.get('app-user-search-results').should('contain', 'Inactive User');

      cy.get('td').contains('Inactive User').parents('tr').contains('View').click();

      cy.contains('h1', 'Inactive User').should('exist');

      //Check tabs
      cy.get('.moj-sub-navigation a').contains('Details').should('exist');
      cy.get('.moj-sub-navigation a').contains('Groups').should('exist');
      cy.get('.moj-sub-navigation a').contains('Transcript Requests').should('exist');
      cy.get('.moj-sub-navigation a').contains('Audio Files').should('exist');

      //Dates
      cy.get('#date-created-container h3').contains('Date created').should('exist');
      cy.get('#last-updated-container h3').contains('Last updated').should('exist');
      cy.get('#last-active-container h3').contains('Last active').should('exist');
      cy.get('#date-created-container p').contains('Wed 20 Jan 2021').should('exist');
      cy.get('#last-updated-container p').contains('Wed 20 Jan 2021').should('exist');
      cy.get('#last-active-container p').should('be.empty');

      //Table
      cy.get('.govuk-table__caption').contains('Details').should('be.visible');
      cy.get('th#detail-th-0').contains('Full Name').should('be.visible');
      cy.get('td').contains('Inactive User').should('be.visible');
      cy.get('th#detail-th-1').contains('Email').should('be.visible');
      cy.get('td').contains('inactive.user@local.net').should('be.visible');
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
});
