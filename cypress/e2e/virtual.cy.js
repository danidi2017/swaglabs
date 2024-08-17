describe('Proceso de compra', () => {
  it('Validar pagina de inicio', () => {
    cy.visit(Cypress.env('base_url'))
    cy.get(".login_logo").should("be.visible")
  })

const users = Cypress.env('users');

Object.entries(users).forEach(([username, password]) => {
  it('Validar inicio de sesion', () => {
    cy.visit(Cypress.env('base_url'))
    cy.get('[data-test="username"]').type(username)
    cy.get('[data-test="password"]').type(password)
    cy.get('[data-test="login-button"]').click()
  })
})

  it('Validar password invalido', () => {
    cy.visit(Cypress.env('base_url'))
    cy.get('[data-test="username"]').type("standard_user")
    cy.get('[data-test="password"]').type("12345")
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="error"]').contains("Epic sadface: Username and password do not match any user in this service")
  })

})

//it("inicio login", () => {
  //cy.get('a[data-target="#signInModal"]').click();
  //cy.get('input#sign-username').type("secret_sauce");
  //cy.get('login-button').click("Parco Qa");
//})
