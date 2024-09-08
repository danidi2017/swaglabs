describe('Pruebas de los Productos: Swag Labs', () => {

  const viewports = Cypress.env('viewports');

  function ClickToAddProducts(productName) {
    cy.verifyExist(`add-to-cart-${productName}`);
    cy.verifyNotExist(`remove-${productName}`);
    cy.getDataTest(`add-to-cart-${productName}`).contains("Add to cart");
    cy.verifyExist(`add-to-cart-${productName}`);
    cy.verifyNotExist(`remove-${productName}`);
    cy.getDataTest(`add-to-cart-${productName}`).click();
    cy.verifyNotExist(`add-to-cart-${productName}`);
    cy.verifyExist(`remove-${productName}`);
    cy.getDataTest(`remove-${productName}`).contains("Remove");
  }

  function ClickToRemoveProducts(productName) {
    cy.verifyExist(`remove-${productName}`);
    cy.verifyNotExist(`add-to-cart-${productName}`);
    cy.getDataTest(`remove-${productName}`).contains("Remove");
    cy.verifyExist(`remove-${productName}`);
    cy.verifyNotExist(`add-to-cart-${productName}`);
    cy.getDataTest(`remove-${productName}`).click();
    cy.verifyNotExist(`remove-${productName}`);
    cy.verifyExist(`add-to-cart-${productName}`);
    cy.getDataTest(`add-to-cart-${productName}`).contains("Add to cart");

  }

  function verifyBadgeOfTheShoppingCart(NumberOfProducts) {
    if (NumberOfProducts !== '0') {
      cy.get("#shopping_cart_container")
        .should("be.visible")
        .within(() => {
          cy.getDataTest("shopping-cart-link")
            .should("be.visible")
            .within(() => {
              cy.getDataTest("shopping-cart-badge").should("be.visible");
              cy.getDataTest("shopping-cart-badge").contains(NumberOfProducts);
            });
        });
    } else {
      cy.getDataTest("#shopping-cart-link").should("not.exist")
    }
  }

  // Itera sobre cada viewport
  viewports.forEach((viewport) => {
    describe(`Pruebas en ${viewport.device}`, () => {
      beforeEach(() => {
        // Limpiar cookies y local storage antes de toda la suite de pruebas
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit(Cypress.env('base_url'))
        cy.viewport(viewport.width, viewport.height);
        cy.fixture("loginData.json").then((loginData) => {
          cy.login(loginData.swaglab_username, loginData.swaglab_password);
        });
      });

      it(`Add all products to the shopping cart`, () => {
        cy.getDataTest("inventory-item").each(($item, index, $list) => {
          cy.wrap($item).then(($currentItem) => {
            const productName = $currentItem.find(".inventory_item_name").text();
            ClickToAddProducts(productName.toLowerCase().replaceAll(" ", "-"));
            verifyBadgeOfTheShoppingCart(`${index + 1}`);
          });
        });
      });

      it(`Remove all products to the shopping cart`, () => {
        cy.getDataTest("inventory-item").each(($item, index, $list) => {
          cy.wrap($item).then(($currentItem) => {
            const productName = $currentItem.find(".inventory_item_name").text();
            ClickToAddProducts(productName.toLowerCase().replaceAll(" ", "-"));
            verifyBadgeOfTheShoppingCart(`${index + 1}`);
          });
        });

        cy.getDataTest("inventory-item").each(($item, $index, $list) => {
          cy.wrap($item).then(($currentItem) => {
            const productName = $currentItem.find(".inventory_item_name").text();
            ClickToRemoveProducts(productName.toLowerCase().replaceAll(" ", "-"));
            verifyBadgeOfTheShoppingCart(`${6 - ($index + 1)}`)
          })
        })
      });

      it('all products has the required information', () => {
        cy.getDataTest("inventory-item").each(($item, index, $list) => {
          cy.wrap($item).within(() => {
            cy.getDataTest("inventory-item-name").should('not.be.empty');
            cy.getDataTest("inventory-item-desc").should('not.be.empty');
            cy.getDataTest("inventory-item-name").should('be.visible');
            cy.getDataTest("inventory-item-desc").should('be.visible');
            cy.getDataTest("inventory-item-price").should('be.visible');
            cy.getDataTest("inventory-item-price").should('be.visible');
            cy.getDataTest("inventory-item-price").invoke('text').should((price) => {
              const regex = /^\$\d{1,3}(\.\d{2})?$/;
              expect(price).to.match(regex);
            });
          });
        });
      })

      it('ordered products by name (Z-A)', () => {
        cy.getDataTest("product-sort-container").select('Name (Z to A)')
        cy.getDataTest("inventory-item-name").then($items => {
          const actualTitles = $items.map((index, html) => Cypress.$(html).text()).get();
          const sortedTitles = [...actualTitles].sort((a, b) => b.localeCompare(a));
          expect(actualTitles).to.deep.equal(sortedTitles);
        })
      })

      it('ordered products by price (low to high)', () => {
        cy.getDataTest("product-sort-container").select('Price (low to high)')
        cy.getDataTest('inventory-item-price').then($items => {
          const actualPrices = $items.map((index, html) => {
            const priceText = Cypress.$(html).text().replace('$', '')
            return parseFloat(priceText)
          }).get();
          const sortedPricesLowToHigh = [...actualPrices].sort((a, b) => a - b);
          expect(actualPrices).to.deep.equal(sortedPricesLowToHigh)
        })
      })

      it('ordered products by price (high to low)', () => {
        cy.getDataTest("product-sort-container").select('Price (high to low)')
        cy.getDataTest('inventory-item-price').then($items => {
          const actualPrices = $items.map((index, html) => {
            const priceText = Cypress.$(html).text().replace('$', '')
            return parseFloat(priceText)
          }).get();
          const sortedPricesLowToHigh = [...actualPrices].sort((a, b) => b - a);
          expect(actualPrices).to.deep.equal(sortedPricesLowToHigh)
        })
      })
    });
  });

})