import 'cypress-axe';
import '../commands';

describe('Admin - Hide or delete file', () => {
  beforeEach(() => {
    cy.login('admin');
  });

  describe('Transcripts - hide file', () => {
    beforeEach(() => {
      cy.visit('/admin/transcripts');
      cy.get('.moj-sub-navigation__link').contains('Completed transcripts').click();
      cy.get('.govuk-button').contains('Search').click();
      cy.get('.govuk-link').contains('0').click();
      cy.get('.govuk-button').contains('Hide or delete').click();

      cy.injectAxe();
    });

    it('Hide or delete file form components', () => {
      cy.get('.govuk-heading-l').contains('Hide or delete file');

      cy.get('.govuk-label.govuk-radios__label').contains('Public interest immunity');
      cy.get('#reason-hint-1').contains('File will be hidden and marked for deletion');
      cy.get('.govuk-label.govuk-radios__label').contains('Classified above official');
      cy.get('#reason-hint-2').contains('File will be hidden and marked for deletion');
      cy.get('.govuk-label.govuk-radios__label').contains('Other reason to delete');
      cy.get('#reason-hint-3').contains('File will be hidden and marked for deletion');
      cy.get('.govuk-label.govuk-radios__label').contains('Other reason to delete');
      cy.get('#reason-hint-5').contains('File will be hidden only');

      cy.get('.govuk-label').contains('Enter ticket reference');
      cy.get('#ticketReference').should('exist');
      cy.get('.govuk-label').contains('Comments');
      cy.get('#comments').should('exist');

      cy.a11y();
    });

    it('Hide or delete file validation errors', () => {
      cy.get('.govuk-button').contains('Hide or delete').click();

      cy.get('.govuk-error-message').contains('Provide details relating to this action');

      cy.get('.govuk-error-message').contains('Enter a ticket reference');

      cy.get('.govuk-error-message').contains('Select a reason for hiding and/or deleting the file');

      cy.get('.govuk-list.govuk-error-summary__list').contains('Provide details relating to this action');
      cy.get('.govuk-list.govuk-error-summary__list').contains('Enter a ticket reference');
      cy.get('.govuk-list.govuk-error-summary__list').contains('Select a reason for hiding and/or deleting the file');

      cy.a11y();
    });

    it('Hide or delete file validation errors', () => {
      cy.get('#reason-2').check();

      cy.get('#ticketReference').type('TR120001');

      cy.get('#comments').type('This is a test comment');

      cy.get('.govuk-button').contains('Hide or delete').click();

      cy.get('#success-message').contains('Files successfully hidden or marked for deletion');
      cy.get('.govuk-heading-l').contains('Check for associated files');
      cy.get('.govuk-body').contains(
        'There may be other associated audio or transcript files that also need hiding or deleting.'
      );

      cy.get('.govuk-button').contains('Continue').click();
      cy.a11y();

      cy.get('.caption.govuk-caption-l').contains('Transcript file');
      cy.get('.govuk-heading-l').contains('0');
    });
  });

  describe('Audio file - hide file associated audio', () => {
    beforeEach(() => {
      cy.visit('/admin/audio-file/0');

      cy.injectAxe();
    });

    it('Associated audio validation errors', () => {
      cy.get('.govuk-button').contains('Hide or delete').click();

      cy.get('#reason-2').check();

      cy.get('#ticketReference').type('TR120001');

      cy.get('#comments').type('This is a test comment');

      cy.get('.govuk-button').contains('Hide or delete').click();

      cy.get('#selectAll').uncheck();

      cy.get('.govuk-button').contains('Continue').click();
      cy.get('.govuk-list.govuk-error-summary__list').contains('Select files to include');
      cy.get('.govuk-error-message').contains('Select files to include');

      cy.a11y();
    });

    it('Hide or delete audio file with associated audio', () => {
      // When an audio file has associated audio files,
      // there is an extra step to select associated audio files to hide or delete
      cy.get('.govuk-button').contains('Hide or delete').click();
      cy.get('#reason-2').check();
      cy.get('#ticketReference').type('TR120001');
      cy.get('#comments').type('This is a test comment');
      cy.get('.govuk-button').contains('Hide or delete').click();

      cy.get('.govuk-heading-l').contains(
        'There are other audio files associated with the file you are hiding and/or deleting'
      );

      cy.get('.govuk-heading-m').contains('The files you are hiding and/or deleting');

      cy.get('#associatedAudioTable a')
        .contains('0')
        .parent()
        .next('td')
        .contains('courthouse 12')
        .next('td')
        .contains('courtroom 11')
        .next('td')
        .contains('1 Jun 2020 18:00:00')
        .next('td')
        .contains('1 Jun 2020 19:00:00')
        .next('td')
        .contains('1')
        .next('td')
        .contains('Yes');

      cy.a11y();

      cy.get('.govuk-button').contains('Continue').click();

      cy.get('#success-message').contains('Files successfully hidden or marked for deletion');
    });

    it('Hide or delete audio file with no associated audio', () => {
      // Simulate no associated audio files for the audio file,
      // so the extra step to select associated audio files is not shown
      cy.intercept(
        {
          method: 'GET',
          url: 'api/admin/medias',
        },
        []
      ).as('associated-medias');

      cy.get('.govuk-button').contains('Hide or delete').click();
      cy.get('#reason-2').check();
      cy.get('#ticketReference').type('TR120001');
      cy.get('#comments').type('This is a test comment');
      cy.get('.govuk-button').contains('Hide or delete').click();

      cy.get('.govuk-button').contains('Continue').click();

      cy.get('#success-message').contains('Files successfully hidden or marked for deletion');
    });
  });

  describe('Audio file - unhide file', () => {
    it('should unhide audio file via unhide button', () => {
      cy.visit('/admin/audio-file/11');
      cy.get('.govuk-button').contains('Unmark for deletion and unhide').click();
      cy.get('.govuk-notification-banner').should('not.exist');
      cy.get('.govuk-button').contains('Hide or delete').should('exist');

      cy.request('api/admin/medias/reset');
    });

    it('should unhide audio file via unhide link', () => {
      cy.visit('/admin/audio-file/11');
      cy.get('.govuk-notification-banner__body .govuk-link').contains('unmark for deletion').click();
      cy.get('.govuk-notification-banner').should('not.exist');
      cy.get('.govuk-button').contains('Hide or delete').should('exist');

      cy.request('api/admin/medias/reset');
    });
  });

  describe('Transcription document - unhide file', () => {
    it('should unhide transcript document via unhide button', () => {
      cy.visit('/admin/transcripts/document/11');
      cy.get('.govuk-button').contains('Unhide').click();
      cy.get('.govuk-notification-banner').should('not.exist');
      cy.get('.govuk-button').contains('Hide or delete').should('exist');
    });

    it('should unhide transcript document via unhide link', () => {
      cy.visit('/admin/transcripts/document/9');
      cy.get('.govuk-notification-banner__body .govuk-link').contains('unmark for deletion').click();
      cy.get('.govuk-notification-banner').should('not.exist');
      cy.get('.govuk-button').contains('Hide or delete').should('exist');
    });
  });

  after(() => {
    cy.request('api/admin/transcription-documents/reset');
    cy.request('api/admin/medias/reset');
  });
});
