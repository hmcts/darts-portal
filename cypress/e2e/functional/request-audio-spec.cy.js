import 'cypress-axe';
import './commands';

const previewLinkSelector = 'a[data-cy="preview-link-button"]';

describe('Request audio functionality', () => {
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
  });

  it('should show error for no audio', () => {
    cy.get('#hearingsTable').should('contain', '1 Dec 2023');
    cy.get('#hearingsTable a').contains('1 Dec 2023').click();
    cy.get('.button').contains('Get Audio').click();
    cy.get('.govuk-error-summary').should('contain', 'There is no audio available for this start time');
    cy.get('.govuk-error-summary').should('contain', 'There is no audio available for this end time');
    cy.get('#end-time-error').should('contain', 'There is no audio available for this end time');
    cy.get('#start-time-error').should('contain', 'There is no audio available for this start time');

    cy.get('#start-time-hour-input').type('08');
    cy.get('#start-time-minutes-input').type('59');
    cy.get('#start-time-seconds-input').type('24');
    cy.get('#end-time-hour-input').type('09');
    cy.get('#end-time-minutes-input').type('00');
    cy.get('#end-time-seconds-input').type('24');

    cy.get('.button').contains('Get Audio').click();
    cy.get('.govuk-error-summary').should('contain', 'There is no audio available for this start time');
    cy.get('.govuk-error-summary').should('contain', 'There is no audio available for this end time');
    cy.get('#end-time-error').should('contain', 'There is no audio available for this end time');
    cy.get('#start-time-error').should('contain', 'There is no audio available for this start time');
  });

  it('should request audio', () => {
    cy.get('#hearingsTable').should('contain', '1 Sep 2023');
    cy.get('#hearingsTable a').contains('1 Sep 2023').click();
    cy.get('.button').contains('Get Audio').click();
    cy.get('.govuk-error-summary').should('contain', 'You must include a start time for your audio recording');
    cy.get('.govuk-error-summary').should('contain', 'You must include an end time for your audio recording');
    cy.get('.govuk-error-summary').should('contain', 'You must select a request type');

    cy.get('#eventAudioTable .govuk-table__row:nth-child(12) .govuk-checkboxes__item').click();
    cy.get('#start-time-hour-input').should('have.value', '21');
    cy.get('#start-time-minutes-input').should('have.value', '50');
    cy.get('#start-time-seconds-input').should('have.value', '00');
    cy.get('#end-time-hour-input').should('have.value', '21');
    cy.get('#end-time-minutes-input').should('have.value', '55');
    cy.get('#end-time-seconds-input').should('have.value', '00');

    cy.get('#download-radio').click({ force: true });

    cy.get('.button > .govuk-button').contains('Get Audio').click();

    cy.get('.govuk-grid-column-two-thirds > :nth-child(4)').should('contain', 'C20220620001');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(6)').should('contain', 'Swansea');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(8)').should('contain', 'Defendant Dave');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(11)').should('contain', '1 Sep 2023');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(13)').should('contain', '21:50:00');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(15)').should('contain', '21:55:00');

    cy.get('.govuk-button-group > .govuk-button').contains('Confirm').click();

    cy.get('.govuk-panel__body > strong').should('contain', '1234');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(4)').should('contain', 'C20220620001');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(6)').should('contain', 'Swansea');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(8)').should('contain', 'Defendant Dave');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(11)').should('contain', '1 Sep 2023');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(13)').should('contain', '21:50:00');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(15)').should('contain', '21:55:00');
    cy.get(':nth-child(18) > strong').should('contain', 'phil.taylor@darts.local');
    cy.a11y();
  });

  it('should show an error screen if a 403 is returned', () => {
    cy.get('#hearingsTable').should('contain', '1 Oct 2023');
    cy.get('#hearingsTable a').contains('1 Oct 2023').click();
    cy.get('.button').contains('Get Audio').click();
    cy.get('.govuk-error-summary').should('contain', 'You must include a start time for your audio recording');
    cy.get('.govuk-error-summary').should('contain', 'You must include an end time for your audio recording');
    cy.get('.govuk-error-summary').should('contain', 'You must select a request type');

    cy.get('tbody .govuk-table__row:nth-child(1) input[type="checkbox"]').click();
    cy.get('#start-time-hour-input').should('have.value', '09');
    cy.get('#start-time-minutes-input').should('have.value', '32');
    cy.get('#start-time-seconds-input').should('have.value', '24');
    cy.get('#end-time-hour-input').should('have.value', '09');
    cy.get('#end-time-minutes-input').should('have.value', '36');
    cy.get('#end-time-seconds-input').should('have.value', '24');

    cy.get('#download-radio').click({ force: true });

    cy.get('.button > .govuk-button').contains('Get Audio').click();

    cy.get('.govuk-grid-column-two-thirds > :nth-child(4)').should('contain', 'C20220620001');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(6)').should('contain', 'Swansea');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(8)').should('contain', 'Defendant Dave');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(11)').should('contain', '11 Oct 2023');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(13)').should('contain', '09:32:24');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(15)').should('contain', '09:36:24');

    cy.get('.govuk-button-group > .govuk-button').contains('Confirm').click();

    cy.get('#forbidden-heading').should('contain', 'You do not have permission to get audio for this courthouse.');
    cy.get('#forbidden-body').should(
      'contain',
      'If you believe you should have permission, contact DTS-IT Service Desk.'
    );
    cy.get('.govuk-back-link').should('not.exist');
    cy.a11y();
  });

  it('should show an error screen if a 409 is returned', () => {
    cy.get('#hearingsTable').should('contain', '5 Jan 2024');
    cy.get('#hearingsTable a').contains('5 Jan 2024').click();

    cy.get('#eventAudioTable .govuk-table__row:nth-child(2) .govuk-checkboxes__item').click();
    cy.get('#start-time-hour-input').should('have.value', '10');
    cy.get('#start-time-minutes-input').should('have.value', '32');
    cy.get('#start-time-seconds-input').should('have.value', '24');
    cy.get('#end-time-hour-input').should('have.value', '10');
    cy.get('#end-time-minutes-input').should('have.value', '36');
    cy.get('#end-time-seconds-input').should('have.value', '24');

    cy.get('#download-radio').click({ force: true });

    cy.get('.button > .govuk-button').contains('Get Audio').click();

    cy.get('.govuk-grid-column-two-thirds > :nth-child(4)').should('contain', 'C20220620001');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(6)').should('contain', 'Swansea');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(8)').should('contain', 'Defendant Dave');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(11)').should('contain', '5 Jan 2024');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(13)').should('contain', '10:32:24');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(15)').should('contain', '10:36:24');

    cy.get('.govuk-button-group > .govuk-button').contains('Confirm').click();

    cy.get('#conflict-heading').should('contain', 'You cannot order this audio');
    cy.get('#conflict-body-1').should('contain', "You have already ordered this audio and the request is 'pending'.");
    cy.get('#conflict-body-2').should(
      'contain',
      "You'll be able to order it when the order is marked as 'complete' in Your Audio."
    );
    cy.get('.govuk-back-link').should('not.exist');
    cy.a11y();
  });

  it('should show an error screen if a 413 is returned', () => {
    cy.get('#hearingsTable').should('contain', '10 Mar 2024');
    cy.get('#hearingsTable a').contains('10 Mar 2024').click();

    cy.get('#eventAudioTable .govuk-table__row:nth-child(2) .govuk-checkboxes__item').click();
    cy.get('#start-time-hour-input').should('have.value', '10');
    cy.get('#start-time-minutes-input').should('have.value', '32');
    cy.get('#start-time-seconds-input').should('have.value', '24');
    cy.get('#end-time-hour-input').should('have.value', '10');
    cy.get('#end-time-minutes-input').should('have.value', '36');
    cy.get('#end-time-seconds-input').should('have.value', '24');

    cy.get('#download-radio').click({ force: true });

    cy.get('.button > .govuk-button').contains('Get Audio').click();

    cy.get('.govuk-grid-column-two-thirds > :nth-child(4)').should('contain', 'C20220620001');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(6)').should('contain', 'Swansea');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(8)').should('contain', 'Defendant Dave');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(11)').should('contain', '10 Mar 2024');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(13)').should('contain', '10:32:24');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(15)').should('contain', '10:36:24');

    cy.get('.govuk-button-group > .govuk-button').contains('Confirm').click();

    cy.get('#conflict-heading').should('contain', 'You cannot order this audio');
    cy.get('#conflict-body-1').should(
      'contain',
      'Too many audio files for handheld audio. Please contact DTS-IT Service Desk to process your request.'
    );
    cy.get('.govuk-back-link').should('not.exist');
    cy.a11y();
  });

  it('should show an error when start time is after end time', () => {
    cy.get('#hearingsTable').should('contain', '1 Sep 2023');
    cy.get('#hearingsTable a').contains('1 Sep 2023').click();

    cy.get('#start-time-hour-input').clear().type('13');
    cy.get('#start-time-minutes-input').clear().type('00');
    cy.get('#start-time-seconds-input').clear().type('00');
    cy.get('#end-time-hour-input').clear().type('11');
    cy.get('#end-time-minutes-input').clear().type('00');
    cy.get('#end-time-seconds-input').clear().type('00');
    cy.get('#download-radio').click({ force: true });

    cy.get('.button').contains('Get Audio').click();
    cy.get('.govuk-error-summary').should('contain', 'End time must be after start time');
    cy.get('.govuk-error-message').should('contain', 'End time must be after start time');
  });

  it('should show an error when time is incorrect format', () => {
    cy.get('#hearingsTable').should('contain', '1 Sep 2023');
    cy.get('#hearingsTable a').contains('1 Sep 2023').click();

    cy.get('#start-time-hour-input').clear().type('1');
    cy.get('#start-time-minutes-input').clear().type('0');
    cy.get('#start-time-seconds-input').clear().type('0');
    cy.get('#end-time-hour-input').clear().type('19');
    cy.get('#end-time-minutes-input').clear().type('50');
    cy.get('#end-time-seconds-input').clear().type('zz');
    cy.get('#download-radio').click({ force: true });

    cy.get('.button').contains('Get Audio').click();
    cy.get('.govuk-error-summary').should('contain', 'Enter a time in the correct format (for example 15:11:11)');
    cy.get('.govuk-error-message').should('contain', 'Enter a time in the correct format (for example 15:11:11)');
  });

  describe('Preview Audio', () => {
    it('should preview audio', () => {
      cy.get('#hearingsTable a').contains('1 Sep 2023').click();
      cy.get(previewLinkSelector).eq(0).click();
      cy.get('audio').should('be.visible');
      // check audio player is playing
      cy.get('audio').should('have.prop', 'paused', false);
    });

    it('should show Error message when preview audio returns 403', () => {
      cy.get('#hearingsTable a').contains('1 Sep 2023').click();
      cy.get(previewLinkSelector).eq(3).click();
      cy.get('.govuk-table tr').eq(8).contains('p', 'You do not have permission to preview.');
    });

    it('should show Error message when preview audio returns 404', () => {
      cy.get('#hearingsTable a').contains('1 Sep 2023').click();
      cy.get(previewLinkSelector).eq(4).click();
      cy.get('.govuk-table tr').eq(9).contains('p', 'Preview not found');
    });

    it('should show Error message when preview audio returns 500', () => {
      cy.get('#hearingsTable a').contains('1 Sep 2023').click();
      cy.get(previewLinkSelector).eq(5).click();
      cy.get('.govuk-table tr').eq(10).contains('p', 'An error has occurred.');
    });

    it('should show audio archived message', () => {
      cy.get('#hearingsTable a').contains('1 Sep 2023').click();
      cy.get('td')
        .contains('21:50:00 - 21:55:00')
        .next('td')
        .contains('Audio recording')
        .next('td')
        .contains('Audio archived. Preview not available.');
    });

    it('should show audio is not available message', () => {
      cy.get('#hearingsTable a').contains('11 Oct 2023').click();
      cy.get('.govuk-hint').contains('This audio is not currently available in DARTS, please try again later.');
    });

    it('should preview audio on a medium length request', () => {
      cy.get('#hearingsTable a').contains('10 Mar 2024').click();
      cy.get(previewLinkSelector).eq(2).click();

      cy.get('.loading').should('be.visible');
      cy.wait(6000);
      cy.get('.loading').should('not.exist');

      cy.get('audio').should('be.visible');
      // check audio player is playing
      cy.get('audio').should('have.prop', 'paused', false);
    });

    it('should show no audio found message for audio with same start/end timestamps', () => {
      cy.get('#hearingsTable a').contains('1 Sep 2023').click();

      cy.get('table.govuk-table')
        .find('tr')
        .eq(13)
        .within(() => {
          cy.get('.audio-row').should('contain.text', '23:31:31 - 23:31:31');
          cy.get('td').eq(2).should('contain.text', 'Audio recording');
          cy.get('p.govuk-hint.no-margin').should('contain.text', 'No audio found. Preview not available');
        });
    });
  });

  after(() => {
    cy.request('/api/audio/preview/reset');
  });
});

