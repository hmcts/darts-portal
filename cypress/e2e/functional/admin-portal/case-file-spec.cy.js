import 'cypress-axe';
import '../commands';

describe('Case file screen', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should go to admin case screen file from case search', () => {
    cy.visit('admin/search');

    cy.get('#confirm-button').click();

    cy.get('td.case_number a.govuk-link').first().click();

    cy.url().should('include', '/admin/case/1');
  });

  it('should show correct case file information', () => {
    cy.visit('admin/case/1');
    cy.injectAxe();

    cy.get('app-govuk-heading').should('contain.text', 'Case').should('contain.text', 'CASE1001');

    cy.get('h2.govuk-heading-m').should('contain.text', 'Case details');

    cy.get('.govuk-summary-list').within(() => {
      cy.get('.govuk-summary-list__row')
        .eq(0)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Case ID');
          cy.get('.govuk-summary-list__value').should('have.text', 'CASE1001');
        });

      cy.get('.govuk-summary-list__row')
        .eq(1)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Courthouse');
          cy.get('.govuk-summary-list__value').should('have.text', 'SWANSEA');
        });

      cy.get('.govuk-summary-list__row')
        .eq(2)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Judge(s)');
          cy.get('.govuk-summary-list__value').should('have.text', 'Mr Judge');
        });

      cy.get('.govuk-summary-list__row')
        .eq(3)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Defendant(s)');
          cy.get('.govuk-summary-list__value').should('have.text', 'Joe Bloggs');
        });

      cy.get('.govuk-summary-list__row')
        .eq(4)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Defence');
          cy.get('.govuk-summary-list__value').should('have.text', 'Mr Defender');
        });

      cy.get('.govuk-summary-list__row')
        .eq(5)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Prosecutor(s)');
          cy.get('.govuk-summary-list__value').should('have.text', 'Mrs Prosecutor');
        });

      cy.get('.govuk-summary-list__row')
        .eq(6)
        .within(() => {
          cy.get('.govuk-summary-list__key').should('have.text', 'Retained until');
          cy.get('.govuk-summary-list__value').first().should('contain.text', '31 Jan 2020');
        });

      cy.get('.govuk-summary-list__row')
        .eq(6)
        .within(() => {
          cy.get('.govuk-link').should('have.text', 'View or change').should('have.attr', 'href', '/case/1/retention');
        });
    });

    cy.a11y();
  });

  describe('Additional case details tab', () => {
    it('should verify additional case details', () => {
      cy.visit('admin/case/1');
      cy.injectAxe();

      cy.get('#additional-tab').click();

      cy.get('h2.govuk-heading-m').should('contain.text', 'Additional case details');

      cy.get('.govuk-summary-list')
        .eq(1)
        .within(() => {
          const expectedData = [
            ['Database ID', '1'],
            ['Case object ID', '12345'],
            ['Case object name', 'NAME'],
            ['Case type', 'Type A'],
            ['Upload priority', '0'],
            ['Case closed?', 'No'],
            ['Date case closed', '20/07/2023'],
            ['Interpreter used?', 'No'],
            ['Retention updated?', 'Yes'],
            ['Retention retries?', '0'],
            ['Case anonymised?', 'No'],
            ['Case anonymised by', '-'],
            ['Date anonymised', '01/01/2024'],
            ['Retention confidence score', '123'],
            ['Retention confidence reason', 'Some reason'],
            ['Retention confidence date updated', '01/01/2024'],
            ['Case deleted?', 'No'],
            ['Case deleted by', '-'],
            ['Date deleted', '01/01/2024'],
            ['Date created', '01/01/2024'],
            ['Created by', 'Michael van Gerwen'],
            ['Date last modified', '01/01/2024'],
            ['Last modified by', 'Fallon Sherrock'],
          ];

          expectedData.forEach(([key, value], index) => {
            cy.get('.govuk-summary-list__row')
              .eq(index)
              .within(() => {
                cy.get('.govuk-summary-list__key').should('have.text', key);
                cy.get('.govuk-summary-list__value').should('contain.text', value);
              });
          });
        });

      cy.a11y();
    });
  });

  describe('Audio details tab', () => {
    beforeEach(() => {
      cy.visit('admin/case/1');
      cy.get('#audio-tab').click();
    });

    it('should display all expected column headers', () => {
      cy.get('app-govuk-heading').should('contain.text', 'Audio');
      const expectedHeaders = ['Audio ID', 'Courtroom', 'Start time', 'End time', 'Channel'];

      cy.get('#case-audio-table thead th button')
        .should('have.length', expectedHeaders.length)
        .each(($el, index) => {
          cy.wrap($el).should('contain.text', expectedHeaders[index]);
        });
    });

    it('should render audio rows with links and valid courtroom/cell data', () => {
      cy.get('#case-audio-table tbody tr').should('have.length', 500);

      cy.get('#case-audio-table tbody tr').each(($row, index) => {
        if (index < 10) {
          cy.wrap($row).within(() => {
            cy.get('td').eq(0).find('a').should('have.attr', 'href').and('include', '/admin/audio-file/');
            cy.get('td').eq(1).should('contain.text', 'Courtroom');
            cy.get('td').eq(2).invoke('text').should('match', /AM|PM/);
            cy.get('td').eq(3).invoke('text').should('match', /AM|PM/);
            cy.get('td').eq(4).invoke('text').should('match', /^\d+$/);
          });
        }
      });
    });

    it('should display rows for page 1 and then update when navigating to page 2', () => {
      cy.get('#case-audio-table tbody tr')
        .first()
        .find('td')
        .eq(0)
        .invoke('text')
        .then((firstPageFirstId) => {
          cy.get('a[data-test-page-button]').contains('2').click();

          cy.get('#case-audio-table tbody tr')
            .first()
            .find('td')
            .eq(0)
            .invoke('text')
            .should((secondPageFirstId) => {
              expect(secondPageFirstId.trim()).not.to.equal(firstPageFirstId.trim());
            });
        });
    });
  });

  describe('Hearing details tab', () => {
    it('should show correct case hearing information', () => {
      cy.visit('admin/case/1');

      cy.get('app-govuk-heading').should('contain.text', 'Case').should('contain.text', 'CASE1001');

      cy.get('#hearingsTable thead tr').within(() => {
        cy.get('th').eq(0).should('contain.text', 'Hearing date');
        cy.get('th').eq(1).should('contain.text', 'Judge');
        cy.get('th').eq(2).should('contain.text', 'Courtroom');
        cy.get('th').eq(3).should('contain.text', 'No. of transcripts');
      });

      cy.get('#hearingsTable tbody tr')
        .eq(0)
        .within(() => {
          cy.get('td').eq(0).should('contain.text', '01 Sep 2023');
          cy.get('td').eq(1).should('contain.text', 'HHJ M. Hussain KC');
          cy.get('td').eq(2).should('contain.text', '3');
          cy.get('td').eq(3).should('contain.text', '1');
        });

      cy.get('#hearingsTable tbody tr')
        .eq(1)
        .within(() => {
          cy.get('td').eq(0).should('contain.text', '10 Oct 2023');
          cy.get('td').eq(1).should('contain.text', 'Judge Jonny');
          cy.get('td').eq(2).should('contain.text', '4');
          cy.get('td').eq(3).should('contain.text', '2');
        });

      cy.get('#hearingsTable tbody tr')
        .eq(0)
        .within(() => {
          cy.get('td')
            .eq(0)
            .find('a')
            .should('have.attr', 'href', '/admin/case/1/hearing/1?backUrl=%2Fadmin%2Fcase%2F1')
            .click();
        });

      cy.url().should('include', '/admin/case/1/hearing/1');
    });
  });

  describe('Transcripts tab', () => {
    it('should render the transcripts tab and display transcript table', () => {
      cy.visit('admin/case/1');
      cy.injectAxe();

      cy.get('#transcripts-tab').click();

      cy.get('#transcripts-tab').should('have.attr', 'aria-current', 'page');

      cy.get('app-govuk-heading h2').should('contain.text', 'Transcripts');

      cy.get('#transcriptsTable').should('exist');

      cy.get('#transcriptsTable tbody tr').should('have.length.at.least', 6);
      cy.get('#transcriptsTable thead th').then((headers) => {
        const headerTexts = [...headers].map((el) => el.innerText.trim());
        expect(headerTexts).to.deep.equal([
          'Request ID',
          'Courtroom',
          'Type',
          'Requested on',
          'Requested by',
          'Status',
        ]);
      });

      cy.get('#transcriptsTable tbody tr')
        .first()
        .within(() => {
          cy.get('td').eq(0).find('a').should('contain.text', '1');
          cy.get('td').eq(1).should('contain.text', '1');
          cy.get('td').eq(2).should('contain.text', 'Sentencing remarks');
          cy.get('td').eq(3).should('contain.text', '01 Jan 2024 00:00:00');
          cy.get('td').eq(4).should('contain.text', 'Scott Smith');
          cy.get('td')
            .eq(5)
            .find('.govuk-tag')
            .should('contain.text', 'Requested')
            .and('have.class', 'govuk-tag--blue');
        });
    });
  });

  describe('Case file screen - Events tab', () => {
    it('should render the Events tab with expected table headers and data', () => {
      cy.visit('admin/case/1');

      cy.get('#events-tab').click();

      cy.get('h2.govuk-heading-m').should('contain.text', 'Events');

      cy.get('#court-log-table').should('exist');

      cy.get('#court-log-table thead tr').within(() => {
        const expectedHeaders = ['Event ID', 'Hearing date', 'Time', 'Event', 'Courtroom', 'Text'];
        expectedHeaders.forEach((header, index) => {
          cy.get('th').eq(index).should('contain.text', header);
        });
      });

      cy.get('#court-log-table tbody tr')
        .first()
        .within(() => {
          cy.get('td').eq(0).find('a').should('have.attr', 'href').and('include', '/admin/events/1');
          cy.get('td').eq(1).should('contain.text', '24 Apr 2024');
          cy.get('td').eq(2).should('contain.text', '15:30:00');
          cy.get('td').eq(3).should('contain.text', 'Event one name');
          cy.get('td').eq(4).should('contain.text', 'Courtroom 101');
          cy.get('td').eq(5).should('contain.text', 'Event one text');
        });

      cy.get('#court-log-table tbody tr')
        .last()
        .within(() => {
          cy.get('td')
            .eq(5)
            .find('p.govuk-hint')
            .should('contain.text', 'The event text has been anonymised in line with HMCTS policy');
        });
    });
  });
});
