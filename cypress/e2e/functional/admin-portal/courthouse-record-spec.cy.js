import 'cypress-axe';
import '../commands';

describe('Admin - Courthouse record screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.injectAxe();
    cy.visit('/admin/courthouses');
  });

  it('View courthouse', () => {
    cy.get('#courthouseName').type('Reading').click();
    cy.get('button[type="submit"]').click();

    cy.get('td').contains('READING').click();
    cy.contains('h1', 'Reading').should('exist');

    // Check tabs
    cy.get('.moj-sub-navigation a').contains('Details').should('exist');
    cy.get('.moj-sub-navigation a').contains('Users').should('exist');

    // Dates
    cy.get('#date-created-container h3').contains('Date created').should('exist');
    cy.get('#last-updated-container h3').contains('Last updated').should('exist');
    cy.get('#date-created-container p').contains('Fri 18 Aug 2023').should('exist');
    cy.get('#last-updated-container p').contains('Fri 18 Aug 2023').should('exist');

    // Table
    cy.get('.govuk-table__caption').contains('Details').should('be.visible');
    cy.get('th#detail-th-0').contains('Database ID').should('be.visible');
    cy.get('td').contains('0').should('be.visible');
    cy.get('th#detail-th-1').contains('Courthouse name').should('be.visible');
    cy.get('td').contains('Reading').should('be.visible');
    cy.get('th#detail-th-2').contains('Region').should('be.visible');
    cy.get('td').contains('South west').should('be.visible');
    cy.get('th#detail-th-3').contains('Groups').should('be.visible');
    cy.get('td').contains('Judiciary').should('be.visible');
    cy.get('th#detail-th-4').should('not.exist');

    // Tags
    cy.get('.govuk-tag--purple').contains('Courthouse record').should('exist');

    // Buttons
    cy.contains('button', 'Edit courthouse').should('exist');

    // TODO: Commented for now
    // cy.a11y();
  });

  it('Edit courthouse - with data associated', () => {
    const courthouseName = 'READING';
    const displayName = 'Reading';

    cy.get('#courthouseName').type(displayName).click();
    cy.get('button[type="submit"]').click();
    cy.get('td').contains(courthouseName).click();
    cy.contains('h1', displayName).should('exist');
    cy.contains('button', 'Edit courthouse').click();

    cy.contains('span', 'Edit courthouse').should('exist');
    cy.contains('h1', 'Courthouse details').should('exist');

    cy.contains('div', 'There is data associated with this courthouse name. It cannot be changed.').should('exist');
    cy.get('#courthouse-name').should('not.exist');

    cy.get('#south-west-radio').should('be.checked');
    cy.get('#company-table').contains('Opus Transcribers').should('exist');

    cy.contains('.govuk-button', 'Continue').click();
    cy.contains('h1', 'Check details').should('exist');

    // Confirmation screen
    cy.get('th#th-transcription-companies').contains('Transcription companies').should('exist');
    cy.get('td').contains(courthouseName).should('exist');
    cy.get('#courthouse-name-link').should('not.exist');

    cy.get('th#th-display-name').contains('Display name').should('exist');
    cy.get('td').contains(displayName).should('exist');
    cy.get('#display-name-link').should('exist');

    cy.get('th#th-region').contains('Region').should('exist');
    cy.get('td').contains('South west').should('exist');
    cy.get('#region-link').should('exist');

    cy.get('th#th-transcription-companies').contains('Transcription companies').should('exist');
    cy.get('td').contains('Opus Transcribers').should('exist');
    cy.get('#transcription-companies-link').should('exist');

    // Click update button
    cy.contains('.govuk-button', 'Update courthouse').click();
    cy.get('#success-message').contains(`${displayName} updated`);

    // TODO: Commented for now
    // cy.a11y();
  });

  it('Edit courthouse - with no data associated', () => {
    const courthouseName = 'COURTSVILLE';
    const displayName = 'Courtsville';

    cy.get('#courthouseName').type(displayName).click();
    cy.get('button[type="submit"]').click();
    cy.get('td').contains(courthouseName).click();
    cy.contains('h1', displayName).should('exist');
    cy.contains('button', 'Edit courthouse').click();

    cy.contains('span', 'Edit courthouse').should('exist');
    cy.contains('h1', 'Courthouse details').should('exist');

    cy.contains('div', 'Must be the same ID used on XHIBIT or CPP').should('exist');
    cy.get('#courthouse-name').should('exist');

    cy.get('#no-region-radio').should('be.checked');
    cy.get('#company-table').contains('Opus Transcribers').should('exist');

    cy.contains('.govuk-button', 'Continue').click();
    cy.contains('h1', 'Check details').should('exist');

    // Confirmation screen
    cy.get('th#th-transcription-companies').contains('Transcription companies').should('exist');
    cy.get('td').contains(courthouseName).should('exist');
    cy.get('#courthouse-name-link').should('exist');

    cy.get('th#th-display-name').contains('Display name').should('exist');
    cy.get('td').contains(displayName).should('exist');
    cy.get('#display-name-link').should('exist');

    cy.get('th#th-region').contains('Region').should('exist');
    cy.get('td').contains('No region').should('exist');
    cy.get('#region-link').should('exist');

    cy.get('th#th-transcription-companies').contains('Transcription companies').should('exist');
    cy.get('td').contains('Opus Transcribers').should('exist');
    cy.get('#transcription-companies-link').should('exist');

    // Click update button
    cy.contains('.govuk-button', 'Update courthouse').click();
    cy.get('#success-message').contains(`${displayName} updated`);

    // TODO: Commented for now
    // cy.a11y();
  });

  it.skip('Create courthouse', () => {
    const courthouseName = 'COURTHOUSE';
    const displayName = 'Courthouse';
    cy.contains('button.govuk-button', 'Create new courthouse').click();

    cy.contains('span', 'Create courthouse').should('exist');
    cy.contains('h1', 'Courthouse details').should('exist');

    cy.contains('button.govuk-button', 'Continue').click();

    // Errors
    cy.get('.govuk-error-summary').should('contain', 'Enter a courthouse code');
    cy.get('.courthouse-name-error').should('contain', 'Enter a courthouse code');
    cy.get('.govuk-error-summary').should('contain', 'Enter a display name');
    cy.get('.display-name-error').should('contain', 'Enter a display name');
    cy.get('.govuk-error-summary').should('contain', 'Select a region');
    cy.get('.region-error').should('contain', 'Select a region');

    cy.get('#courthouse-name').type('READING');
    cy.get('.govuk-error-summary').should('contain', 'The courthouse code you entered exists already');
    cy.get('.courthouse-name-error').should('contain', 'The courthouse code you entered exists already');
    cy.get('#courthouse-name').clear();

    cy.get('#display-name').type('Reading');
    cy.get('.govuk-error-summary').should('contain', 'The display name you entered exists already');
    cy.get('.display-name-error').should('contain', 'The display name you entered exists already');
    cy.get('#display-name').clear();

    // Select options
    cy.get('#courthouse-name').type(courthouseName);
    cy.get('#display-name').type(displayName);
    cy.get('#wales-radio').click();

    // Transcription companies
    const company1 = 'Transcribers R Us';
    const company2 = 'Magic Transcribers Inc';

    cy.get('select').select(company1);
    cy.get('.add-company-button').click();
    cy.get('select').select(company2);
    cy.get('.add-company-button').click();

    cy.get('#company-table').contains(company1).should('exist');
    cy.get('#company-table').contains(company2).should('exist');

    // Remove one of the transcription companies
    cy.get('#company-table')
      .contains(company1)
      .parent('tr')
      .then((row) => {
        cy.wrap(row).find('td').contains('Remove').click();
      });
    // Now it should be gone
    cy.get('#company-table').contains(company1).should('not.exist');

    cy.contains('.govuk-button', 'Continue').click();
    cy.contains('h1', 'Check details').should('exist');

    // Confirmation screen
    cy.get('.govuk-table__caption').contains('Details').should('exist');
    cy.get('th#detail-th-0').contains('Courthouse name').should('exist');
    cy.get('td').contains(courthouseName).should('exist');
    cy.get('th#detail-th-1').contains('Display name').should('exist');
    cy.get('td').contains(displayName).should('exist');
    cy.get('th#detail-th-2').contains('Region').should('exist');
    cy.get('td').contains('Wales').should('exist');
    cy.get('th#detail-th-3').contains('Transcription companies').should('exist');
    cy.get('td').contains(company2).should('exist');

    // Click create button
    cy.contains('.govuk-button', 'Create courthouse').click();
    cy.get('#success-message').contains(`Created ${displayName}`);

    // TODO: Commented for now
    // cy.a11y();
  });
});
