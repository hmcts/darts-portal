import 'cypress-axe';
import './commands';

describe('Upload transcript', () => {
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

  it('should upload file', () => {
    cy.get('input[type=file]').selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName: 'file.docx',
      lastModified: Date.now(),
    });

    cy.get('#submit-button').click();

    cy.get('.govuk-panel__title').should('contain', 'Transcript request complete');
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

  after(() => {
    cy.request('/api/transcriptions/reset');
  });
});
