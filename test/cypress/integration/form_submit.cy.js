// form_submit.spec.js
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('Filling and sending the form', () =>
{
  before(() =>
  {
    cy.intercept('http://localhost:8080', { body: { success: true } }).as('submitForm');
    cy.visit('/de/demo');
    // load job details
  });

  it('Step 1. Fill job_title, organization', () =>
  {
    // fill step 1 (general data)
    cy.get('[name="job_title"]').type('Software Developer');
    cy.get('[name="organization"]').type('CROSS Solution');
    cy.get('[name="apply_email"]').type('bleek@cross-solution.de');
    cy.get('[name="next"]').click();
  });

  it('Step 2. Fill text fields', () =>
  {
    // fill step 2 (cover letter)
    cy.get('[name="intro"]').type('We are a good company');
    cy.get('[name="tasks"]').type('Your tasks will be');
    cy.get('[name="profile"]').type('You should fullfill the requirements');
    cy.get('[name="offer"]').type('We offer you a lot');
    cy.get('[name="contactInfo"]').type('You should fullfill the requirements');
    cy.get('[name="next"]').click();
  });

  it('Step 3. fill categories', () =>
  {
    cy.get('[name="salary"]').parents('label').click();
    cy.get('.q-menu .q-item').contains('100.000€ - 120.000€').click();
    cy.get('[name="next"]').click();
  });

//  it('Step 4. Download', () =>
//  {
//    cy.get('.q-bar > .q-btn > .q-btn__content > .mdi').click();
//    cy.intercept('http://localhost:8080/en/demo', { body: { success: true } }).as('submitForm');
//    // submit form
//    cy.get('[name="next"]').click();
//  });

//  it('Check Preview', () =>
//  {
//    cy.get('[name="preview"]').click();
//    cy.get('iframe#jobpreview').invoke('attr', 'srcdoc').then( ($job) => {
//      cy.state('document').write($job)
//      cy.contains('CROSS Solution');
//      return null
//    })
//  });
});
