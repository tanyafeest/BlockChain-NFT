import shortAddress from '@/utils/chainProperties'

const users = [
  {
    address: 'FqCJeGcPidYSsvvmT17fHVaYdE2nXMYgPsBn3CP9gugvZR5',
    name: 'deepologic',
    twitter: '@deepologic',
    startedMinting: 'Started minting over 1 year ago',
  },
  {
    address: 'FUEGFWoPPtX4XkRzEnZnMgwGKENscHXAiEZy6kcgaDz1BY6',
    name: 'Yumi Arts',
    twitter: '@YumiArtsNFT',
    startedMinting: 'Started minting 12 months ago',
  },
  {
    address: 'D5DfsRWMpcBm39Leh539efFnDF1n337YWcYVHNi94pjv1SJ',
    name: 'nftxtiff',
    twitter: '@nftxtiff',
    startedMinting: 'Started minting 12 months ago',
  },
]

describe('Identity.vue component', () => {
  users.forEach(({ address, name, twitter, startedMinting }) => {
    it(
      `should get Identity stats for ${name}`,
      { scrollBehavior: false, browser: 'chrome' },
      () => {
        // https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/testing-dom__clipboard
        cy.wrap(
          Cypress.automation('remote:debugger:protocol', {
            command: 'Browser.grantPermissions',
            params: {
              permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
              origin: window.location.origin,
            },
          })
        )
        cy.visit(`/rmrk/u/${address}`)
          .its('navigator.permissions')
          .invoke('query', { name: 'clipboard-read' })
          .its('state')
          .should('equal', 'granted')

        cy.getCy('identity').realHover()
        cy.get('.tippy-popper')
          .should('exist')
          .then(() => {
            cy.getCy('identity-clipboard').realClick()
            cy.getCy('identity-display').should('contain.text', name)
            cy.getCy('identity-twitter').should('contain.text', twitter)
            cy.getCy('identity-address').should(
              'contain.text',
              shortAddress(address)
            )
            cy.getCy('identity-started-minting').should(
              'contain.text',
              startedMinting
            )
            cy.getCy('identity-last-bought').should('exist')
            cy.getCy('identity-collected').should(
              'not.have.text',
              '\n      0\n    '
            )
            cy.getCy('identity-created').should(
              'not.have.text',
              '\n      0\n    '
            )
            cy.getCy('identity-sold').should('not.have.text', '\n      0\n    ')

            cy.window()
              .its('navigator.clipboard')
              .invoke('readText')
              .should('equal', address)
          })
      }
    )
  })
})
