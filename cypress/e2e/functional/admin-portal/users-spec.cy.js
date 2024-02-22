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
    cy.get('#fullName').type('Darts User');
    cy.get('button[type="submit"]').click();

    cy.get('app-user-search-results').should('contain', 'Darts User');
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
  });
});
