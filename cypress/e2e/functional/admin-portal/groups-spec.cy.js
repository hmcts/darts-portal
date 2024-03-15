import 'cypress-axe';
import '../commands';
describe('Admin - Groups screen', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin/groups');
    cy.injectAxe();
  });

  it('load page', () => {
    cy.get('h1').should('contain', 'Groups');
    cy.a11y();
  });

  it('render groups table', () => {
    cy.get('#groups-table').should('contain', 'Judiciary');
    cy.get('#groups-table').should('contain', 'Approver');

    cy.get('#groups-table').should('contain', 'Opus Transcribers');
    cy.get('#groups-table').should('contain', 'Requestor');

    cy.get('#groups-table').should('contain', 'Super user (DARTS portal)');
    cy.get('#groups-table').should('contain', 'Judge');

    cy.get('#groups-table').should('contain', 'Admin (Admin portal)');
    cy.get('#groups-table').should('contain', 'Transcriber');

    cy.get('#groups-table').should('contain', 'Super admin (Admin portal)');
    cy.get('#groups-table').should('contain', 'Translation QA');
  });

  it('filter groups', () => {
    cy.get('#search').type('Judiciary');
    cy.get('#roles-filter').select('Approver');

    cy.get('#groups-table').should('contain', 'Judiciary');
    cy.get('#groups-table').should('contain', 'Approver');

    cy.get('#groups-table').should('not.contain', 'Opus Transcribers');
    cy.get('#groups-table').should('not.contain', 'Requestor');
  });
});
