describe('Pruebas de Login, Logout: Swag Labs', () => {

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

            it('Validar pagina de inicio', () => {
                cy.get(".login_logo").should("be.visible")
            })

            const valid_users = Cypress.env('valid_users');

            Object.entries(valid_users).forEach(([username, password]) => {
                it('Validar inicio de sesion', () => {
                    cy.get('[data-test="username"]').type(username)
                    cy.get('[data-test="password"]').type(password)
                    cy.get('[data-test="login-button"]').click()
                })
            })

            const invalid_users = Cypress.env('invalid_users');

            Object.entries(invalid_users).forEach(([username, password]) => {
                it('Validar password invalido', () => {
                    cy.get('[data-test="username"]').type(username)
                    cy.get('[data-test="password"]').type(password)
                    cy.get('[data-test="login-button"]').click()
                    cy.get('[data-test="error"]').contains("Epic sadface: Username and password do not match any user in this service")
                })
            })

            it('Validar password Requerido', () => {
                cy.get('[data-test="username"]').type(Cypress.env('default_user'))
                cy.get('[data-test="password"]').clear()
                cy.get('[data-test="login-button"]').click()
                cy.get('[data-test="error"]').contains("Epic sadface: Password is required")
            })

            it('Validar cierre de Sesión', () => {
                cy.get('[data-test="username"]').type(Cypress.env('default_user'))
                cy.get('[data-test="password"]').type(Cypress.env('default_password'))
                cy.get('[data-test="login-button"]').click()
                cy.get('[id="react-burger-menu-btn"]').click()
                cy.get('[data-test="logout-sidebar-link"]').click()
                cy.get('[data-test="login-credentials"]')
                cy.get('[data-test="login-password"]')
                cy.get('[data-test="login-button"]').contains("Login")
            })

        });
    });
})