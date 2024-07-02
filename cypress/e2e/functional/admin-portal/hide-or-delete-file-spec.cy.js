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

      cy.get('#success-message').contains('File(s) successfully hidden or marked for deletion');
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

      cy.get('.govuk-button').contains('Continue').click();
      cy.get('.govuk-list.govuk-error-summary__list').contains('Choose if you want to include associated files or not');
      cy.get('.govuk-error-message').contains('Select files to include');

      cy.a11y();
    });

    it('Hide or delete file audio file', () => {
      cy.get('.govuk-button').contains('Hide or delete').click();

      cy.get('#reason-2').check();

      cy.get('#ticketReference').type('TR120001');

      cy.get('#comments').type('This is a test comment');

      cy.get('.govuk-button').contains('Hide or delete').click();

      cy.get('.govuk-heading-l').contains(
        'There are other audio files associated with the file you are hiding and/or deleting'
      );

      cy.get('.govuk-heading-m').contains('The file you are hiding and/or deleting');

      cy.get('#hideFileTable .govuk-table__row').eq(1).find('.govuk-table__cell').eq(0).should('contain', '0');
      cy.get('#hideFileTable .govuk-table__row').eq(1).find('.govuk-table__cell').eq(1).should('contain', '001');
      cy.get('#hideFileTable .govuk-table__row')
        .eq(1)
        .find('.govuk-table__cell')
        .eq(2)
        .should('contain', '01 Jun 2020');
      cy.get('#hideFileTable .govuk-table__row')
        .eq(1)
        .find('.govuk-table__cell')
        .eq(3)
        .should('contain', 'courthouse 12');
      cy.get('#hideFileTable .govuk-table__row').eq(1).find('.govuk-table__cell').eq(4).should('contain', '6:00PM');
      cy.get('#hideFileTable .govuk-table__row').eq(1).find('.govuk-table__cell').eq(5).should('contain', '7:00PM');
      cy.get('#hideFileTable .govuk-table__row')
        .eq(1)
        .find('.govuk-table__cell')
        .eq(6)
        .should('contain', 'courtroom 11');
      cy.get('#hideFileTable .govuk-table__row').eq(1).find('.govuk-table__cell').eq(7).should('contain', '1');

      cy.get('#associatedAudioTable .govuk-table__row').eq(1).find('.govuk-table__cell').eq(1).should('contain', '1');
      cy.get('#associatedAudioTable .govuk-table__row').eq(1).find('.govuk-table__cell').eq(2).should('contain', '123');
      cy.get('#associatedAudioTable .govuk-table__row')
        .eq(1)
        .find('.govuk-table__cell')
        .eq(3)
        .should('contain', '01 Jun 2020');
      cy.get('#associatedAudioTable .govuk-table__row')
        .eq(1)
        .find('.govuk-table__cell')
        .eq(4)
        .should('contain', 'courthouse 1');
      cy.get('#associatedAudioTable .govuk-table__row')
        .eq(1)
        .find('.govuk-table__cell')
        .eq(5)
        .should('contain', '6:00PM');
      cy.get('#associatedAudioTable .govuk-table__row')
        .eq(1)
        .find('.govuk-table__cell')
        .eq(6)
        .should('contain', '7:00PM');
      cy.get('#associatedAudioTable .govuk-table__row')
        .eq(1)
        .find('.govuk-table__cell')
        .eq(7)
        .should('contain', 'courtroom 1');
      cy.get('#associatedAudioTable .govuk-table__row').eq(1).find('.govuk-table__cell').eq(8).should('contain', '1');

      cy.get('#associatedAudioTable .govuk-checkboxes__input').eq(1).check();
      cy.get('#associatedAudioTable .govuk-checkboxes__input').eq(2).check();
      cy.get('#associatedAudioTable .govuk-checkboxes__input').eq(3).check();

      cy.get('#do-include').click();

      cy.a11y();

      cy.get('.govuk-button').contains('Continue').click();

      cy.get('#success-message').contains('File(s) successfully hidden or marked for deletion');
    });
  });
});
