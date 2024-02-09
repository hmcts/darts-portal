import 'cypress-axe';
import './commands';

describe('All Annotations', () => {
    it('shows All annotations uploaded by judge against a case', () => {
        cy.login('judge');
        cy.injectAxe();

        cy.contains('Search').click();
        cy.get('h1').should('contain', 'Search for a case');
        cy.get('#case_number').type('C20220620001');
        cy.get('button').contains('Search').click();

        cy.contains('C20220620001').click();

        cy.contains('All annotations').click();

        cy.get('#annotationsTable')
            .find('tr')
            .then((rows) => {
                expect(rows.length).equal(3); // 3 including header row
            });

        cy.a11y();
    });

    it('shows All annotations uploaded by admin against a case', () => {
        cy.login('admin');
        cy.injectAxe();

        cy.contains('Search').click();
        cy.get('h1').should('contain', 'Search for a case');
        cy.get('#case_number').type('C20220620001');
        cy.get('button').contains('Search').click();

        cy.contains('C20220620001').click();

        cy.contains('All annotations').click();

        cy.get('#annotationsTable')
            .find('tr')
            .then((rows) => {
                expect(rows.length).equal(3); // 3 including header row
            });

        cy.a11y();
    });

    it('shows all annotations count for number of annotations in a blue notification blob', () => {
        cy.login('judge');
        cy.injectAxe();

        cy.contains('Search').click();
        cy.get('h1').should('contain', 'Search for a case');
        cy.get('#case_number').type('C20220620001');
        cy.get('button').contains('Search').click();

        cy.contains('C20220620001').click();

        cy.get('#annotation-count').should('contain', '2');

        cy.a11y();
    });

    it('shows no annotations count for no annotations and shows no annotations message', () => {
        cy.login('judge');
        cy.injectAxe();

        cy.contains('Search').click();
        cy.get('h1').should('contain', 'Search for a case');
        cy.get('#case_number').type('ALL');
        cy.get('button').contains('Search').click();

        cy.contains('C20220620003').click();

        cy.get('#annotation-count').should('contain', '');

        cy.contains('All annotations').click();

        cy.get('h2').should('contain', 'All annotations');

        cy.get('#no-data-message').should('contain', 'There are no annotations for this case. Annotations added to hearings will be listed here.');

        cy.a11y();
    });

    it('Hyperlink hearing date takes judge/admin to annotations tab at hearing level', () => {
        cy.login('judge');
        cy.injectAxe();

        cy.contains('Search').click();
        cy.get('h1').should('contain', 'Search for a case');
        cy.get('#case_number').type('ALL');
        cy.get('button').contains('Search').click();

        cy.contains('C20220620001').click();

        cy.contains('All annotations').click();

        cy.contains('14 Dec 2023').click();

        cy.get('h1').should('contain', 'Hearing');

        cy.get('a.moj-sub-navigation__link').should('contain', 'Annotations');

        cy.a11y();
    });

    it('users other than judge/admin, such as transcriber, cannot see the all annotations tab', () => {
        cy.login('transcriber');
        cy.injectAxe();

        cy.contains('Search').click();
        cy.get('h1').should('contain', 'Search for a case');
        cy.get('#case_number').type('C20220620001');
        cy.get('button').contains('Search').click();

        cy.contains('C20220620001').click();

        cy.should('not.exist', 'All annotations');

        cy.a11y();
    });
});
