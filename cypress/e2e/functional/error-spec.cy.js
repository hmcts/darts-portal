import 'cypress-axe';
import './commands';

describe('Error page handling', () => {
  beforeEach(() => {
    cy.login();
    cy.injectAxe();
  });

  it('should show in-component error for INTERNAL_SERVER_ERROR search', () => {
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('#case_number').type('INTERNAL_SERVER_ERROR');
    cy.get('button').contains('Search').click();
    cy.get('h2').should('contain', 'An error has occurred');
    cy.get('.govuk-body').should('contain', 'Try again or contact Crown IT Support if the problem persists');
    cy.a11y();
  });

  it('should show full-page error for 500 responses', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/audio-requests/v2*',
      },
      {
        statusCode: 500,
      }
    ).as('getAudioRequests');

    cy.visit('/audios');
    cy.injectAxe();

    cy.wait('@getAudioRequests').then((interception) => {
      const response = interception.response;

      expect(response.statusCode).to.equal(500);
      cy.get('h1').should('contain', 'There is a problem with the service');
      cy.get('p').should('contain', 'Try again or contact Crown IT Support if the problem persists');
      cy.get('.moj-primary-navigation').should('not.exist');
      cy.a11y();
    });
  });
});
