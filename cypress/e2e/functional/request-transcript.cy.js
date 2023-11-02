import './commands';

describe('Request audio', () => {
    beforeEach(() => {
        cy.login();
        cy.contains('Search').click();
        cy.get('h1').should('contain', 'Search for a case');
        cy.get('#case_number').type('C20220620001');
        cy.get('button').contains('Search').click();

        cy.get('.govuk-table__row').contains('C20220620001');
        cy.get('a').contains('C20220620001').click();
        cy.get('h1').should('contain', 'C20220620001');
        cy.get('#hearingsTable').should('contain', '1 Sep 2023');
    });

    it('should get to hearing transcripts tab', () => {
        cy.get('#hearingsTable a').contains('1 Sep 2023').click();
        cy.get(':nth-child(2) > .moj-sub-navigation__link').click();
        cy.get('.govuk-caption-l').should('contain', 'Hearing');
        cy.get('.govuk-heading-l').should('contain', '1 Sep 2023');
        cy.get('app-hearing-file > div > :nth-child(3)').should('contain', 'Courthouse');
        cy.get('app-hearing-file > div > :nth-child(4)').should('contain', 'Swansea');
        cy.get('app-hearing-file > div > :nth-child(5)').should('contain', 'Courtroom');
        cy.get('app-hearing-file > div > :nth-child(6)').should('contain', '3');
        cy.get('app-hearing-file > div > :nth-child(7)').should('contain', 'Judge(s)');
        cy.get('app-hearing-file > div > :nth-child(8)').should('contain', 'HHJ M. Hussain KC');
        cy.get('.flex-space-between > .govuk-heading-m').should('contain', 'Transcripts for this hearing');
        cy.get('.govuk-table__body > :nth-child(1) > :nth-child(1)').should('contain', 'Sentencing remarks');
        cy.get('.govuk-button').should('contain', 'Request a new transcript');
    });

    it('should get to the request transcript page', () => {
        cy.get('#hearingsTable a').contains('1 Sep 2023').click();
        cy.get(':nth-child(2) > .moj-sub-navigation__link').click();
        cy.get('.govuk-caption-l').should('contain', 'Hearing');
        cy.get('.govuk-heading-l').should('contain', '1 Sep 2023');
        cy.get('app-hearing-file > div > :nth-child(3)').should('contain', 'Courthouse');
        cy.get('app-hearing-file > div > :nth-child(4)').should('contain', 'Swansea');
        cy.get('app-hearing-file > div > :nth-child(5)').should('contain', 'Courtroom');
        cy.get('app-hearing-file > div > :nth-child(6)').should('contain', '3');
        cy.get('app-hearing-file > div > :nth-child(7)').should('contain', 'Judge(s)');
        cy.get('app-hearing-file > div > :nth-child(8)').should('contain', 'HHJ M. Hussain KC');
        cy.get('.flex-space-between > .govuk-heading-m').should('contain', 'Transcripts for this hearing');
        cy.get('.govuk-table__body > :nth-child(1) > :nth-child(1)').should('contain', 'Sentencing remarks');
        cy.get('.govuk-button').should('contain', 'Request a new transcript');
        cy.get('.govuk-button').click();
        cy.get('h1.govuk-heading-s').should('contain', 'Case ID');
        cy.get('h1.govuk-body').should('contain', 'C20220620001');

        cy.get(':nth-child(12) > .govuk-label').should('contain', 'Request Type');
        cy.get(':nth-child(13) > .govuk-label').should('contain', 'Urgency');
        cy.get('.govuk-table__body > :nth-child(1) > :nth-child(1)').should('contain', '02:32:24')
    });

    it('should return to the hearing transcripts tab', () => {
        cy.get('#hearingsTable a').contains('1 Sep 2023').click();
        cy.get(':nth-child(2) > .moj-sub-navigation__link').click();
        cy.get('.govuk-caption-l').should('contain', 'Hearing');
        cy.get('.govuk-heading-l').should('contain', '1 Sep 2023');
        cy.get('app-hearing-file > div > :nth-child(3)').should('contain', 'Courthouse');
        cy.get('app-hearing-file > div > :nth-child(4)').should('contain', 'Swansea');
        cy.get('app-hearing-file > div > :nth-child(5)').should('contain', 'Courtroom');
        cy.get('app-hearing-file > div > :nth-child(6)').should('contain', '3');
        cy.get('app-hearing-file > div > :nth-child(7)').should('contain', 'Judge(s)');
        cy.get('app-hearing-file > div > :nth-child(8)').should('contain', 'HHJ M. Hussain KC');
        cy.get('.flex-space-between > .govuk-heading-m').should('contain', 'Transcripts for this hearing');
        cy.get('.govuk-table__body > :nth-child(1) > :nth-child(1)').should('contain', 'Sentencing remarks');
        cy.get('.govuk-button').should('contain', 'Request a new transcript');
        cy.get('.govuk-button').click();
        cy.get('h1.govuk-heading-s').should('contain', 'Case ID');
        cy.get('h1.govuk-body').should('contain', 'C20220620001');
        cy.get('.govuk-link').click();

        cy.get('.govuk-caption-l').should('contain', 'Hearing');
        cy.get('.govuk-heading-l').should('contain', '1 Sep 2023');
        cy.get('app-hearing-file > div > :nth-child(3)').should('contain', 'Courthouse');
        cy.get('app-hearing-file > div > :nth-child(4)').should('contain', 'Swansea');
        cy.get('app-hearing-file > div > :nth-child(5)').should('contain', 'Courtroom');
        cy.get('app-hearing-file > div > :nth-child(6)').should('contain', '3');
        cy.get('app-hearing-file > div > :nth-child(7)').should('contain', 'Judge(s)');
        cy.get('app-hearing-file > div > :nth-child(8)').should('contain', 'HHJ M. Hussain KC');
        cy.get('.flex-space-between > .govuk-heading-m').should('contain', 'Transcripts for this hearing');
        cy.get('.govuk-table__body > :nth-child(1) > :nth-child(1)').should('contain', 'Sentencing remarks');
        cy.get('.govuk-button').should('contain', 'Request a new transcript');
    });

    it("should show errors if the form isn't filled in", () => {
        cy.get('#hearingsTable a').contains('1 Sep 2023').click();
        cy.get(':nth-child(2) > .moj-sub-navigation__link').click();
        cy.get('.govuk-caption-l').should('contain', 'Hearing');
        cy.get('.govuk-heading-l').should('contain', '1 Sep 2023');
        cy.get('app-hearing-file > div > :nth-child(3)').should('contain', 'Courthouse');
        cy.get('app-hearing-file > div > :nth-child(4)').should('contain', 'Swansea');
        cy.get('app-hearing-file > div > :nth-child(5)').should('contain', 'Courtroom');
        cy.get('app-hearing-file > div > :nth-child(6)').should('contain', '3');
        cy.get('app-hearing-file > div > :nth-child(7)').should('contain', 'Judge(s)');
        cy.get('app-hearing-file > div > :nth-child(8)').should('contain', 'HHJ M. Hussain KC');
        cy.get('.flex-space-between > .govuk-heading-m').should('contain', 'Transcripts for this hearing');
        cy.get('.govuk-table__body > :nth-child(1) > :nth-child(1)').should('contain', 'Sentencing remarks');
        cy.get('.govuk-button').should('contain', 'Request a new transcript');
        cy.get('.govuk-button').click();
        cy.get('h1.govuk-heading-s').should('contain', 'Case ID');
        cy.get('h1.govuk-body').should('contain', 'C20220620001');

        cy.get('.govuk-button').click();
        cy.get('.govuk-list > :nth-child(1) > a').should('contain', 'Please select a transcription type');
        cy.get('.govuk-list > :nth-child(2) > a').should('contain', 'Please select an urgency');
        cy.get(':nth-child(12) > #subject-error').should('contain', 'Please select a transcription type');
        cy.get(':nth-child(13) > #subject-error').should('contain', 'Please select an urgency');
    });
});
