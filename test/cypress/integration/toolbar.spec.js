// form_submit.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe("Use Parameter tb=1 and check for menu icon", () => {
  before(() => {
    cy.intercept("http://localhost:8080", { body: { success: true } }).as(
      "submitForm"
    );
    cy.visit("/en/demo");
  });

  it("open and close drawer", () => {
    cy.get(".q-drawer__content").should("not.be.visible");
    // check for menu-open icon
    cy.get(".mdi-menu-open").click();
    cy.get(".q-drawer__content").should("be.visible");
    // check for menu icon
    cy.get(".mdi-menu").click();
    cy.get(".q-drawer__content").should("not.be.visible");
  });

  it("click on dark mode toggle", () => {
    cy.get(".mdi-white-balance-sunny").click();
    cy.get("body").should("have.class", "body--dark");
    cy.get(".mdi-weather-night").click();
    cy.get("body").should("have.class", "body--light");
    cy.get(".mdi-white-balance-sunny").click();
    cy.get("body").should("have.class", "body--dark");
    cy.get(".mdi-weather-night").click();
    cy.get("body").should("have.class", "body--light");
  });
});
