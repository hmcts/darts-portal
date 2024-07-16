import 'cypress-axe';
import '../commands';

describe('Admin - Audio file details screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/audio-file/1');
    cy.injectAxe();
  });

  describe('Basic details', () => {
    it('elements', () => {
      cy.get('app-govuk-heading h1').contains('1');
      cy.get('app-govuk-heading .caption').contains('Audio file');

      cy.get('#basic-details app-govuk-heading h2').contains('Basic details');

      cy.get('dt').contains('Courthouse').next('dd').should('contain', 'Cardiff');
      cy.get('dt').contains('Courtroom').next('dd').should('contain', 'Courtroom 1');
      cy.get('dt').contains('Start time').next('dd').should('contain', '11 Jun 2024 at 10:55:18AM');
      cy.get('dt').contains('End time').next('dd').should('contain', '11 Jun 2024 at 11:55:18AM');
      cy.get('dt').contains('Channel number').next('dd').should('contain', '4');
      cy.get('dt').contains('Total channels').next('dd').should('contain', '16');
      cy.get('dt').contains('Media type').next('dd').should('contain', 'Audio');
      cy.get('dt').contains('File type').next('dd').should('contain', 'MP3');
      cy.get('dt').contains('File size').next('dd').should('contain', '117.74MB');
      cy.get('dt').contains('Filename').next('dd').should('contain', 'filename.mp3');
      cy.get('dt').contains('Date created').next('dd').should('contain', '11 Jun 2024 at 6:55:18PM');

      cy.get('#associated-cases app-govuk-heading h2').contains('Associated cases');

      cy.get('td')
        .contains('0')
        .parent()
        .next('td')
        .should('contain', '20 Feb 2020')
        .next('td')
        .should('contain', 'Defendant Dave')
        .next('td')
        .should('contain', 'Judge Judy');

      cy.a11y();
    });
  });

  describe('Advanced details', () => {
    it('elements', () => {
      cy.get('.moj-sub-navigation__link').contains('Advanced details').click();

      cy.get('app-govuk-heading h2').contains('Advanced details');

      cy.get('dt').contains('Media object ID').next('dd').should('contain', '123');
      cy.get('dt').contains('Content object ID').next('dd').should('contain', '456');
      cy.get('dt').contains('Clip ID').next('dd').should('contain', '789');
      cy.get('dt').contains('Checksum').next('dd').should('contain', '2963841');
      cy.get('dt').contains('Media status').next('dd').should('contain', 'media status');
      cy.get('dt').contains('Audio hidden?').next('dd').should('contain', 'Yes');
      cy.get('dt').contains('Hidden by').next('dd').should('contain', 'Trina Gulliver');
      cy.get('dt').contains('Date hidden').next('dd').should('contain', '11 Jun 2024 at 8:55:18AM');
      cy.get('dt').contains('Audio deleted?').next('dd').should('contain', 'Yes');
      cy.get('dt').contains('Date deleted').next('dd').should('contain', '11 Jun 2024 at 8:55:18AM');
      cy.get('dt').contains('Deleted by').next('dd').should('contain', 'Michael van Gerwen');

      cy.get('#version-details h2').contains('Version data');

      cy.get('dt').contains('Version').next('dd').should('contain', 'v2');
      cy.get('dt').contains('Chronicle ID').next('dd').should('contain', '33');
      cy.get('dt').contains('Antecedent ID').next('dd').should('contain', '44');
      cy.get('dt').contains('Retain until').next('dd').should('contain', '11 Jun 2030 at 8:55:18AM');
      cy.get('dt').contains('Created by').next('dd').should('contain', 'Eric Bristow');
      cy.get('dt').contains('Date created').next('dd').should('contain', '11 Jun 2024 at 6:55:18PM');
      cy.get('dt').contains('Last modified by').next('dd').should('contain', 'Fallon Sherrock');
      cy.get('dt').contains('Date last modified').next('dd').should('contain', '03 Mar 2023 at 3:30:18AM');

      cy.a11y();
    });
  });

  describe('Hidden file banner', () => {
    it('elements', () => {
      cy.get('app-hidden-file-banner').contains('This file is hidden in DARTS and is marked for manual deletion');
      cy.get('app-hidden-file-banner').contains(
        'DARTS user cannot view this file. You can unmark for deletion and it will no longer be hidden.'
      );
      cy.get('app-hidden-file-banner').contains('Marked for manual deletion by - Michael van Gerwen');
      cy.get('app-hidden-file-banner').contains('Reason - Classified above official');
      cy.get('app-hidden-file-banner').contains('ref123 - This is a test comment');

      cy.a11y();
    });
  });
});
