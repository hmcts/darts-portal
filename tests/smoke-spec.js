describe("An example", () => {
    before(() => {
      // Here you can setup your tests.
      // As example, you could log in to your application.
      prepareYourTest();
    });
  
    it("Should load", () => {
      cy.visit(
        `${Cypress.env('HOST')}/test-url`
      );
       // (or,  if your H1 doesn't appear, it will fail after a timeout).
      cy.get("h1").should("contain", "Darts Portal!");
      // Let's also confirm that we are on the right URL.
      cy.url().should("include", "test-url");
  

    });
  });