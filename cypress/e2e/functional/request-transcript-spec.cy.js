import 'cypress-axe';
import './commands';

describe('Request Transcript', () => {
  beforeEach(() => {
    cy.login();
    cy.injectAxe();
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('#case_number').type('C20220620001');
    cy.get('button').contains('Search').click();

    cy.get('.govuk-table__row').contains('C20220620001');
    cy.get('a').contains('C20220620001').click();
    cy.get('h1').should('contain', 'C20220620001');

    cy.get('#hearingsTable a').contains('1 Sep 2023').click();
    cy.get('#hearing-transcripts-tab').click();
  });

  it('should get to hearing transcripts tab', () => {
    cy.get('.govuk-caption-l').should('contain', 'Hearing');
    cy.get('.govuk-heading-l').should('contain', '1 Sep 2023');
    cy.get('app-hearing-file').should('contain', 'Courthouse');
    cy.get('app-hearing-file').should('contain', 'Swansea');
    cy.get('app-hearing-file').should('contain', 'Courtroom');
    cy.get('app-hearing-file').should('contain', '3');
    cy.get('app-hearing-file').should('contain', 'Judge(s)');
    cy.get('app-hearing-file').should('contain', 'HHJ M. Hussain KC');
    cy.get('.flex-space-between > .govuk-heading-m').should('contain', 'Transcripts for this hearing');
    cy.get('.govuk-table__body > :nth-child(1) > :nth-child(1)').should('contain', 'Sentencing remarks');
    cy.get('.govuk-button').should('contain', 'Request a new transcript');
  });

  it('should get to the request transcript page', () => {
    cy.get('.govuk-caption-l').should('contain', 'Hearing');
    cy.get('.govuk-heading-l').should('contain', '1 Sep 2023');
    cy.get('app-hearing-file').should('contain', 'Courthouse');
    cy.get('app-hearing-file').should('contain', 'Swansea');
    cy.get('app-hearing-file').should('contain', 'Courtroom');
    cy.get('app-hearing-file').should('contain', '3');
    cy.get('app-hearing-file').should('contain', 'Judge(s)');
    cy.get('app-hearing-file').should('contain', 'HHJ M. Hussain KC');
    cy.get('.flex-space-between > .govuk-heading-m').should('contain', 'Transcripts for this hearing');
    cy.get('.govuk-table__body > :nth-child(1) > :nth-child(1)').should('contain', 'Sentencing remarks');
    cy.get('.govuk-button').should('contain', 'Request a new transcript');
    cy.get('.govuk-button').click();
    cy.get('app-govuk-heading').should('contain', 'Case ID');
    cy.get('app-govuk-heading').should('contain', 'C20220620001');

    cy.get('.govuk-label').should('contain', 'Request Type');
    cy.get('.govuk-label').should('contain', 'Urgency');
    cy.get('.govuk-table__body > :nth-child(1) > :nth-child(1)').should('contain', '03:32:24');
    cy.a11y();
  });

  it('should return to the hearing transcripts tab', () => {
    cy.get('.govuk-caption-l').should('contain', 'Hearing');
    cy.get('.govuk-heading-l').should('contain', '1 Sep 2023');
    cy.get('app-hearing-file').should('contain', 'Courthouse');
    cy.get('app-hearing-file').should('contain', 'Swansea');
    cy.get('app-hearing-file').should('contain', 'Courtroom');
    cy.get('app-hearing-file').should('contain', '3');
    cy.get('app-hearing-file').should('contain', 'Judge(s)');
    cy.get('app-hearing-file').should('contain', 'HHJ M. Hussain KC');

    cy.get('.flex-space-between > .govuk-heading-m').should('contain', 'Transcripts for this hearing');
    cy.get('.govuk-table__body > :nth-child(1) > :nth-child(1)').should('contain', 'Sentencing remarks');
    cy.get('.govuk-button').should('contain', 'Request a new transcript');
    cy.get('.govuk-button').click();
    cy.get('app-govuk-heading').should('contain', 'Case ID');
    cy.get('app-govuk-heading').should('contain', 'C20220620001');
    cy.get('.govuk-link').contains('Cancel').click();

    cy.get('.govuk-caption-l').should('contain', 'Hearing');
    cy.get('.govuk-heading-l').should('contain', '1 Sep 2023');
    cy.get('app-hearing-file').should('contain', 'Courthouse');
    cy.get('app-hearing-file').should('contain', 'Swansea');
    cy.get('app-hearing-file').should('contain', 'Courtroom');
    cy.get('app-hearing-file').should('contain', '3');
    cy.get('app-hearing-file').should('contain', 'Judge(s)');
    cy.get('app-hearing-file').should('contain', 'HHJ M. Hussain KC');
    cy.get('.flex-space-between > .govuk-heading-m').should('contain', 'Transcripts for this hearing');
    cy.get('.govuk-table__body > :nth-child(1) > :nth-child(1)').should('contain', 'Sentencing remarks');
    cy.get('.govuk-button').should('contain', 'Request a new transcript');
  });

  it("should show errors if the form isn't filled in", () => {
    cy.get('.govuk-caption-l').should('contain', 'Hearing');
    cy.get('.govuk-heading-l').should('contain', '1 Sep 2023');
    cy.get('app-hearing-file').should('contain', 'Courthouse');
    cy.get('app-hearing-file').should('contain', 'Swansea');
    cy.get('app-hearing-file').should('contain', 'Courtroom');
    cy.get('app-hearing-file').should('contain', '3');
    cy.get('app-hearing-file').should('contain', 'Judge(s)');
    cy.get('app-hearing-file').should('contain', 'HHJ M. Hussain KC');
    cy.get('.flex-space-between > .govuk-heading-m').should('contain', 'Transcripts for this hearing');
    cy.get('.govuk-table__body > :nth-child(1) > :nth-child(1)').should('contain', 'Sentencing remarks');
    cy.get('.govuk-button').should('contain', 'Request a new transcript');
    cy.get('.govuk-button').click();
    cy.get('app-govuk-heading').should('contain', 'Case ID');
    cy.get('app-govuk-heading').should('contain', 'C20220620001');

    cy.get('.govuk-button').contains('Continue').click();
    cy.get('.govuk-list > :nth-child(1) > a').should('contain', 'Please select a transcription type');
    cy.get('.govuk-list > :nth-child(2) > a').should('contain', 'Please select an urgency');
    cy.get('#transcription-type-error').should('contain', 'Please select a transcription type');
    cy.get('#urgency-error').should('contain', 'Please select an urgency');
    cy.a11y();
  });

  it('open the request times page if "court log" is selected', () => {
    cy.get('.govuk-button').should('contain', 'Request a new transcript').click();

    // Confirm we are in the right place
    cy.get('h1.govuk-heading-l').should('contain', 'Request a new transcript');

    // Fill in the form
    cy.get('#transcription-type').select('Court log');
    cy.get('#urgency').select('Overnight');
    cy.get('.govuk-button').contains('Continue').click();

    // Confirm we are in the right place
    cy.get('h2.govuk-heading-m').should('contain', 'Events, audio and specific times requests');
  });

  it('open the request times page if "specified times" is selected', () => {
    cy.get('.govuk-button').should('contain', 'Request a new transcript').click();

    // Confirm we are in the right place
    cy.get('h1.govuk-heading-l').should('contain', 'Request a new transcript');

    // Fill in the form
    cy.get('#transcription-type').select('Specified times');
    cy.get('#urgency').select('Overnight');
    cy.get('.govuk-button').contains('Continue').click();

    // Confirm we are in the right place
    cy.get('h2.govuk-heading-m').should('contain', 'Events, audio and specific times requests');
    cy.a11y();
  });

  it('show outside times validation error if requested times are outside', () => {
    cy.get('.govuk-button').should('contain', 'Request a new transcript').click();

    // Confirm we are in the right place
    cy.get('h1.govuk-heading-l').should('contain', 'Request a new transcript');

    // Fill in the form
    cy.get('#transcription-type').select('Court log');
    cy.get('#urgency').select('Overnight');
    cy.get('.govuk-button').contains('Continue').click();

    // Confirm we are in the right place
    cy.get('h2.govuk-heading-m').should('contain', 'Events, audio and specific times requests');

    //Fill in times
    cy.get('#start-hour-input').type('01');
    cy.get('#start-minutes-input').type('59');
    cy.get('#start-seconds-input').type('30');

    cy.get('#end-hour-input').type('05');
    cy.get('#end-minutes-input').type('00');
    cy.get('#end-seconds-input').type('00');

    cy.get('.govuk-button').contains('Continue').click();

    cy.get('#start-time-error').should(
      'contain',
      'Audio not available for timing entered. You must specify a time that matches the audio times available'
    );

    cy.get('ul.govuk-error-summary__list > li').should(
      'contain.text',
      'Audio not available for timing entered. You must specify a time that matches the audio times available'
    );
  });

  it('open the confirmation page if neither "court log" or "specified times" is selected', () => {
    cy.get('.govuk-button').should('contain', 'Request a new transcript').click();

    // Confirm we are in the right place
    cy.get('h1.govuk-heading-l').should('contain', 'Request a new transcript');

    // Fill in the form
    cy.get('#transcription-type').select('Mitigation');
    cy.get('#urgency').select('Overnight');
    cy.get('.govuk-button').contains('Continue').click();

    // Confirm we are in the right place
    cy.contains('Events, audio and specific times requests').should('not.visible');
  });

  it('submit a transcript request', () => {
    cy.get('.govuk-button').should('contain', 'Request a new transcript').click();

    // Confirm we are in the right place
    cy.get('h1.govuk-heading-l').should('contain', 'Request a new transcript');

    // Fill in the form
    cy.get('#transcription-type').select('Mitigation');
    cy.get('#urgency').select('Overnight');
    cy.get('.govuk-button').contains('Continue').click();

    // Confirm we are in the right place
    cy.contains('Events, audio and specific times requests').should('not.visible');
    cy.get('#authorisation').check({ force: true });

    // Submit the form
    cy.get('.govuk-button').contains('Submit request').click();

    cy.get('.govuk-panel__title').should('contain', 'Transcript request submitted');
    cy.get('.govuk-panel__body strong').should('contain', '123'); // check ID
    cy.a11y();
  });

  describe('Duplicate Transcripts', () => {
    it('should show duplicate error message during normal transcript request', () => {
      cy.get('.govuk-button').should('contain', 'Request a new transcript').click();

      // Confirm we are in the right place
      cy.get('h1.govuk-heading-l').should('contain', 'Request a new transcript');

      // Fill in the form
      cy.get('#transcription-type').select('Duplicate');
      cy.get('#urgency').select('Overnight');
      cy.get('.govuk-button').contains('Continue').click();

      // Confirm we are in the right place
      cy.contains('Events, audio and specific times requests').should('not.visible');
      cy.get('#authorisation').check({ force: true });

      // Submit the form
      cy.get('.govuk-button').contains('Submit request').click();

      cy.get('.govuk-heading-l').should('contain', 'This transcript was requested already');
      cy.get('.govuk-body').should('contain', 'If the request is complete, a transcript will be available below.');
    });

    it('should show duplicate error message during court log transcript request', () => {
      cy.get('.govuk-button').should('contain', 'Request a new transcript').click();

      // Confirm we are in the right place
      cy.get('h1.govuk-heading-l').should('contain', 'Request a new transcript');

      // Fill in the form
      cy.get('#transcription-type').select('Court log');
      cy.get('#urgency').select('Overnight');
      cy.get('.govuk-button').contains('Continue').click();

      // Confirm we are in the right place
      cy.get('h2.govuk-heading-m').should('contain', 'Events, audio and specific times requests');

      //Fill in times
      cy.get('#start-hour-input').type('03');
      cy.get('#start-minutes-input').type('33');
      cy.get('#start-seconds-input').type('33');

      cy.get('#end-hour-input').type('05');
      cy.get('#end-minutes-input').type('00');
      cy.get('#end-seconds-input').type('00');

      cy.get('.govuk-button').contains('Continue').click();

      // Submit the form
      cy.get('#authorisation').check({ force: true });
      cy.get('.govuk-button').contains('Submit request').click();

      cy.get('.govuk-heading-l').should('contain', 'This transcript was requested already');
      cy.get('.govuk-body').should('contain', 'If the request is complete, a transcript will be available below.');
      cy.a11y();
    });

    it('should route to hearings list on duplicate error page', () => {
      cy.get('.govuk-button').should('contain', 'Request a new transcript').click();

      // Confirm we are in the right place
      cy.get('h1.govuk-heading-l').should('contain', 'Request a new transcript');

      // Fill in the form
      cy.get('#transcription-type').select('Duplicate');
      cy.get('#urgency').select('Overnight');
      cy.get('.govuk-button').contains('Continue').click();

      // Submit the form
      cy.get('#authorisation').check({ force: true });
      cy.get('.govuk-button').contains('Submit request').click();

      cy.get('.govuk-heading-l').should('contain', 'This transcript was requested already');
      cy.get('.govuk-body').should('contain', 'If the request is complete, a transcript will be available below.');
      cy.get('#exists-hearing-route').contains('Return to hearing').click();

      cy.get('.govuk-heading-m').should('contain', 'Transcripts for this hearing');
    });

    it('should route to specific transcript on duplicate error page', () => {
      cy.get('.govuk-button').should('contain', 'Request a new transcript').click();

      // Confirm we are in the right place
      cy.get('h1.govuk-heading-l').should('contain', 'Request a new transcript');

      // Fill in the form
      cy.get('#transcription-type').select('Duplicate');
      cy.get('#urgency').select('Overnight');
      cy.get('.govuk-button').contains('Continue').click();

      // Submit the form
      cy.get('#authorisation').check({ force: true });
      cy.get('.govuk-button').contains('Submit request').click();

      cy.get('.govuk-heading-l').should('contain', 'This transcript was requested already');
      cy.get('.govuk-body').should('contain', 'If the request is complete, a transcript will be available below.');
      cy.get('.govuk-link').should('contain', 'Go to transcript');

      cy.get('#exists-duplicate-route').contains('Go to transcript').click();

      cy.get('.govuk-caption-l').should('contain', 'Transcript file');
      cy.get('.govuk-heading-l').should('contain', 'C20220620001_0.docx');
    });
  });
});
