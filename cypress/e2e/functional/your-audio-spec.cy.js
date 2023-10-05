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
    cy.get('app-tabs').should('contain', 'Current');
    cy.get('app-tabs').should('contain', 'Expired');
  });

  it('has "In progress" table', () => {
    cy.contains('Your Audio').click();
    cy.get('#inProgressTable').should('contain', 'T20200190');
  });

  it('has "Ready" table', () => {
    cy.contains('Your Audio').click();
    cy.get('#readyTable').should('contain', 'T20200333');
  });

  it('shows no audio requests message', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/audio-requests*',
      },
      []
    ).as('getAudioRequests');

    cy.contains('Your Audio').click();

    cy.get('p').should('contain', 'There are no audio files in progress or ready');
  });
});
