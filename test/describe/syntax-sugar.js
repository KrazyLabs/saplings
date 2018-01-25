/* eslint no-undef: 0 */
/* eslint no-unused-expressions: 0 */

const expect = require('chai').expect
const {
  Network,
  Evaluation,
  typeNode,
  typeFact,
  selectNode,
  using
} = require('../../dist')

module.exports = () => {
  let success = false

  beforeEach(() => {
    success = false
  })

  const testB = selectNode('d', 2)
    .selectNode('e', 3)
    .selectNode('f', 4)

  const testA = selectNode('a', value => parseInt(value) >= 200000)
    .selectNode('b', value => parseFloat(value) <= 0.03)
    .selectNode('c', 1)
    .addChild(testB)

  const testNetwork = new Network()
    .add(typeNode('Test').selectNode(testA))
    .join('Test', testA.extrude(), () => {
      success = true
    })

  it('should allow the creation of alpha nodes with a convenience model', done => {
    let editorialSuccess = false
    const evaluation = new Evaluation()
    new Network()
      .add(
        typeNode('editorial'),
        typeNode('affiliate'),
        typeNode('grocery'),
        typeNode('retail')
      )
      .join('editorial', () => {
        editorialSuccess = true
      })
      .assert(evaluation, typeFact('editorial'))
      .execute(evaluation)
      .then(() => {
        expect(editorialSuccess).to.equal(true)
        done()
      })
  })

  it('should allow the creation of joins with inference using the convenience model', done => {
    let success = false
    const re = new Network()
    const evaluation = new Evaluation()
    re
      .add(typeNode('a'), typeNode('b'), typeNode('c'))
      .join('a', 'b', () => {
        re.assert(evaluation, typeFact('c'))
      })
      .join('b', 'c', () => {
        success = true
      })
      .assert(evaluation, typeFact('b'))
      .assert(evaluation, typeFact('c'))
      .execute(evaluation)
      .then(() => {
        expect(success).to.equal(true)
        done()
      })
  })

  it('should allow the creation of nested joins with using the convenience model', done => {
    let success = false
    const re = new Network()
    const evaluation = new Evaluation()
    re
      .add(typeNode('a'), typeNode('b'), typeNode('c'))
      .join('c', ['a', 'b'], () => {
        success = true
      })
      .assert(evaluation, typeFact('a'))
      .assert(evaluation, typeFact('b'))
      .assert(evaluation, typeFact('c'))
      .execute(evaluation)
      .then(() => {
        expect(success).to.equal(true)
        done()
      })
  })

  it('should allow the creation of deeply nested joins with using the convenience model', done => {
    let success = false
    const evaluation = new Evaluation()
    new Network()
      .add(
        typeNode('a'),
        typeNode('b'),
        typeNode('c'),
        typeNode('d'),
        typeNode('e')
      )
      .join(['a', 'b'], ['c', ['d', 'e']], () => {
        success = true
      })
      .assert(evaluation, typeFact('a'))
      .assert(evaluation, typeFact('b'))
      .assert(evaluation, typeFact('c'))
      .assert(evaluation, typeFact('d'))
      .assert(evaluation, typeFact('e'))
      .execute(evaluation)
      .then(() => {
        expect(success).to.equal(true)
        done()
      })
  })

  it('should perform type discrimination when using typeNodes with fact objects', done => {
    let count = 0
    const re = new Network()
      .add(
        typeNode('a').selectNode('foo', 'bar'),
        typeNode('b').selectNode('foo', 'bar')
      )
      .join('a', 'foo', () => {
        count++
      })
      .join('b', 'foo', () => {
        count++
      })

    using(re)
      .assert({
        type: 'a',
        foo: 'bar'
      })
      .execute()
      .then(() => {
        expect(count).to.equal(1)
        done()
      })
  })

  it('should allow using syntax sugar for assert, retract and execute', done => {
    let success = false
    const re = new Network()
      .add(
        typeNode('a'),
        typeNode('b'),
        typeNode('c'),
        typeNode('d'),
        typeNode('e')
      )
      .join(['a', 'b'], ['c', ['d', 'e']], () => {
        success = true
      })

    using(re)
      .assert(
        typeFact('a'),
        typeFact('b'),
        typeFact('c'),
        typeFact('d'),
        typeFact('e')
      )
      .execute()
      .then(() => {
        expect(success).to.equal(true)
        done()
      })
  })

  it('should extrude a node so that it can be used to join all of the descendents into a single production', done => {
    using(testNetwork)
      .assert({
        type: 'Test',
        a: 200000,
        b: 0.02,
        c: 1,
        d: 2,
        e: 3,
        f: 4
      })
      .execute()
      .then(() => {
        expect(success).to.equal(true)
        done()
      })
  })

  it('should extrude a node so that grandchildren are included in the branch', done => {
    using(testNetwork)
      .assert({
        type: 'Test',
        a: 200000,
        b: 0.02,
        c: 1,
        d: 2,
        e: 3,
        f: 5 // false
      })
      .execute()
      .then(() => {
        expect(success).to.equal(false)
        done()
      })
  })
}
