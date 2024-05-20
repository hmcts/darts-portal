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

    cy.get('#groups-table').should('contain', 'SUPER_ADMIN');
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

  it('view group details', () => {
    cy.get('#groups-table').contains('Judiciary').click();

    cy.get('h1').should('contain', 'Group details');
    cy.get('app-group-record').should('contain', 'Judiciary');
    cy.get('app-group-record').should('contain', 'Approver');

    cy.get('#courthouse-table').should('contain', 'Slough');
  });

  it('creates new group', () => {
    cy.get('button').contains('Create group').click();

    cy.get('#name').type('Test Group');
    cy.get('#description').type('Test description');
    cy.get('#role-TRANSCRIBER').click();

    cy.get('button').contains('Create group').click();

    cy.get('app-govuk-banner').should('contain', 'Group created');
    cy.get('h1').should('contain', 'Group details');

    cy.get('#group-name').should('contain', 'Test Group');
    cy.get('#group-description').should('contain', 'Test description');
    cy.get('#group-role').should('contain', 'Transcriber');
  });
});
