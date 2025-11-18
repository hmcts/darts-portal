import 'cypress-axe';
import './commands';

describe('Upload transcript', () => {
  describe('Manual transcript request', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/work/1');
      cy.injectAxe();
    });

    it('shows "Upload transcript screen"', () => {
      cy.get('h1').should('contain', 'Transcript request');
      cy.get('.govuk-hint').should('contain', 'Maximum file size 10MB');
      cy.get('.govuk-hint').should(
        'contain',
        'Compatible file formats are .txt, .dot, .dotx, .doc, .docx, .pdf, .rtf, .zip or .odt'
      );
      cy.a11y();
    });

    it('Complete flow (manual): upload then complete', () => {
      // Outcome should default to Complete; file upload visible
      cy.get('#outcome-complete').should('exist');
      cy.get('label[for="outcome-complete"]').should('be.visible');

      cy.get('#outcome-complete').should('be.checked');
      cy.get('input[type=file]').should('exist');

      // Upload a file
      cy.get('input[type=file]').selectFile({
        contents: Cypress.Buffer.from('file contents'),
        fileName: 'file.docx',
        lastModified: Date.now(),
      });

      // Button label should reflect "Complete"
      cy.get('#submit-button').should('contain', 'Attach file and complete');

      cy.get('#submit-button').click();

      // Lands on the complete outcome screen
      cy.url().should('match', /\/work\/1\/complete$/);
      cy.get('.govuk-panel__title').should('contain', 'Transcript request complete');
    });

    describe('Unfulfilled flow', () => {
      beforeEach(() => {
        // Switch to Unfulfilled
        cy.get('input#outcome-unfulfilled').check({ force: true });
        cy.get('#submit-button').should('contain', 'Mark as unfulfilled');
      });

      it('hides file upload & shows reason select', () => {
        cy.get('input[type=file]').should('not.exist');
        cy.get('#reason').should('exist').and('be.visible');
      });

      it('requires a reason on submit', () => {
        cy.get('#submit-button').click();
        cy.get('.govuk-error-message').should('contain', 'Select a reason to mark this request as unfulfilled');
      });

      it('does not require comment unless "Other" is selected', () => {
        cy.get('#reason').select('No audio / white noise');
        cy.get('#submit-button').click();

        // Should navigate to unfulfilled outcome (no comment needed)
        cy.url().should('match', /\/work\/1\/unfulfilled$/);
      });

      it('shows comment box only when "Other" is selected and enforces input', () => {
        cy.visit('/work/1'); // fresh page for isolation
        cy.get('input#outcome-unfulfilled').check({ force: true });

        cy.get('#reason').select('Other');
        cy.get('#details').should('exist');

        cy.get('#submit-button').click();
        cy.get('.govuk-error-message').should('contain', 'Enter the reason for the unfulfilled request');

        cy.get('#details').clear().type('Mic failure, no capture');
        cy.get('#submit-button').click();
        cy.url().should('match', /\/work\/1\/unfulfilled$/);
      });
    });

    it('"Get audio for request" button should navigate to hearing and prefill start and end time for audio request', () => {
      cy.get('#get-audio-button').click();

      cy.get('#start-time-hour-input').should('have.value', '14');
      cy.get('#start-time-minutes-input').should('have.value', '00');
      cy.get('#start-time-seconds-input').should('have.value', '00');

      cy.get('#end-time-hour-input').should('have.value', '17');
      cy.get('#end-time-minutes-input').should('have.value', '00');
      cy.get('#end-time-seconds-input').should('have.value', '00');
    });
  });

  describe('Visibility toggles', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/work/1');
    });

    it('file upload disappears when switching to Unfulfilled', () => {
      cy.get('input[type=file]').should('exist');
      cy.get('input#outcome-unfulfilled').check({ force: true });
      cy.get('input[type=file]').should('not.exist');
    });

    it('comment box disappears when changing away from "Other"', () => {
      cy.get('input#outcome-unfulfilled').check({ force: true });
      cy.get('#reason').select('Other');
      cy.get('#details').should('exist');

      cy.get('#reason').select('Inaudible / unintelligible');
      cy.get('#details').should('not.exist');
    });
  });

  describe('Upload transcript — automated request (/work/8)', () => {
    beforeEach(() => {
      cy.login();

      cy.visit('/work/8');
      cy.injectAxe();
    });

    it('shows automated guidance, hides file upload, shows correct button label', () => {
      cy.contains(
        '.govuk-body',
        'This is an automated request. Send the transcript using your usual process for an automated request.'
      ).should('be.visible');

      cy.get('input[type="file"]').should('not.exist');
      cy.get('#submit-button').should('contain', 'Complete transcript request');
      cy.a11y();
    });

    it('completes without requiring a file', () => {
      cy.get('#submit-button').click();
      cy.url().should('match', /\/work\/8\/complete$/);
    });

    it('unfulfilled path works and still hides file upload', () => {
      cy.get('#outcome-unfulfilled').check({ force: true });
      cy.get('input[type="file"]').should('not.exist');

      cy.get('#reason').select('No audio / white noise');
      cy.get('#submit-button').click();

      cy.url().should('match', /\/work\/8\/unfulfilled$/);
    });

    it('requires comment only when "Other" is selected', () => {
      cy.visit('/work/8');

      cy.get('#outcome-unfulfilled').check({ force: true });
      cy.get('#reason').select('Other');

      // Comment box appears only for "Other"
      cy.get('#details').should('exist');

      cy.get('#submit-button').click();
      cy.get('.govuk-error-message').should('contain', 'Enter the reason for the unfulfilled request');

      cy.get('#details').type('Automation service outage');
      cy.get('#submit-button').click();
      cy.url().should('match', /\/work\/8\/unfulfilled$/);
    });
  });

  after(() => {
    cy.request('/api/transcriptions/reset');
  });
});
