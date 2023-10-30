import './commands';
const path = require('path');
const downloadsFolder = Cypress.config('downloadsFolder');
const navigationSelector = '.moj-primary-navigation';

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
  });

  it('View audio request and download', () => {
    cy.contains('Your Audio').click();
    cy.contains('T20200331').parents('tr').contains('View').click();
    cy.contains('T20200331.zip').should('exist');
    cy.contains('Download audio file').click();
    cy.readFile(path.join(downloadsFolder, 'T20200331.zip')).should('exist');
  });

  it('View audio request and reject download due to permissions', () => {
    //T20200333 hardcoded in stub to return 403
    cy.contains('Your Audio').click();
    cy.contains('T20200333').parents('tr').contains('View').click();
    cy.contains('T20200333.zip').should('exist');
    cy.contains('Download audio file').click();
    cy.get('.govuk-error-summary').contains('You do not have permission to view this file');
    cy.get('.govuk-error-summary').contains('Email crownITsupport@justice.gov.uk to request access');
    cy.get('button.govuk-button').should('be.disabled');
  });

  it('View audio request and delete', () => {
    cy.contains('Your Audio').click();
    cy.contains('T20200334').parents('tr').contains('View').click();
    cy.contains('T20200334.zip').should('exist');
    cy.contains('Delete audio file').click();
    cy.get(navigationSelector).should('not.exist');
    cy.contains('Are you sure you want to delete this item');
    cy.get('button.govuk-button--warning').click();
    cy.contains('T20200334').should('not.exist');
    cy.get(navigationSelector).should('exist');
  });

  it('should delete selected audio requests', () => {
    cy.contains('Your Audio').click();
    cy.get('#readyTable tbody input[type="checkbox"]').first().click();
    cy.get('#delete-button').click();
    cy.get(navigationSelector).should('not.exist');
    cy.contains('Are you sure you want to delete this item');
    cy.get('button.govuk-button--warning').click();
    cy.contains('T20200331').should('not.exist');
    cy.get(navigationSelector).should('exist');
  });

  it('should clear failed audio requests', () => {
    cy.contains('Your Audio').click();
    cy.contains('Clear').click();
    cy.get(navigationSelector).should('not.exist');
    cy.contains('Are you sure you want to delete this item');
    cy.get('button.govuk-button--warning').click();
    cy.contains('T20200192231').should('not.exist');
    cy.get(navigationSelector).should('exist');
  });

  it('link back to case via audio request', () => {
    cy.contains('Your Audio').click();
    cy.contains('T20200190').click();
    cy.get('h1.govuk-heading-l').contains('CASE1001');
  });
});

describe('No audio requests', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: 'api/audio-requests/not-accessed-count',
      },
      { count: 0 }
    ).as('not-accessed-count');

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
