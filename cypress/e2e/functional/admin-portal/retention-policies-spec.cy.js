import 'cypress-axe';
import '../commands';

describe('Admin - Retention Policies screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/retention-policies');
    cy.injectAxe();
  });

  it('should show active policies', () => {
    cy.get('#active-policies-table')
      .find('tr')
      .then((rows) => {
        expect(rows.length).equal(3); // 3 including header row
      });

    cy.get('#active-policies-table').contains('td', '-');
    cy.get('#active-policies-table').contains('td', '01 Jan 2099 12:00 AM');
  });
  it('should show inactive policies', () => {
    cy.contains('Inactive').click();
    cy.get('#inactive-policies-table')
      .find('tr')
      .then((rows) => {
        expect(rows.length).equal(2); // 2 including header row
      });

    cy.get('#inactive-policies-table').contains('td', '31 Jan 2024 12:00 AM');
  });
});

// cy.get('#annotationsTable')
//     .contains(fileName)
//     .parent('tr')
//     .then((row) => {
//         cy.wrap(row).find('td').contains('Download').click();
//     });
