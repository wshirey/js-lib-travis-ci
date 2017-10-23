var example = require('../lib')

require('chai').should()

describe('tests!', function () {
  it ('should say hello world!', function () {
    example().should.equal('hello world!')
  })
})