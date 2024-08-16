const { defineConfig } = require("cypress");

module.exports = defineConfig({
 // retries:1,
  //video:true,
  e2e: {
    //baseUrl:"https://www.saucedemo.com",
    //"screenshoptfolder": "cypress/screenshop",
    //"screenshotOnRunFailure": true,
    setupNodeEvents(on, config) {
  
      // implement node event listeners here
    },
  },
});
