/* eslint no-undef: 0 */
/* eslint no-unused-expressions: 0 */
const mockery = require('mockery')

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false
})

// register mocks *after* enabling mockery and *before* requiring libs...

// ... hence this inline model for require
describe('saplings', () => {
  describe('execute', require('./describe/execute'))
  describe('object-model', require('./describe/object-model'))
  describe('syntax-sugar', require('./describe/syntax-sugar'))

  after(() => {
    mockery.disable()
  })
})
