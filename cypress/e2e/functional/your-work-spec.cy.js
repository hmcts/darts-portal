import 'cypress-axe';
import './commands';

describe('Your work', () => {
  beforeEach(() => {
    cy.login();
    cy.injectAxe();
  });

  it('shows "Your work"', () => {
    cy.contains('Your work').click();
    cy.get('#transcription-count').should('contain', '5');
    cy.get('h1').should('contain', 'Your work');
    cy.a11y();
  });

  it('shows "To do" screen', () => {
    cy.contains('Your work').click();
    cy.get('h2').should('contain', 'To do');
    cy.get('#todoTable').should('contain', 'T2023453422');
    cy.get('#todoTable').should('contain', 'Reading');
    cy.get('#todoTable').should('contain', '06 Aug 2023');
    cy.get('#todoTable').should('contain', 'Court Log');
    cy.get('#todoTable').should('contain', '12 Aug 2023 13:00');
    cy.get('#todoTable').should('contain', 'Overnight');
    cy.get('#todoTable').should('contain', 'View');
    cy.a11y();
  });

  it('shows "Completed today" screen', () => {
    cy.contains('Your work').click();
    cy.contains('Completed today').click();
    cy.get('h2').should('contain', 'Completed today');
    cy.get('#completedTable').should('contain', 'T2023453436');
    cy.get('#completedTable').should('contain', 'Swansea');
    cy.get('#completedTable').should('contain', '10 Jun 2023');
    cy.get('#completedTable').should('contain', 'Court Log');
    cy.get('#completedTable').should('contain', '26 Jun 2023 13:00');
    cy.get('#completedTable').should('contain', 'Up to 3 working days');
    cy.get('#completedTable').should('contain', 'View');
    cy.a11y();
  });
});
