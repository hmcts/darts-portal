import 'cypress-axe';
import '../commands';
describe('Admin - Users screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/users');
    cy.injectAxe();
  });

  it('Load page', () => {
    cy.get('h1').should('contain', 'Users');
    cy.a11y();
  });

  it('Search for users', () => {
    cy.get('#fullName').type('Eric');
    cy.get('button[type="submit"]').click();

    cy.get('app-user-search-results').should('contain', 'Eric Bristow');
    cy.a11y();
  });

  it('No search results', () => {
    cy.get('#fullName').type('NO_RESULTS');
    cy.get('button[type="submit"]').click();

    cy.get('app-user-search-results').should('contain', 'No search results');
    cy.a11y();
  });

  it('Creates a new user', () => {
    cy.get('button').contains('Create new user').click();
    cy.get('h1').should('contain', 'Enter user details');

    cy.get('#fullName').type('New User');
    cy.get('#email').type('user@test.com');
    cy.get('#description').type('This is a test user');

    cy.a11y();

    cy.wait(500);
    cy.get('button[type="submit"]').click();
    cy.get('h1').should('contain', 'Check user details');

    cy.a11y();

    cy.get('#confirm-button').click();

    cy.get('app-govuk-banner').should('contain', 'User record has been created for New User');
  });

  it('Email address already exists when creating new user', () => {
    cy.get('button').contains('Create new user').click();
    cy.get('h1').should('contain', 'Enter user details');

    cy.get('#fullName').type('New User');
    cy.get('#email').type('eric.bristow@darts.local');
    cy.get('#description').type('This is a test user');

    cy.get('.email-error').should('contain', 'This email account already exists in the database');
  });
});
