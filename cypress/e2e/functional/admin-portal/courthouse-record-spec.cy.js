import 'cypress-axe';
import '../commands';

describe('Admin - Courthouse record screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/courthouses');

    cy.get('#courthouseName').type('Reading').click();
    cy.get('button[type="submit"]').click();

    cy.get('td').contains('READING').click();
    cy.injectAxe();
  });

  it('View courthouse', () => {
    cy.contains('h1', 'Reading').should('exist');

    // Check tabs
    cy.get('.moj-sub-navigation a').contains('Details').should('exist');
    cy.get('.moj-sub-navigation a').contains('Users').should('exist');

    // Dates
    cy.get('#date-created-container h3').contains('Date created').should('exist');
    cy.get('#last-updated-container h3').contains('Last updated').should('exist');
    cy.get('#date-created-container p').contains('Fri 18 Aug 2023').should('exist');
    cy.get('#last-updated-container p').contains('Fri 18 Aug 2023').should('exist');

    // Table
    cy.get('.govuk-table__caption').contains('Details').should('be.visible');
    cy.get('th#detail-th-0').contains('Database ID').should('be.visible');
    cy.get('td').contains('0').should('be.visible');
    cy.get('th#detail-th-1').contains('Courthouse name').should('be.visible');
    cy.get('td').contains('Reading').should('be.visible');
    cy.get('th#detail-th-2').contains('Region').should('be.visible');
    cy.get('td').contains('South west').should('be.visible');
    cy.get('th#detail-th-3').contains('Groups').should('be.visible');
    cy.get('td').contains('Judiciary').should('be.visible');
    cy.get('th#detail-th-4').should('not.exist');

    // Tags
    cy.get('.govuk-tag--purple').contains('Courthouse record').should('exist');

    // Buttons
    cy.contains('button', 'Edit courthouse').should('exist');

    cy.a11y();
  });
});
