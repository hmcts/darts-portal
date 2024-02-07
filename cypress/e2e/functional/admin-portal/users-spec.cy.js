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

  //   it('View a user', () => {});

  //   it('Creates a new user', () => {});

  describe('Validation', () => {
    describe('Full name field', () => {
      it('Required', () => {});
      it('Invalid characters', () => {});
    });
    describe('Email field', () => {
      it('Invalid email', () => {});
    });
  });
});
