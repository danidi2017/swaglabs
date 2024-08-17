describe('Proceso de compra', () => {
  beforeEach(() => {
    // Limpiar cookies y local storage antes de toda la suite de pruebas
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(Cypress.env('base_url'))
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

  it('Validar pantalla de Productos', () => {
    cy.get('[data-test="username"]').type(Cypress.env('default_user'))
    cy.get('[data-test="password"]').type(Cypress.env('default_password'))
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="title"]').contains("Products")
  })

  it('Validar adición de Productos al Carrito', () => {
    cy.get('[data-test="username"]').type(Cypress.env('default_user'))
    cy.get('[data-test="password"]').type(Cypress.env('default_password'))
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="title"]').contains("Products")
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click()
  })

  it('Validar aumento de Productos en el ícono del Carrito', () => {
    cy.get('[data-test="username"]').type(Cypress.env('default_user'))
    cy.get('[data-test="password"]').type(Cypress.env('default_password'))
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click()
    cy.get('[data-test="shopping-cart-badge"]').contains("3")
  })

  it('Validar disminución de Productos en el ícono del Carrito', () => {
    cy.get('[data-test="username"]').type(Cypress.env('default_user'))
    cy.get('[data-test="password"]').type(Cypress.env('default_password'))
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click()
    cy.get('[data-test="remove-sauce-labs-backpack"]').click()
    cy.get('[data-test="remove-sauce-labs-bike-light"]').click()
    cy.get('[data-test="shopping-cart-badge"]').contains("1")
  })

  it('Validar Acceso a el Carrito', () => {
    cy.get('[data-test="username"]').type(Cypress.env('default_user'))
    cy.get('[data-test="password"]').type(Cypress.env('default_password'))
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="shopping-cart-link"]').click()
    cy.get('[data-test="title"]').contains("Your Cart")
  })

  it('Validar Productos añadidos al Carrito', () => {
    cy.get('[data-test="username"]').type(Cypress.env('default_user'))
    cy.get('[data-test="password"]').type(Cypress.env('default_password'))
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click()
    cy.get('[data-test="shopping-cart-link"]').click()
    cy.get('[data-test="inventory-item"]').should('have.length', 3)
  })

  it('Validar cantidad errónea de Productos añadidos al Carrito', () => {
    cy.on('fail', (error, runnable) => {
      // Verifica que el error sea el esperado
      expect(error.message).to.include("Timed out retrying after 4000ms: Not enough elements found. Found '3', expected '4'.");
      return false; // Prevenir que Cypress marque el test como fallido
    });
    cy.get('[data-test="username"]').type(Cypress.env('default_user'))
    cy.get('[data-test="password"]').type(Cypress.env('default_password'))
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click()
    cy.get('[data-test="shopping-cart-link"]').click()
    cy.get('[data-test="inventory-item"]').should('have.length', 4)
  })

  it('Validar Productos removidos del Carrito', () => {
    cy.get('[data-test="username"]').type(Cypress.env('default_user'))
    cy.get('[data-test="password"]').type(Cypress.env('default_password'))
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click()
    cy.get('[data-test="shopping-cart-link"]').click()
    cy.get('[data-test="remove-sauce-labs-backpack"]').click()
    cy.get('[data-test="remove-sauce-labs-bike-light"]').click()
    cy.get('[data-test="inventory-item"]').should('have.length', 1)
  })

  it.only('Validar autenticidad de los Productos añadidos al Carrito', () => {
    cy.get('[data-test="username"]').type(Cypress.env('default_user'));
    cy.get('[data-test="password"]').type(Cypress.env('default_password'));
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

    // Array con los nombres de los productos seleccionados a comparar
    const productNames = [];

    // Captura los nombres de los productos de la página de inventario donde el botón tiene el texto "Remove"
    cy.get('[data-test="inventory-item-description"]').each(($el) => {
      // Verifica si el botón contiene el texto "Remove"
      cy.wrap($el).find('button').then($button => {
        if ($button.text().includes('Remove')) {
          cy.wrap($el).find('[data-test="inventory-item-name"]').invoke('text').then((text) => { productNames.push(text.trim()); });
        }
      });
    }).then(() => {

      //console.log("Product Names:", productNames);

      cy.get('[data-test="shopping-cart-link"]').click(); //Ingreso al Carrito de Compras

      // Array con los nombres de los productos presentes en el carrito
      const cartProductNames = [];

      // Captura los nombres de los productos en el carrito
      cy.get('[data-test="inventory-item"] > .cart_item_label > a > [data-test="inventory-item-name"]').each(($el) => {
        cy.wrap($el).invoke('text').then((text) => { cartProductNames.push(text.trim()); });
      }).then(() => {

        //console.log("Cart Product Names:", cartProductNames);

        // Verificación que cada nombre de producto en el carrito esté en la lista de productos
        cartProductNames.forEach((name) => {
          expect(productNames).to.include(name);
        });
      });
    });
  });


})