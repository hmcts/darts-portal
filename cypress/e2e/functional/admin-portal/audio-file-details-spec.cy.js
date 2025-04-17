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

      cy.a11y();
    });

    it('should display the associated cases table with correct data', () => {
      cy.get('#associated-cases').within(() => {
        cy.contains('h2', 'Associated cases').should('be.visible');

        cy.get('table.govuk-table thead tr').within(() => {
          cy.get('th').eq(0).should('contain.text', 'Case ID');
          cy.get('th').eq(1).should('contain.text', 'Courthouse');
          cy.get('th').eq(2).should('contain.text', 'Source');
        });

        cy.get('table.govuk-table tbody tr')
          .eq(0)
          .within(() => {
            cy.get('.case-id').should('contain.text', 'CASE1');
            cy.get('.courthouse').should('contain.text', 'Courthouse 321');
            cy.get('.source').should('contain.text', 'Add Audio Metadata');
          });

        cy.get('table.govuk-table tbody tr')
          .eq(1)
          .within(() => {
            cy.get('.case-id a')
              .should('have.attr', 'href', '/admin/case/1?backUrl=%2Fadmin%2Faudio-file%2F1')
              .and('contain.text', 'CASE2');
            cy.get('.courthouse').should('contain.text', 'Courthouse 123');
            cy.get('.source').should('contain.text', 'Source Type 3');
          });
      });

      it('should display the associated hearings table with correct data', () => {
        cy.get('#associated-hearings').within(() => {
          cy.contains('h2', 'Associated hearings').should('be.visible');

          cy.get('table.govuk-table thead tr').within(() => {
            cy.get('th').eq(0).should('contain.text', 'Case ID');
            cy.get('th').eq(1).should('contain.text', 'Hearing date');
            cy.get('th').eq(2).should('contain.text', 'Courthouse');
            cy.get('th').eq(3).should('contain.text', 'Courtroom');
          });

          cy.get('table.govuk-table tbody tr')
            .eq(0)
            .within(() => {
              cy.get('.case-id a')
                .should('have.attr', 'href', '/admin/case/0?backUrl=%2Fadmin%2Faudio-file%2F1')
                .and('contain.text', 'CASE1');
              cy.get('.hearing-date a')
                .should('have.attr', 'href', '/admin/case/0/hearing/0?backUrl=%2Fadmin%2Faudio-file%2F1')
                .and('contain.text', '11 Jun 2024');
              cy.get('td').eq(2).should('contain.text', 'Courthouse 321');
              cy.get('td').eq(3).should('contain.text', 'Courtroom 1');
            });

          cy.get('table.govuk-table tbody tr')
            .eq(1)
            .within(() => {
              cy.get('.case-id a')
                .should('have.attr', 'href', '/admin/case/1?backUrl=%2Fadmin%2Faudio-file%2F1')
                .and('contain.text', 'CASE2');
              cy.get('.hearing-date a')
                .should('have.attr', 'href', '/admin/case/1/hearing/1?backUrl=%2Fadmin%2Faudio-file%2F1')
                .and('contain.text', '11 Jun 2024');
              cy.get('td').eq(2).should('contain.text', 'Courthouse 123');
              cy.get('td').eq(3).should('contain.text', 'Courtroom 2');
            });
        });
      });
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
      cy.get('dt').contains('Is current?').next('dd').should('contain', 'Yes');
      cy.get('dt').contains('Date deleted').next('dd').should('contain', '11 Jun 2024 at 8:55:18AM');
      cy.get('dt').contains('Deleted by').next('dd').should('contain', 'Michael van Gerwen');

      cy.get('.versions-heading').within(() => {
        cy.get('h2').should('contain.text', 'Version data');
        cy.get('a').should('contain.text', 'Show versions');
      });

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

    it('Show all versions', () => {
      cy.get('.moj-sub-navigation__link').contains('Advanced details').click();
      cy.get('.versions-heading a').should('contain.text', 'Show versions').click();

      cy.url().should('include', '/admin/audio-file/1/versions');

      cy.get('.govuk-back-link').should('contain.text', 'Back');

      cy.get('h1.govuk-heading-l').should('contain.text', 'All versions of this audio');

      cy.get('h2.govuk-heading-s').should('contain.text', 'Chronicle ID');
      cy.get('#chronicleId').should('contain.text', 'chronicle_456');

      cy.get('h2.govuk-heading-m').contains('Current version').should('be.visible');
      cy.get('app-data-table')
        .first()
        .within(() => {
          cy.get('caption').should('contain.text', 'Current version of this audio');
          cy.get('thead').within(() => {
            cy.get('th').eq(0).should('contain.text', 'Audio ID');
            cy.get('th').eq(1).should('contain.text', 'Courthouse');
            cy.get('th').eq(2).should('contain.text', 'Courtroom');
            cy.get('th').eq(3).should('contain.text', 'Start time');
            cy.get('th').eq(4).should('contain.text', 'End time');
            cy.get('th').eq(5).should('contain.text', 'Channel');
            cy.get('th').eq(6).should('contain.text', 'Antecedent ID');
            cy.get('th').eq(7).should('contain.text', 'Chronicle ID');
          });
          cy.get('tbody tr').within(() => {
            cy.get('td').eq(0).should('contain.text', '101');
            cy.get('td').eq(1).should('contain.text', 'London Crown Court');
            cy.get('td').eq(2).should('contain.text', 'Courtroom A');
            cy.get('td').eq(3).should('contain.text', '11 Jun 2024 at 09:30:00');
            cy.get('td').eq(4).should('contain.text', '11 Jun 2024 at 10:15:00');
            cy.get('td').eq(5).should('contain.text', '3');
            cy.get('td').eq(6).should('contain.text', 'antecedent_789');
            cy.get('td').eq(7).should('contain.text', 'chronicle_456');
          });
        });

      cy.get('h2.govuk-heading-m').contains('Previous versions').should('be.visible');
      cy.get('app-data-table')
        .last()
        .within(() => {
          cy.get('caption').should('contain.text', 'Previous versions of this audio');
          cy.get('thead').within(() => {
            cy.get('th').eq(0).should('contain.text', 'Audio ID');
            cy.get('th').eq(1).should('contain.text', 'Courthouse');
            cy.get('th').eq(2).should('contain.text', 'Courtroom');
            cy.get('th').eq(3).should('contain.text', 'Start time');
            cy.get('th').eq(4).should('contain.text', 'End time');
            cy.get('th').eq(5).should('contain.text', 'Channel');
            cy.get('th').eq(6).should('contain.text', 'Antecedent ID');
            cy.get('th').eq(7).should('contain.text', 'Chronicle ID');
          });

          cy.get('tbody tr')
            .eq(0)
            .within(() => {
              cy.get('td').eq(1).should('contain.text', '100');
              cy.get('td').eq(2).should('contain.text', 'London Crown Court');
              cy.get('td').eq(3).should('contain.text', 'Courtroom B');
              cy.get('td').eq(4).should('contain.text', '10 Jun 2024 at 15:00:00');
              cy.get('td').eq(5).should('contain.text', '10 Jun 2024 at 15:45:00');
              cy.get('td').eq(6).should('contain.text', '2');
              cy.get('td').eq(7).should('contain.text', 'antecedent_456');
              cy.get('td').eq(8).should('contain.text', 'chronicle_123');
            });

          cy.get('tbody tr')
            .eq(1)
            .within(() => {
              cy.get('td').eq(1).should('contain.text', '101');
              cy.get('td').eq(2).should('contain.text', 'London Crown Court');
              cy.get('td').eq(3).should('contain.text', 'Courtroom B');
              cy.get('td').eq(4).should('contain.text', '10 Jun 2024 at 15:00:00');
              cy.get('td').eq(5).should('contain.text', '10 Jun 2024 at 15:45:00');
              cy.get('td').eq(6).should('contain.text', '2');
              cy.get('td').eq(7).should('contain.text', 'antecedent_456');
              cy.get('td').eq(8).should('contain.text', 'chronicle_123');
            });
        });

      cy.get('a.govuk-link').contains('Back').should('be.visible').click();

      cy.url().should('eq', Cypress.config().baseUrl + '/admin/audio-file/1');
    });

    it('Sets new current version', () => {
      cy.visit('/admin/audio-file/3/versions?backUrl=%2Fadmin%2Faudio-file%2F3');

      cy.get('#previousVersionsTable .govuk-table__row:nth-child(1) .govuk-checkboxes__item').click();

      cy.get('#setVersionButton').click();

      //Verify elements
      cy.contains(
        'h1.govuk-heading-l',
        'Are you sure you want to make this the current version of the audio file?'
      ).should('be.visible');

      cy.contains('dt', 'Audio ID').next('dd').should('contain.text', '100');
      cy.contains('dt', 'Courthouse').next('dd').should('contain.text', 'Cardiff');
      cy.contains('dt', 'Courtroom').next('dd').should('contain.text', 'Courtroom 1');
      cy.contains('dt', 'Start time').next('dd').should('contain.text', '11 Jun 2024 at 11:55:18AM');
      cy.contains('dt', 'End time').next('dd').should('contain.text', '11 Jun 2024 at 11:55:18AM');
      cy.contains('dt', 'Channel number').next('dd').should('contain.text', '4');
      cy.contains('dt', 'Total channels').next('dd').should('contain.text', '16');
      cy.contains('dt', 'Media type').next('dd').should('contain.text', 'Audio');
      cy.contains('dt', 'File type').next('dd').should('contain.text', 'Audio');
      cy.contains('dt', 'File size').next('dd').should('contain.text', '117.74MB');
      cy.contains('dt', 'Filename').next('dd').should('contain.text', 'filename.mp3');
      cy.contains('dt', 'Date created').next('dd').should('contain.text', '11 Jun 2024 at 6:55:18PM');

      cy.get('#confirm-button').should('contain.text', 'Confirm');
      cy.get('#cancel-link').should('have.attr', 'href', '/admin/audio-file/3/versions').and('contain.text', 'Cancel');

      cy.get('#confirm-button').click();

      cy.get('.moj-banner--success').should('contain.text', 'Audio version updated');
    });
  });

  describe('Hidden file banner', () => {
    it('elements', () => {
      cy.get('app-hidden-file-banner').contains('This file is hidden in DARTS and is marked for manual deletion');
      cy.get('app-hidden-file-banner').contains(
        'DARTS user cannot view this file. You can unmark for deletion and it will no longer be hidden.'
      );
      cy.get('app-hidden-file-banner').contains('Marked for manual deletion by - Trina Gulliver');
      cy.get('app-hidden-file-banner').contains('Reason - Classified above official');
      cy.get('app-hidden-file-banner').contains('ref123 - This is a test comment');

      cy.a11y();
    });
  });

  describe('Expired banner', () => {
    it('elements', () => {
      cy.visit('/admin/audio-file/2');

      cy.get('app-expired-banner').contains(
        'Expired: This case has passed its retention date on 2 Feb 2022. Data was deleted in line with HMCTS policy.'
      );
    });
  });
});
