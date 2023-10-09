import './commands';

describe('Request audio', () => {
    beforeEach(() => {
        cy.login();
        cy.contains('Search').click();
        cy.get('h1').should('contain', 'Search for a case');
        cy.get('#case_number').type('C20220620001');
        cy.get('button').contains('Search').click();

        cy.get('#search-results').should('contain', '1 result');
        cy.get('.govuk-table__row').contains('C20220620001');
        cy.get('.govuk-table__row').contains('Swansea');
        cy.get('.govuk-table__row').contains('1');
        cy.get('.govuk-table__row').contains('Judge Judy');
        cy.get('.govuk-table__row').contains('Defendant Dave');
        cy.get('.restriction-row').should('contain', 'Restriction: Section 4(2) of the Contempt of Court Act 1981');
        cy.get('a').contains('C20220620001').click();
        cy.get('a').contains('31 Aug 2023').click();
    });

    it('should request audio', () => {
        cy.get('.button').contains('Get Audio').click();
        cy.get('.govuk-error-summary').should('contain', 'You must include a start time for your audio recording');
        cy.get('.govuk-error-summary').should('contain', 'You must include an end time for your audio recording');
        cy.get('.govuk-error-summary').should('contain', 'You must select a request type');

        cy.get(':nth-child(2) > [scope="row"] > .govuk-checkboxes > .govuk-checkboxes__item > #\\31 ').click();
        cy.get('#start-time-hour-input').should('have.value', '02');
        cy.get('#start-time-minutes-input').should('have.value', '32');
        cy.get('#start-time-seconds-input').should('have.value', '24');
        cy.get('#end-time-hour-input').should('have.value', '14');
        cy.get('#end-time-minutes-input').should('have.value', '32');
        cy.get('#end-time-seconds-input').should('have.value', '24');

        cy.get('#download-radio').click();

        cy.get('.button').contains('Get Audio').click();

        cy.get('.govuk-grid-column-two-thirds > :nth-child(4)').should('contain', 'C20220620001');
        cy.get('.govuk-grid-column-two-thirds > :nth-child(6)').should('contain', 'Swansea');
        cy.get('.govuk-grid-column-two-thirds > :nth-child(8)').should('contain', 'Defendant Dave');
        cy.get('.govuk-grid-column-two-thirds > :nth-child(11)').should('contain', '2023-09-01');
        cy.get('.govuk-grid-column-two-thirds > :nth-child(13)').should('contain', '02:32:24');
        cy.get('.govuk-grid-column-two-thirds > :nth-child(15)').should('contain', '14:32:24');

        cy.get('.govuk-button-group > .govuk-button').contains('Confirm').click();

        cy.get('.govuk-panel__body > strong').should('contain', '1234');
        cy.get('.govuk-grid-column-two-thirds > :nth-child(4)').should('contain', 'C20220620001');
        cy.get('.govuk-grid-column-two-thirds > :nth-child(6)').should('contain', 'Swansea');
        cy.get('.govuk-grid-column-two-thirds > :nth-child(8)').should('contain', 'Defendant Dave');
        cy.get('.govuk-grid-column-two-thirds > :nth-child(11)').should('contain', '2023-09-01');
        cy.get('.govuk-grid-column-two-thirds > :nth-child(13)').should('contain', '02:32:24');
        cy.get('.govuk-grid-column-two-thirds > :nth-child(15)').should('contain', '14:32:24');
        cy.get(':nth-child(18) > strong').should('contain', 'dev@local');
    });
});