import 'cypress-axe';
import './commands';
const path = require('path');
const downloadsFolder = Cypress.config('downloadsFolder');
const navigationSelector = '.moj-primary-navigation';

describe('Your audio', () => {
  beforeEach(() => {
    cy.login();
    cy.injectAxe();
  });

  it('has title', () => {
    cy.contains('Your audio').click();
    cy.get('h1').should('contain', 'Your audio');
  });

  it('has tabs', () => {
    cy.contains('Your audio').click();
    cy.get('.moj-sub-navigation__list').should('contain', 'Current');
    cy.get('.moj-sub-navigation__list').should('contain', 'Expired');
  });

  it('has "In progress" table', () => {
    cy.contains('Your audio').click();
    cy.get('#inProgressTable').should('contain', 'C1');
  });

  it('has "Ready" table', () => {
    cy.contains('Your audio').click();
    cy.get('#readyTable').should('contain', 'C3');

    cy.a11y();
  });

  it('has "Expired" table', () => {
    cy.contains('Your audio').click();
    cy.contains('Expired').click();
    cy.get('#expiredTable').should('contain', 'C99');

    cy.a11y();
  });

  it('should show correct Notification badge count', () => {
    //On landing page
    cy.get('#unreadAudioCountNotifications').should('contain', '5');
    cy.contains('Your audio').click();
    //On specific Your audio page
    cy.get('#unreadAudioCountNotifications').should('contain', '5');
  });

  it('should show correct number of Unread icons', () => {
    cy.contains('Your audio').click();
    cy.get('#readyTable').get('.unread').should('have.length', 5);
  });

  it('should reduce Notification count and unread icons when View is clicked', () => {
    cy.contains('Your audio').click();
    cy.contains('C3').parents('tr').contains('View').click();

    cy.get('#unreadAudioCountNotifications').should('contain', '4');
  });

  it('View audio request and download', () => {
    cy.contains('Your audio').click();
    cy.contains('C3').parents('tr').contains('View').click();
    cy.contains('C3.zip').should('exist');
    cy.contains('Download audio file').click();
    cy.readFile(path.join(downloadsFolder, 'C3.zip')).should('exist');
  });

  it('View audio request and reject download due to permissions', () => {
    //T20200333 hardcoded in stub to return 403
    cy.contains('Your audio').click();
    cy.contains('C5_NoDownloadPermissions').parents('tr').contains('View').click();
    cy.contains('C5_NoDownloadPermissions.mp3').should('exist');
    cy.contains('Download audio file').click();
    cy.get('.govuk-error-summary').contains('You do not have permission to view this file');
    cy.get('.govuk-error-summary').contains('Email DTS-ITServiceDesk@justice.gov.uk to request access');
    cy.get('button.govuk-button').should('be.disabled');

    cy.a11y();
  });

  it('View audio request and delete', () => {
    cy.contains('Your audio').click();
    cy.contains('C6_ViewAndDeleteMe').parents('tr').find('.view-link').click();
    cy.contains('C6_ViewAndDeleteMe.mp3').should('exist');
    cy.contains('Delete audio file').click();
    cy.get(navigationSelector).should('not.exist');
    cy.contains('Are you sure you want to delete this item');
    cy.get('button.govuk-button--warning').click();
    cy.contains('C6_ViewAndDeleteMe').should('not.exist');
    cy.get(navigationSelector).should('exist');
  });

  it('View audio request and playback audio', () => {
    cy.contains('Your audio').click();
    cy.contains('C4_Playback').parents('tr').contains('View').click();
    cy.contains('C4_Playback.mp3').should('exist');

    // TO DO: fix intermittent failure
    // cy.get('audio').then(([audioEl]) => {
    //   expect(audioEl.paused).to.equal(true);
    // });

    cy.get('app-play-button').should('have.length', 5);
    cy.get('app-play-button').first().click();

    // cy.get('audio').then(([audioEl]) => {
    //   expect(audioEl.paused).to.equal(false);
    // });

    //click third play button to skip to 20 seconds
    cy.get('app-play-button').eq(2).click();
    //get current play time
    cy.get('audio').invoke('prop', 'currentTime').should('be.gt', 20);
  });

  it('should delete selected audio requests', () => {
    cy.contains('Your audio').click();
    cy.contains('DeleteMe').parents('tr').find('input[type="checkbox"]').click({ force: true });
    cy.get('#delete-button').click();
    cy.get(navigationSelector).should('not.exist');
    cy.contains('Are you sure you want to delete this item');
    cy.get('button.govuk-button--warning').click();
    cy.contains('DeleteMe').should('not.exist');
    cy.get(navigationSelector).should('exist');

    cy.a11y();
  });

  it('should clear failed audio requests', () => {
    cy.contains('Your audio').click();
    cy.contains('Clear').click();
    cy.get(navigationSelector).should('not.exist');
    cy.contains('Are you sure you want to delete this item');
    cy.get('button.govuk-button--warning').click();
    cy.contains('C2').should('not.exist');
    cy.get(navigationSelector).should('exist');
  });

  it('link back to case via audio request', () => {
    cy.contains('Your audio').click();
    cy.contains('C1').click();
    cy.get('h1.govuk-heading-l').contains('C20220620001');
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
        url: '/api/audio-requests/v2*',
      },
      { media_request_details: [], transformed_media_details: [] }
    ).as('getAudioRequests');

    cy.login();
  });

  it('shows no audio requests message and no notification badge', () => {
    cy.get('#unreadAudioCountNotifications').should('not.exist');
    cy.contains('Your audio').click();
    cy.get('#unreadAudioCountNotifications').should('not.exist');
    cy.get('p').should('contain', 'There are no audio files in progress or ready');
  });
});
