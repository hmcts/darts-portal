import './commands';
describe('Your audio', () => {
  beforeEach(() => {
    cy.login();
  });

  it('has title', () => {
    cy.contains('Your Audio').click();
    cy.get('h1').should('contain', 'Your Audio');
  });

  it('has tabs', () => {
    cy.contains('Your Audio').click();
    cy.get('.moj-sub-navigation__list').should('contain', 'Current');
    cy.get('.moj-sub-navigation__list').should('contain', 'Expired');
  });

  it('has "In progress" table', () => {
    cy.contains('Your Audio').click();
    cy.get('#inProgressTable').should('contain', 'T20200190');
  });

  it('has "Ready" table', () => {
    cy.contains('Your Audio').click();
    cy.get('#readyTable').should('contain', 'T20200333');
  });

  it('has "Expired" table', () => {
    cy.contains('Your Audio').click();
    cy.contains('Expired').click();
    cy.get('#expiredTable').should('contain', 'T20202110');
  });

  it('should show correct Notification badge count', () => {
    //On landing page
    cy.get('#notifications').should('contain', '5');
    cy.contains('Your Audio').click();
    //On specific Your Audio page
    cy.get('#notifications').should('contain', '5');
  });

  it('should show correct number of Unread icons', () => {
    cy.contains('Your Audio').click();
    cy.get('#readyTable').get('.unread').should('have.length', 5);
  });

  it('should reduce Notification count and unread icons when View is clicked', () => {
    cy.contains('Your Audio').click();
    cy.contains('T20200331').parents('tr').contains('View').click();

    cy.get('#notifications').should('contain', '4');
    cy.get('#readyTable').get('.unread').should('have.length', 4);

    cy.contains('T2023453422').parents('tr').contains('View').click();

    cy.get('#notifications').should('contain', '3');
    cy.get('#readyTable').get('.unread').should('have.length', 3);

    cy.contains('Search').click();
    cy.get('#notifications').should('contain', '3');
  });
});

describe('Request Intercept tests', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/audio-requests*',
      },
      []
    ).as('getAudioRequests');

    cy.login();
  });

  it('shows no audio requests message and no notification badge', () => {
    cy.get('#notifications').should('not.exist');
    cy.contains('Your Audio').click();
    cy.get('#notifications').should('not.exist');
    cy.get('p').should('contain', 'There are no audio files in progress or ready');
  });
});
