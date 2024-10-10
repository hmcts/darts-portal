import 'cypress-axe';
import '../commands';
describe('Admin - Groups screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/file-deletion');
    cy.injectAxe();
  });

  it('load page', () => {
    cy.get('h1').should('contain', 'Files marked for deletion');
    cy.a11y();
  });
  describe('Audio files tab', () => {
    it('load results', () => {
      cy.get('h2').should('contain', 'Audio files');

      cy.get('.govuk-table__header').should('have.length', 10);
      cy.get('.govuk-table__header').eq(0).should('contain', 'Audio ID');
      cy.get('.govuk-table__header').eq(1).should('contain', 'Courthouse');
      cy.get('.govuk-table__header').eq(2).should('contain', 'Hearing date');
      cy.get('.govuk-table__header').eq(3).should('contain', 'Start time');
      cy.get('.govuk-table__header').eq(4).should('contain', 'End time');
      cy.get('.govuk-table__header').eq(5).should('contain', 'Courtroom');
      cy.get('.govuk-table__header').eq(6).should('contain', 'Channel');
      cy.get('.govuk-table__header').eq(7).should('contain', 'Marked by');
      cy.get('.govuk-table__header').eq(8).should('contain', 'Comments');

      cy.get('.govuk-table__row').should('have.length', 4);
      cy.get('.govuk-table__row').eq(1).should('contain', '0');
      cy.get('.govuk-table__row').eq(2).should('contain', '1');
      cy.get('.govuk-table__row').eq(3).should('contain', '3');

      cy.get('.govuk-table__body .govuk-table__row').each(($row) => {
        cy.wrap($row).find('.govuk-button.govuk-button--secondary').should('contain', 'Delete');
      });
    });

    it('should reject same marked user deletion', () => {
      cy.get('.govuk-table__row').eq(3).find('.govuk-button.govuk-button--secondary').click();

      cy.get('.govuk-heading-l').should('contain', 'You cannot delete this audio file');
    });

    it('should delete file', () => {
      cy.get('.govuk-table__row').eq(2).find('.govuk-button.govuk-button--secondary').click();

      cy.get('.govuk-heading-xl').should('contain', 'Delete audio file');

      cy.get('.govuk-table__header').should('have.length', 9);
      cy.get('.govuk-table__header').eq(0).should('contain', 'Audio ID');
      cy.get('.govuk-table__header').eq(1).should('contain', 'Courthouse');
      cy.get('.govuk-table__header').eq(2).should('contain', 'Hearing date');
      cy.get('.govuk-table__header').eq(3).should('contain', 'Start time');
      cy.get('.govuk-table__header').eq(4).should('contain', 'End time');
      cy.get('.govuk-table__header').eq(5).should('contain', 'Courtroom');
      cy.get('.govuk-table__header').eq(6).should('contain', 'Channel');
      cy.get('.govuk-table__header').eq(7).should('contain', 'Marked by');
      cy.get('.govuk-table__header').eq(8).should('contain', 'Comments');

      cy.get('.govuk-table__row').should('have.length', 2);
      cy.get('.govuk-table__row').eq(1).should('contain', '1');

      cy.get('#approve-option').click();

      cy.get('#confirm-button').click();

      cy.get('#success-message').should('contain', 'Audio file deleted');
    });

    it('should reject and unhide file', () => {
      cy.get('.govuk-table__row').eq(2).find('.govuk-button.govuk-button--secondary').click();

      cy.get('.govuk-heading-xl').should('contain', 'Delete audio file');

      cy.get('.govuk-table__header').should('have.length', 9);
      cy.get('.govuk-table__header').eq(0).should('contain', 'Audio ID');
      cy.get('.govuk-table__header').eq(1).should('contain', 'Courthouse');
      cy.get('.govuk-table__header').eq(2).should('contain', 'Hearing date');
      cy.get('.govuk-table__header').eq(3).should('contain', 'Start time');
      cy.get('.govuk-table__header').eq(4).should('contain', 'End time');
      cy.get('.govuk-table__header').eq(5).should('contain', 'Courtroom');
      cy.get('.govuk-table__header').eq(6).should('contain', 'Channel');
      cy.get('.govuk-table__header').eq(7).should('contain', 'Marked by');
      cy.get('.govuk-table__header').eq(8).should('contain', 'Comments');

      cy.get('.govuk-table__row').should('have.length', 2);
      cy.get('.govuk-table__row').eq(1).should('contain', '1');

      cy.get('#reject-unhide-option').click();

      cy.get('#confirm-button').click();

      cy.get('#success-message').should('contain', 'Audio file unmarked for deletion and unhidden');
    });
  });
  describe('Transcripts tab', () => {
    beforeEach(() => {
      cy.get('#transcript-files-deletion-tab').click();
    });

    it('load results', () => {
      cy.get('h2').should('contain', 'Transcripts');

      cy.get('.govuk-table__header').should('have.length', 8);
      cy.get('.govuk-table__header').eq(0).should('contain', 'Transcript ID');
      cy.get('.govuk-table__header').eq(1).should('contain', 'Case ID');
      cy.get('.govuk-table__header').eq(2).should('contain', 'Hearing date');
      cy.get('.govuk-table__header').eq(3).should('contain', 'Courthouse');
      cy.get('.govuk-table__header').eq(4).should('contain', 'Courtroom');
      cy.get('.govuk-table__header').eq(5).should('contain', 'Marked by');
      cy.get('.govuk-table__header').eq(6).should('contain', 'Comments');

      cy.get('.govuk-table__row').should('have.length', 3);
      cy.get('.govuk-table__row').eq(1).should('contain', '1');
      cy.get('.govuk-table__row').eq(2).should('contain', '2');

      cy.get('td a')
        .contains('1')
        .parent()
        .next('td')
        .should('contain', 'C0001')
        .next('td')
        .contains('1 Jan 2021')
        .next('td')
        .contains('Cardiff')
        .next('td')
        .contains('Courtroom 1')
        .next('td')
        .contains('Eric Bristow')
        .next('td')
        .contains('Public interest immunity REF123 Lorem ipsum dolor sit comment');

      cy.get('.govuk-table__body .govuk-table__row').each(($row) => {
        cy.wrap($row).find('.govuk-button.govuk-button--secondary').should('contain', 'Delete');
      });
    });

    it('should reject same marked user deletion', () => {
      cy.get('.govuk-table__row').eq(2).find('.govuk-button.govuk-button--secondary').click();

      cy.get('.govuk-heading-l').should('contain', 'You cannot delete this transcript file');
    });

    it('should validate required input', () => {
      cy.get('.govuk-table__row').eq(1).find('.govuk-button.govuk-button--secondary').click();

      cy.get('#confirm-button').click();

      cy.get('.govuk-error-message').should('contain', 'Select your decision');
      cy.get('.govuk-error-summary__list').should('contain', 'Select your decision');
    });

    it('should delete file', () => {
      cy.get('.govuk-table__row').eq(1).find('.govuk-button.govuk-button--secondary').click();

      cy.get('.govuk-heading-xl').should('contain', 'Delete transcript file');

      cy.get('.govuk-table__header').should('have.length', 6);
      cy.get('.govuk-table__header').eq(0).should('contain', 'Transcript ID');
      cy.get('.govuk-table__header').eq(1).should('contain', 'Case ID');
      cy.get('.govuk-table__header').eq(2).should('contain', 'Courthouse');
      cy.get('.govuk-table__header').eq(3).should('contain', 'Hearing date');
      cy.get('.govuk-table__header').eq(4).should('contain', 'Marked by');
      cy.get('.govuk-table__header').eq(5).should('contain', 'Comments');

      cy.get('.govuk-table__row').should('have.length', 2);
      cy.get('.govuk-table__row').eq(1).should('contain', '1');

      cy.get('#approve-option').click();

      cy.get('#confirm-button').click();

      cy.get('#success-message').should('contain', 'Transcript file deleted');
    });

    it('should reject and unhide file', () => {
      cy.get('.govuk-table__row').eq(1).find('.govuk-button.govuk-button--secondary').click();

      cy.get('.govuk-heading-xl').should('contain', 'Delete transcript file');

      cy.get('.govuk-table__header').should('have.length', 6);
      cy.get('.govuk-table__header').eq(0).should('contain', 'Transcript ID');
      cy.get('.govuk-table__header').eq(1).should('contain', 'Case ID');
      cy.get('.govuk-table__header').eq(2).should('contain', 'Courthouse');
      cy.get('.govuk-table__header').eq(3).should('contain', 'Hearing date');
      cy.get('.govuk-table__header').eq(4).should('contain', 'Marked by');
      cy.get('.govuk-table__header').eq(5).should('contain', 'Comments');

      cy.get('.govuk-table__row').should('have.length', 2);
      cy.get('.govuk-table__row').eq(1).should('contain', '1');

      cy.get('#reject-unhide-option').click();

      cy.get('#confirm-button').click();

      cy.get('#success-message').should('contain', 'Transcript file unmarked for deletion and unhidden');
    });
  });
});