describe('ARM maintenance', () => {
  const maintenanceMessage =
    'The audio you have requested has been archived. ' +
    'The archive service is currently unavailable due to maintenance, ' +
    'so we are unable to retrieve your recording at this time. ' +
    'Please try again later.';

  beforeEach(() => {
    // Enable ARM maintenance before the application loads its configuration
    cy.intercept('GET', '**/app/config', (req) => {
      req.continue((res) => {
        res.body.armDownForMaintenance = 'true';
      });
    });

    cy.login();
    cy.injectAxe();

    // Navigate to hearing 1
    cy.contains('Search').click();
    cy.get('#case_number').type('C20220620001');
    cy.get('button').contains('Search').click();

    // Open the case from the search results
    cy.get('.govuk-table__row').contains('C20220620001').closest('tr').find('a').contains('C20220620001').click();

    // Open hearing 1
    cy.get('#hearingsTable').should('contain', '1 Sep 2023');
    cy.get('#hearingsTable a').contains('1 Sep 2023').click();
  });

  it('displays a maintenance warning when requesting archived audio during ARM maintenance', () => {
    // Enter times that fall within archived audio 8
    cy.get('#start-time-hour-input').clear().type('21');
    cy.get('#start-time-minutes-input').clear().type('51');
    cy.get('#start-time-seconds-input').clear().type('00');

    cy.get('#end-time-hour-input').clear().type('21');
    cy.get('#end-time-minutes-input').clear().type('54');
    cy.get('#end-time-seconds-input').clear().type('00');

    // Select Playback Only
    cy.get('#playback-radio').check({ force: true });

    // Request audio
    cy.contains('button', 'Get Audio').click();

    // Verify the maintenance warning
    cy.get('app-govuk-banner').should('be.visible').and('contain.text', maintenanceMessage);

    // Verify the entered times are preserved
    cy.get('#start-time-hour-input').should('have.value', '21');
    cy.get('#start-time-minutes-input').should('have.value', '51');
    cy.get('#end-time-hour-input').should('have.value', '21');
    cy.get('#end-time-minutes-input').should('have.value', '54');

    // Verify we haven't progressed to Order Summary
    cy.contains('button', 'Confirm').should('not.exist');

    // Check automated accessibility rules
    cy.a11y();
  });

  it('allows requesting unarchived audio during ARM maintenance', () => {
    // Request audio 6, which is not archived
    cy.get('#start-time-hour-input').clear().type('21');
    cy.get('#start-time-minutes-input').clear().type('00');
    cy.get('#start-time-seconds-input').clear().type('00');

    cy.get('#end-time-hour-input').clear().type('21');
    cy.get('#end-time-minutes-input').clear().type('01');
    cy.get('#end-time-seconds-input').clear().type('00');

    // Select Playback Only
    cy.get('#playback-radio').check({ force: true });

    // Request audio
    cy.contains('button', 'Get Audio').click();

    // No maintenance warning should appear
    cy.get('app-govuk-banner').should('not.exist');

    // Normal Order Summary should be displayed
    cy.contains('button', 'Confirm').should('be.visible');

    cy.a11y();
  });

  it('displays a maintenance warning when requesting mixed archived and unarchived audio during ARM maintenance', () => {
    // Request a range containing both archived and unarchived audio
    cy.get('#start-time-hour-input').clear().type('21');
    cy.get('#start-time-minutes-input').clear().type('00');
    cy.get('#start-time-seconds-input').clear().type('00');

    cy.get('#end-time-hour-input').clear().type('21');
    cy.get('#end-time-minutes-input').clear().type('54');
    cy.get('#end-time-seconds-input').clear().type('00');

    // Select Download instead of Playback this time to test both request types
    cy.get('#download-radio').check({ force: true });

    // Request audio
    cy.contains('button', 'Get Audio').click();

    // Verify maintenance warning
    cy.get('app-govuk-banner').should('be.visible').and('contain.text', maintenanceMessage);

    // Verify the entered times and request type are preserved
    cy.get('#start-time-hour-input').should('have.value', '21');
    cy.get('#start-time-minutes-input').should('have.value', '00');
    cy.get('#end-time-hour-input').should('have.value', '21');
    cy.get('#end-time-minutes-input').should('have.value', '54');
    cy.get('#download-radio').should('be.checked');

    // Verify we haven't progressed to Order Summary
    cy.contains('button', 'Confirm').should('not.exist');

    cy.a11y();
  });

  it('clears the ARM maintenance warning when the audio request changes', () => {
    // Enter times within archived audio 8
    cy.get('#start-time-hour-input').clear().type('21');
    cy.get('#start-time-minutes-input').clear().type('51');
    cy.get('#start-time-seconds-input').clear().type('00');

    cy.get('#end-time-hour-input').clear().type('21');
    cy.get('#end-time-minutes-input').clear().type('54');
    cy.get('#end-time-seconds-input').clear().type('00');

    cy.get('#playback-radio').check({ force: true });

    // Request audio and verify maintenance warning
    cy.contains('button', 'Get Audio').click();
    cy.get('app-govuk-banner').should('be.visible').and('contain.text', maintenanceMessage);

    // Edit the start time and hence the maintenance warning should disappear but time retained
    cy.get('#start-time-minutes-input').clear().type('52');
    cy.get('app-govuk-banner').should('not.exist');
    cy.get('#start-time-minutes-input').should('have.value', '52');

    // Request audio again and warning should reappear
    cy.contains('button', 'Get Audio').click();
    cy.get('app-govuk-banner').should('be.visible').and('contain.text', maintenanceMessage);

    // Switch from Playback Only to Download and  warning should disappear
    cy.get('#download-radio').check({ force: true });
    cy.get('app-govuk-banner').should('not.exist');

    // Request audio again and warning should reappear
    cy.contains('button', 'Get Audio').click();
    cy.get('app-govuk-banner').should('be.visible').and('contain.text', maintenanceMessage);

    // Select an audio record from the Events and Audio table and warning should disappear
    cy.get('#eventAudioTable .govuk-table__row:nth-child(12) .govuk-checkboxes__item').click();
    cy.get('app-govuk-banner').should('not.exist');

    // Verify the selected recording has updated the times
    cy.get('#start-time-hour-input').should('have.value', '21');
    cy.get('#start-time-minutes-input').should('have.value', '50');
    cy.get('#end-time-hour-input').should('have.value', '21');
    cy.get('#end-time-minutes-input').should('have.value', '55');

    // Request audio again and warning should reappear
    cy.contains('button', 'Get Audio').click();
    cy.get('app-govuk-banner').should('be.visible').and('contain.text', maintenanceMessage);

    // The request should not proceed to Order Summary
    cy.contains('button', 'Confirm').should('not.exist');

    cy.a11y();
  });

  it('shows the existing validation error instead of the ARM maintenance warning for invalid times', () => {
    // Enter an invalid start hour
    cy.get('#start-time-hour-input').clear().type('25');
    cy.get('#start-time-minutes-input').clear().type('51');
    cy.get('#start-time-seconds-input').clear().type('00');

    // Enter a valid end time within archived audio 8
    cy.get('#end-time-hour-input').clear().type('21');
    cy.get('#end-time-minutes-input').clear().type('54');
    cy.get('#end-time-seconds-input').clear().type('00');

    cy.get('#playback-radio').check({ force: true });

    // Request audio
    cy.contains('button', 'Get Audio').click();

    // Existing validation error should appear
    cy.get('.govuk-error-summary').should('be.visible').and('contain.text', 'Enter a time in the correct format (for example 15:11:11)');

    // ARM maintenance warning should not appear
    cy.get('app-govuk-banner').should('not.exist');

    // Invalid time should remain available for correction
    cy.get('#start-time-hour-input').should('have.value', '25');

    // User should not proceed to Order Summary
    cy.contains('button', 'Confirm').should('not.exist');

    cy.a11y();
  });
});

