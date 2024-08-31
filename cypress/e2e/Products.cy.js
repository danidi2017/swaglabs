describe('Pruebas de los Productos: Swag Labs', () => {

  const viewports = Cypress.env('viewports');

  // Itera sobre cada viewport
  viewports.forEach((viewport) => {
    describe(`Pruebas en ${viewport.device}`, () => {
      beforeEach(() => {
        // Limpiar cookies y local storage antes de toda la suite de pruebas
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit(Cypress.env('base_url'))
        cy.viewport(viewport.width, viewport.height);
      });

      it('Validar pantalla de Productos', () => {
        cy.get('[data-test="username"]').type(Cypress.env('default_user'))
        cy.get('[data-test="password"]').type(Cypress.env('default_password'))
        cy.get('[data-test="login-button"]').click()
        cy.get('[data-test="title"]').contains("Products")
      })

      //Otras pruebas ...

    });
  });

})