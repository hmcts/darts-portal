import 'cypress-axe';
import './commands';

const previewLinkSelector = 'a[data-cy="preview-link-button"]';

describe('Request audio', () => {
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

  it('should request audio', () => {
    cy.get('#hearingsTable').should('contain', '1 Sep 2023');
    cy.get('#hearingsTable a').contains('1 Sep 2023').click();
    cy.get('.button').contains('Get Audio').click();
    cy.get('.govuk-error-summary').should('contain', 'You must include a start time for your audio recording');
    cy.get('.govuk-error-summary').should('contain', 'You must include an end time for your audio recording');
    cy.get('.govuk-error-summary').should('contain', 'You must select a request type');

    cy.get('#eventAudioTable .govuk-table__row:nth-child(2) .govuk-checkboxes__item').click();
    cy.get('#start-time-hour-input').should('have.value', '02');
    cy.get('#start-time-minutes-input').should('have.value', '32');
    cy.get('#start-time-seconds-input').should('have.value', '24');
    cy.get('#end-time-hour-input').should('have.value', '14');
    cy.get('#end-time-minutes-input').should('have.value', '32');
    cy.get('#end-time-seconds-input').should('have.value', '24');

    cy.get('#download-radio').click({ force: true });

    cy.get('.button > .govuk-button').contains('Get Audio').click();

    cy.get('.govuk-grid-column-two-thirds > :nth-child(4)').should('contain', 'C20220620001');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(6)').should('contain', 'Swansea');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(8)').should('contain', 'Defendant Dave');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(11)').should('contain', '1 Sep 2023');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(13)').should('contain', '02:32:24');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(15)').should('contain', '14:32:24');

    cy.get('.govuk-button-group > .govuk-button').contains('Confirm').click();

    cy.get('.govuk-panel__body > strong').should('contain', '1234');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(4)').should('contain', 'C20220620001');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(6)').should('contain', 'Swansea');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(8)').should('contain', 'Defendant Dave');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(11)').should('contain', '1 Sep 2023');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(13)').should('contain', '02:32:24');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(15)').should('contain', '14:32:24');
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

    cy.get('#eventAudioTable .govuk-table__row:nth-child(3) .govuk-checkboxes__item').click();
    cy.get('#start-time-hour-input').should('have.value', '09');
    cy.get('#start-time-minutes-input').should('have.value', '00');
    cy.get('#start-time-seconds-input').should('have.value', '00');
    cy.get('#end-time-hour-input').should('have.value', '09');
    cy.get('#end-time-minutes-input').should('have.value', '00');
    cy.get('#end-time-seconds-input').should('have.value', '00');

    cy.get('#download-radio').click({ force: true });

    cy.get('.button > .govuk-button').contains('Get Audio').click();

    cy.get('.govuk-grid-column-two-thirds > :nth-child(4)').should('contain', 'C20220620001');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(6)').should('contain', 'Swansea');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(8)').should('contain', 'Defendant Dave');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(11)').should('contain', '11 Oct 2023');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(13)').should('contain', '09:00:00');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(15)').should('contain', '09:00:00');

    cy.get('.govuk-button-group > .govuk-button').contains('Confirm').click();

    cy.get('#forbidden-heading').should('contain', 'You do not have permission to get audio for this courthouse.');
    cy.get('#forbidden-body').should('contain', 'If you believe you should have permission, contact Crown IT Support.');
    cy.get('.govuk-back-link').should('not.exist');
    cy.a11y();
  });

  it('should show an error screen if a 409 is returned', () => {
    cy.get('#hearingsTable').should('contain', '1 Dec 2023');
    cy.get('#hearingsTable a').contains('1 Dec 2023').click();

    cy.get('#eventAudioTable .govuk-table__row:nth-child(2) .govuk-checkboxes__item').click();
    cy.get('#start-time-hour-input').should('have.value', '09');
    cy.get('#start-time-minutes-input').should('have.value', '00');
    cy.get('#start-time-seconds-input').should('have.value', '00');
    cy.get('#end-time-hour-input').should('have.value', '09');
    cy.get('#end-time-minutes-input').should('have.value', '00');
    cy.get('#end-time-seconds-input').should('have.value', '00');

    cy.get('#download-radio').click({ force: true });

    cy.get('.button > .govuk-button').contains('Get Audio').click();

    cy.get('.govuk-grid-column-two-thirds > :nth-child(4)').should('contain', 'C20220620001');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(6)').should('contain', 'Swansea');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(8)').should('contain', 'Defendant Dave');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(11)').should('contain', '1 Dec 2023');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(13)').should('contain', '09:00:00');
    cy.get('.govuk-grid-column-two-thirds > :nth-child(15)').should('contain', '09:00:00');

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
      cy.get('.govuk-table tr').eq(7).contains('p', 'You do not have permission to preview.');
    });

    it('should show Error message when preview audio returns 404', () => {
      cy.get('#hearingsTable a').contains('1 Sep 2023').click();
      cy.get(previewLinkSelector).eq(4).click();
      cy.get('.govuk-table tr').eq(8).contains('p', 'Preview not found');
    });

    it('should show Error message when preview audio returns 500', () => {
      cy.get('#hearingsTable a').contains('1 Sep 2023').click();
      cy.get(previewLinkSelector).eq(5).click();
      cy.get('.govuk-table tr').eq(9).contains('p', 'An error has occurred.');
    });

    it('should show audio archived message', () => {
      cy.get('#hearingsTable a').contains('10 Oct 2023').click();
      cy.get('.govuk-hint').contains('Audio archived. Preview not available.');
    });

    it('should show audio is not available message', () => {
      cy.get('#hearingsTable a').contains('11 Oct 2023').click();
      cy.get('.govuk-hint').contains('This audio is not currently available in DARTS, please try again later.');
    });
  });
});
