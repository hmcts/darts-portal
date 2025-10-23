export const clickButton = (text) =>
  cy.contains('button, [role="button"]', new RegExp(`^${text}$`, 'i')).click({ force: true });

export const clickLabel = (text) => cy.contains('.govuk-label, label', new RegExp(text, 'i')).click({ force: true });

const EXTERNAL_EMAIL = 'darts.transcriber@hmcts.net';

export function isDevPreview() {
  const base = String(Cypress.config('baseUrl') || '').toLowerCase();
  return /https?:\/\/darts-portal-pr-\d+\.dev\.platform\.hmcts\.net/.test(base);
}

export function externalPortalLogin() {
  const B2C_ORIGIN = 'https://hmctsstgextid.b2clogin.com';

  // Portal-side diagnostics
  cy.intercept('GET', '**/oauth2/v2.0/authorize**').as('aadAuthorize');
  cy.intercept('GET', 'https://js.monitor.azure.com/**', { statusCode: 204, body: {} });

  // Kick off login
  clickLabel('I work with the HM Courts and Tribunals Service');
  clickButton('Continue');

  // Log authorize params
  cy.wait('@aadAuthorize', { timeout: 60_000 }).then(({ request }) => {
    const u = new URL(request.url);
    const qs = new URLSearchParams(u.search);
    const payload = {
      clientId: qs.get('client_id'),
      redirectUri: decodeURIComponent(qs.get('redirect_uri') || ''),
      responseType: qs.get('response_type'),
      responseMode: qs.get('response_mode'),
      policy: qs.get('p') || qs.get('policy') || '(none)',
    };
    cy.wrap(payload).as('b2cAuth');
    cy.log('B2C authorize: ' + JSON.stringify(payload));
  });

  const user = EXTERNAL_EMAIL;
  const pass = Cypress.env('AUTOMATION_PASSWORD') || Cypress.env('EXTERNAL_AUTOMATION_PASSWORD');
  expect(pass, 'external password env').to.be.a('string').and.to.have.length.of.at.least(6);
  cy.log(`external password length: ${pass.length}`);

  // IdP interactions must be inside cy.origin
  cy.origin(B2C_ORIGIN, { args: { user, pass } }, ({ user, pass }) => {
    const emailSel = 'input[name="signInName"], input[name="logonIdentifier"], #email, input[type="email"]';
    const passSel = 'input[name="password"], #password, input[type="password"]';

    // helpers
    const getVisible = (sel) =>
      cy.get(sel, { timeout: 30_000 }).filter(':visible').first().should('be.enabled').scrollIntoView();

    const typeExact = (sel, value, label = 'field') =>
      getVisible(sel).then(($input) => {
        const tryType = (delay) => {
          cy.wrap($input).clear({ force: true });
          cy.wait(150); // tiny guard after focus
          cy.wrap($input).type(value, { log: false, delay });
          cy.wrap($input)
            .invoke('val')
            .then((v) => {
              const got = (v || '').length;
              const want = value.length;
              if (got !== want) {
                if (delay >= 60) throw new Error(`Failed to type full ${label}: got ${got}/${want}`);
                cy.log(`Retry typing ${label}: got ${got}/${want}, retry slower`);
                tryType(60);
              }
            });
        };
        tryType(35);
      });

    const clickOrSubmit = () => {
      cy.get('body').then(($body) => {
        const $btn = $body
          .find('button, input[type="submit"]')
          .filter((_, el) => /^(sign in|continue|next|yes|ok)$/i.test((el.innerText || el.value || '').trim()))
          .first();
        if ($btn.length) {
          cy.wrap($btn).click({ force: true });
        } else {
          cy.get('form').first().submit();
        }
      });
    };

    // Email first
    typeExact(emailSel, user, 'email');

    // If password on same step, type then submit; else go to next step first
    cy.get('body').then(($b) => {
      const hasPassHere = $b.find(passSel).length > 0;

      if (hasPassHere) {
        cy.wait(250);
        typeExact(passSel, pass, 'password');
        clickOrSubmit();
      } else {
        clickOrSubmit();
        cy.wait(250);
        typeExact(passSel, pass, 'password');
        clickOrSubmit();
      }
    });

    // Interstitials
    const clickPrimary = () =>
      cy
        .contains('button, input[type="submit"], a[role="button"]', /^(continue|accept|yes|ok|no|agree|confirm)$/i)
        .first()
        .click({ force: true });

    cy.get('body', { timeout: 20_000 }).then(($b) => {
      const t = $b.text();
      if (/Stay signed in\?/i.test(t)) cy.contains('button', /^No$/i).click({ force: true });
      if (/Permissions requested|Review permissions|Consent/i.test(t)) clickPrimary();
      if (/\bContinue\b/i.test(t)) clickPrimary();
    });
  });

  // Caller asserts we returned to portal.
}
