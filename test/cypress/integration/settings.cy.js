// form_submit.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('Use Parameter tb=1 and check for menu icon', () =>
{
  before(() =>
  {
    cy.intercept('http://localhost:8080', { body: { success: true } }).as('submitForm')
    cy.visit('/en/settings');
  });

  it('open and close drawer', () =>
  {
    cy.get('[name="orgDesc"]').type('We\'ll become the best company');
    cy.get('[name="orgName"]').type('YAWIK AG');

  });

});
