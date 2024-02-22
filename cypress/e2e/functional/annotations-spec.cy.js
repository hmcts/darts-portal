import 'cypress-axe';
import './commands';
const path = require('path');
const downloadsFolder = Cypress.config('downloadsFolder');

describe('Annotations', () => {
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

    cy.get('#no-data-message').should(
      'contain',
      'There are no annotations for this case. Annotations added to hearings will be listed here.'
    );

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

    cy.contains('1 Dec 2023').click();

    cy.get('h1').should('contain', 'Hearing');

    cy.get('a.moj-sub-navigation__link').should('contain', 'Annotations');
    // Now we've gone to the hearing page, the annotation count should only be one
    cy.get('#annotation-count').should('contain', '1');
    cy.get('#annotationsTable')
      .find('tr')
      .then((rows) => {
        expect(rows.length).equal(2); // 2 including header row as there's only one entry
      });
    const fileName = 'AnnotationBeta.doc';
    // Download the annotation
    cy.get('#annotationsTable')
      .contains(fileName)
      .parent('tr')
      .then((row) => {
        cy.wrap(row).find('td').contains('Download').click();
      });
    cy.readFile(path.join(downloadsFolder, fileName)).should('exist');

    // Delete the annotation
    cy.get('#annotationsTable')
      .contains(fileName)
      .parent('tr')
      .then((row) => {
        cy.wrap(row).find('td').contains('Delete').click();
      });

    cy.contains('Are you sure you want to delete this item?');
    cy.contains('Yes - delete').click();

    cy.get('#no-data-message').should('contain', 'There are no annotations for this hearing.');

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

  it('download an annotation file at case level', () => {
    cy.login('judge');
    cy.injectAxe();

    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('#case_number').type('C20220620001');
    cy.get('button').contains('Search').click();

    cy.contains('C20220620001').click();

    cy.get('#annotation-count').should('contain', '2');

    cy.contains('All annotations').click();

    const fileName = 'AnnotationBeta.doc';
    cy.get('#annotationsTable')
      .contains(fileName)
      .parent('tr')
      .then((row) => {
        cy.wrap(row).find('td').contains('Download').click();
      });

    cy.readFile(path.join(downloadsFolder, fileName)).should('exist');

    cy.a11y();
  });

  it('Upload Annotation against a hearing', () => {
    cy.login('judge');
    cy.injectAxe();

    cy.contains('Search').click();
    cy.get('h1').should('contain', 'Search for a case');
    cy.get('#case_number').type('ALL');
    cy.get('button').contains('Search').click();

    cy.contains('C20220620001').click();

    cy.contains('All annotations').click();

    cy.contains('1 Dec 2023').click();

    cy.get('h1').should('contain', 'Hearing');

    cy.get('a.moj-sub-navigation__link').should('contain', 'Annotations');
    // Now we've gone to the hearing page, the annotation count should only be one
    cy.get('#annotation-count').should('contain', '1');
    cy.get('#annotationsTable')
      .find('tr')
      .then((rows) => {
        expect(rows.length).equal(2); // 2 including header row as there's only one entry
      });
    const fileName = 'AnnotationBeta.doc';
    // Download the annotation
    cy.get('#annotationsTable')
      .contains(fileName)
      .parent('tr')
      .then((row) => {
        cy.wrap(row).find('td').contains('Download').click();
      });
    cy.readFile(path.join(downloadsFolder, fileName)).should('exist');

    // Delete the annotation
    cy.get('#annotationsTable')
      .contains(fileName)
      .parent('tr')
      .then((row) => {
        cy.wrap(row).find('td').contains('Delete').click();
      });

    cy.contains('Are you sure you want to delete this item?');
    cy.contains('Yes - delete').click();

    cy.get('#no-data-message').should('contain', 'There are no annotations for this hearing.');

    cy.contains('Upload annotation').click();

    cy.get('input[type=file]').selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName: 'file.docx',
      lastModified: Date.now(),
    });

    cy.get('#annotation-comments').type('Test');

    cy.get('#annotation-comments-hint').should('contain', 'You have 196 characters remaining');

    cy.get('#upload-button').click();

    cy.get('.govuk-panel__title').should('contain', 'You have added an annotation');

    cy.a11y();
  });
});
