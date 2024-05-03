import 'cypress-axe';
import '../commands';

describe('Admin - Courthouse record screen', () => {
    beforeEach(() => {
        cy.login('admin');
        cy.injectAxe();
        cy.visit('/admin/courthouses');
    });

    it('View courthouse users', () => {
        cy.get('#courthouseName').type('Oxford').click();
        cy.get('button[type="submit"]').click();

        cy.get('td').contains('OXFORD').click();
        cy.contains('h1', 'Oxford').should('exist');

        // Check tabs
        cy.get('.moj-sub-navigation a').contains('Users').click();

        cy.contains('Michael van Gerwen').parents('tr').should('contain', 'michael.vangerwen@darts.local').should('contain', 'Approver');
    });

    it('should filter users based on user name and role type', () => {
        cy.get('#courthouseName').type('Oxford').click();
        cy.get('button[type="submit"]').click();

        cy.get('td').contains('OXFORD').click();
        cy.contains('h1', 'Oxford').should('exist');

        // Check tabs
        cy.get('.moj-sub-navigation a').contains('Users').click();

        // open both expandable filter menus
        cy.get('.moj-pagination__link').click({ multiple: true });

        cy.get('#search-filter-0').type('Michael van Gerwen');
        cy.get('.govuk-checkboxes__item').get('.govuk-checkboxes__input').first().click();
        cy.get('#apply-filters-button').click();

        cy.get('#users-table').should('contain', 'Requestor');
        cy.get('#users-table').should('contain', 'Approver');

        cy.get('#users-table')
            .find('tr')
            .then((rows) => {
                expect(rows.length).equal(3); // 3 including header row
            });

        cy.get('.govuk-checkboxes__item').get('.govuk-checkboxes__input').eq(2).click();
        cy.get('#apply-filters-button').click();

        cy.get('#users-table').contains('Requestor').should('not.exist');
        cy.get('#users-table').should('contain', 'Approver');

        cy.get('#users-table')
            .find('tr')
            .then((rows) => {
                expect(rows.length).equal(2); // 2 including header row
            });

        cy.get('.moj-filter__tag').first().click();
        cy.get('#apply-filters-button').click();

        cy.get('#users-table')
            .find('tr')
            .then((rows) => {
                expect(rows.length).equal(3); // 3 including header row
            });
        cy.get('#users-table').should('contain', 'Eric Bristow');

        cy.get('#clear-filters-button').click();
        cy.get('#users-table')
            .find('tr')
            .then((rows) => {
                expect(rows.length).equal(5); // 5 including header row
            });
    });
});