describe('Audio request type - Role checks', () => {
  it('should show request type for rcj appeals role', () => {
    cy.login('rcj-appeals');
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('#case_number').type('C20220620001');
    cy.get('button').contains('Search').click();

    cy.get('.govuk-table__row').contains('C20220620001');
    cy.get('a').contains('C20220620001').click();
    cy.get('h1').should('contain', 'C20220620001');

    cy.get('#hearingsTable').should('contain', '1 Sep 2023');
    cy.get('#hearingsTable a').contains('1 Sep 2023').click();

    cy.get('.button').contains('Get Audio').click();
    cy.get('.govuk-error-summary').should('contain', 'You must include a start time for your audio recording');
    cy.get('.govuk-error-summary').should('contain', 'You must include an end time for your audio recording');
    cy.get('.govuk-error-summary').should('contain', 'You must select a request type');

    cy.get('#eventAudioTable .govuk-table__row:nth-child(2) .govuk-checkboxes__item').click();
    cy.get('#start-time-hour-input').should('have.value', '03');
    cy.get('#start-time-minutes-input').should('have.value', '32');
    cy.get('#start-time-seconds-input').should('have.value', '24');
    cy.get('#end-time-hour-input').should('have.value', '15');
    cy.get('#end-time-minutes-input').should('have.value', '32');
    cy.get('#end-time-seconds-input').should('have.value', '24');

    cy.get('#download-radio').click({ force: true });

    cy.get('.button > .govuk-button').contains('Get Audio').click();

    cy.get('.govuk-button-group > .govuk-button').contains('Confirm').click();

    cy.get('.govuk-grid-column-two-thirds > :nth-child(4)').should('contain', 'C20220620001');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(6)').should('contain', 'Swansea');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(8)').should('contain', 'Defendant Dave');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(11)').should('contain', '1 Sep 2023');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(13)').should('contain', '03:32:24');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(15)').should('contain', '15:32:24');
    cy.get(':nth-child(18) > strong').should('contain', 'dennis.priestley@darts.local');
  });

  it('should show request type for transcriber role', () => {
    cy.login('transcriber');
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('#case_number').type('C20220620001');
    cy.get('button').contains('Search').click();

    cy.get('.govuk-table__row').contains('C20220620001');
    cy.get('a').contains('C20220620001').click();
    cy.get('h1').should('contain', 'C20220620001');

    cy.get('#hearingsTable').should('contain', '1 Sep 2023');
    cy.get('#hearingsTable a').contains('1 Sep 2023').click();

    cy.get('.button').contains('Get Audio').click();
    cy.get('.govuk-error-summary').should('contain', 'You must include a start time for your audio recording');
    cy.get('.govuk-error-summary').should('contain', 'You must include an end time for your audio recording');
    cy.get('.govuk-error-summary').should('contain', 'You must select a request type');

    cy.get('#eventAudioTable .govuk-table__row:nth-child(2) .govuk-checkboxes__item').click();
    cy.get('#start-time-hour-input').should('have.value', '03');
    cy.get('#start-time-minutes-input').should('have.value', '32');
    cy.get('#start-time-seconds-input').should('have.value', '24');
    cy.get('#end-time-hour-input').should('have.value', '15');
    cy.get('#end-time-minutes-input').should('have.value', '32');
    cy.get('#end-time-seconds-input').should('have.value', '24');

    cy.get('#download-radio').click({ force: true });

    cy.get('.button > .govuk-button').contains('Get Audio').click();

    cy.get('.govuk-button-group > .govuk-button').contains('Confirm').click();

    cy.get('.govuk-grid-column-two-thirds > :nth-child(4)').should('contain', 'C20220620001');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(6)').should('contain', 'Swansea');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(8)').should('contain', 'Defendant Dave');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(11)').should('contain', '1 Sep 2023');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(13)').should('contain', '03:32:24');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(15)').should('contain', '15:32:24');
    cy.get(':nth-child(18) > strong').should('contain', 'trina.gulliver@darts.local');
  });

  it('should show request type for super admin role', () => {
    cy.login('admin');
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('#case_number').type('C20220620001');
    cy.get('button').contains('Search').click();

    cy.get('.govuk-table__row').contains('C20220620001');
    cy.get('a').contains('C20220620001').click();
    cy.get('h1').should('contain', 'C20220620001');

    cy.get('#hearingsTable').should('contain', '1 Sep 2023');
    cy.get('#hearingsTable a').contains('1 Sep 2023').click();

    cy.get('.button').contains('Get Audio').click();
    cy.get('.govuk-error-summary').should('contain', 'You must include a start time for your audio recording');
    cy.get('.govuk-error-summary').should('contain', 'You must include an end time for your audio recording');
    cy.get('.govuk-error-summary').should('contain', 'You must select a request type');

    cy.get('#eventAudioTable .govuk-table__row:nth-child(2) .govuk-checkboxes__item').click();
    cy.get('#start-time-hour-input').should('have.value', '03');
    cy.get('#start-time-minutes-input').should('have.value', '32');
    cy.get('#start-time-seconds-input').should('have.value', '24');
    cy.get('#end-time-hour-input').should('have.value', '15');
    cy.get('#end-time-minutes-input').should('have.value', '32');
    cy.get('#end-time-seconds-input').should('have.value', '24');

    cy.get('#download-radio').click({ force: true });

    cy.get('.button > .govuk-button').contains('Get Audio').click();

    cy.get('.govuk-button-group > .govuk-button').contains('Confirm').click();

    cy.get('.govuk-grid-column-two-thirds > :nth-child(4)').should('contain', 'C20220620001');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(6)').should('contain', 'Swansea');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(8)').should('contain', 'Defendant Dave');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(11)').should('contain', '1 Sep 2023');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(13)').should('contain', '03:32:24');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(15)').should('contain', '15:32:24');
    cy.get(':nth-child(18) > strong').should('contain', 'phil.taylor@darts.local');
  });

  it('should show request type for super user role', () => {
    cy.login('superuser');
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('#case_number').type('C20220620001');
    cy.get('button').contains('Search').click();

    cy.get('.govuk-table__row').contains('C20220620001');
    cy.get('a').contains('C20220620001').click();
    cy.get('h1').should('contain', 'C20220620001');

    cy.get('#hearingsTable').should('contain', '1 Sep 2023');
    cy.get('#hearingsTable a').contains('1 Sep 2023').click();

    cy.get('.button').contains('Get Audio').click();
    cy.get('.govuk-error-summary').should('contain', 'You must include a start time for your audio recording');
    cy.get('.govuk-error-summary').should('contain', 'You must include an end time for your audio recording');
    cy.get('.govuk-error-summary').should('contain', 'You must select a request type');

    cy.get('#eventAudioTable .govuk-table__row:nth-child(2) .govuk-checkboxes__item').click();
    cy.get('#start-time-hour-input').should('have.value', '03');
    cy.get('#start-time-minutes-input').should('have.value', '32');
    cy.get('#start-time-seconds-input').should('have.value', '24');
    cy.get('#end-time-hour-input').should('have.value', '15');
    cy.get('#end-time-minutes-input').should('have.value', '32');
    cy.get('#end-time-seconds-input').should('have.value', '24');

    cy.get('#download-radio').click({ force: true });

    cy.get('.button > .govuk-button').contains('Get Audio').click();

    cy.get('.govuk-button-group > .govuk-button').contains('Confirm').click();

    cy.get('.govuk-grid-column-two-thirds > :nth-child(4)').should('contain', 'C20220620001');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(6)').should('contain', 'Swansea');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(8)').should('contain', 'Defendant Dave');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(11)').should('contain', '1 Sep 2023');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(13)').should('contain', '03:32:24');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(15)').should('contain', '15:32:24');
    cy.get(':nth-child(18) > strong').should('contain', 'gary.anderson@darts.local');
  });

  it('should hide request type for requester role', () => {
    cy.login('requester');
    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('#case_number').type('C20220620001');
    cy.get('button').contains('Search').click();

    cy.get('.govuk-table__row').contains('C20220620001');
    cy.get('a').contains('C20220620001').click();
    cy.get('h1').should('contain', 'C20220620001');

    cy.get('#hearingsTable').should('contain', '1 Sep 2023');
    cy.get('#hearingsTable a').contains('1 Sep 2023').click();

    cy.get('.button').contains('Get Audio').click();
    cy.get('.govuk-error-summary').should('contain', 'You must include a start time for your audio recording');
    cy.get('.govuk-error-summary').should('contain', 'You must include an end time for your audio recording');
    cy.get('.govuk-error-summary').should('not.contain', 'You must select a request type');

    cy.get('.requestType').should('not.be.visible');
    cy.get('#playback-radio').should('not.be.visible');
    cy.get('#download-radio').should('not.be.visible');
  });
});
