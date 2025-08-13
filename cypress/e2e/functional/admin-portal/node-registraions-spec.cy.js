import 'cypress-axe';
import '../commands';

describe('Admin - Node registrations screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/system-configuration/node-registrations');
    cy.injectAxe();
  });

  it('show node registrations table', () => {
    const expectedColumns = [
      'Node ID',
      'Courthouse',
      'Courtroom',
      'IP address',
      'Hostname',
      'MAC address',
      'Node type',
      'Created at',
      'Created by',
    ];

    cy.get('#node-registrations-table thead tr.header th button')
      .should('have.length', expectedColumns.length)
      .each(($btn, index) => {
        cy.wrap($btn).should('contain.text', expectedColumns[index]);
      });

    cy.a11y();
  });

  it('should filter rows based on courthouse input', () => {
    cy.get('#node-registrations-table tbody tr').should('have.length.greaterThan', 5);

    // Type "Newport" into the filter input
    cy.get('input#courthouse').clear().type('Newport');

    // Verify all rows have "Basildon" in the second <td>
    cy.get('#node-registrations-table tbody tr').each(($row) => {
      cy.wrap($row).find('td').eq(1).should('contain.text', 'Newport');
    });
  });

  it('should show no rows for non-matching input', () => {
    cy.get('input#courthouse').clear().type('Nowhere');

    cy.get('#node-registrations-table tbody tr').should('have.length', 0);
  });

  it('should reset filter and show all results when input is cleared', () => {
    cy.get('input#courthouse').clear().type('Swansea');

    cy.get('#node-registrations-table tbody tr').should('have.length.greaterThan', 0);

    cy.get('input#courthouse').clear();

    cy.get('#node-registrations-table tbody tr').should('have.length.greaterThan', 10);
  });
});
