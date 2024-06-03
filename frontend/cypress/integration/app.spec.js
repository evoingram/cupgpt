describe('App', () => {
  it('loads successfully', () => {
    cy.visit('/');
    cy.contains('CupGPT Coding Monkey Wizard');
  });
});
