// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)


const pgp = require('pg-promise')();
const execa = require('execa')

const findBrowser = () => {
  const browserPath =
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'

  return execa(browserPath, ['--version']).then((result) => {
    // STDOUT will be like "Brave Browser 77.0.69.135"
    const [, version] = /Brave Browser (\d+\.\d+\.\d+\.\d+)/.exec(
      result.stdout
    )
    const majorVersion = parseInt(version.split('.')[0], 10)

    return {
      name: 'Brave',
      channel: 'stable',
      family: 'chromium',
      displayName: 'Brave',
      version,
      path: browserPath,
      majorVersion
    }
  })
}

module.exports = (on, config) => {
  on('task', {
    'db:seed': async (query) => {
      const {
        db_user: user,
        db_password: password,
        host,
        database,
        port,
        ssl,
      } = config.env

      const dbconfig = {
        user,
        host,
        database,
        password,
        port,
        ssl,
      };

      const db = pgp(dbconfig);
      return db.any(query.query)
    },
    'db:reset': async (_input) => {
      console.log('TBD')
    }
  });

  if (config.env.brave) {
    return findBrowser().then((browser) => ({
      browsers: config.browsers.concat(browser)
    }))
  }

  return {}
};
