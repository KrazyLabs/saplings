/* eslint no-undef: 0 */
/* eslint no-unused-expressions: 0 */

const expect = require('chai').expect
const { Network, Node, Slot, Fact, Join, Evaluation } = require('../../dist')

module.exports = () => {
  it('should execute an action attached to a join when both nodes are truthy', done => {
    const re = new Network()
    const evaluation = new Evaluation()
    let success = false
    const childA = new Node().addSlot(new Slot('type', 'Test'))
    const childB = new Node().addSlot(new Slot('foo', 'bar'))
    const join = new Join(childA, childB).addAction(() => {
      success = true
      return true
    })
    re.addChild(childA)
    re.addChild(childB)
    re.addJoin(join)
    re.assert(
      evaluation,
      new Fact('foo', 'bar'), // true
      new Fact('type', 'Test') // true
    )
    // ... can execute as many asserts and retractions as needed ...
    re.execute(evaluation).then(() => {
      expect(success).to.equal(true)
      done()
    })
  })

  it('should not execute an action attached to a join if both nodes are not truthy', done => {
    const re = new Network()
    const evaluation = new Evaluation()
    let success = false
    const childA = new Node().addSlot(new Slot('type', 'Test'))
    const childB = new Node().addSlot(new Slot('foo', 'baz'))
    const join = new Join(childA, childB).addAction(() => {
      success = true
      return true
    })
    re.addChild(childA)
    re.addChild(childB)
    re.addJoin(join)
    re.assert(
      evaluation,
      new Fact('foo', 'bar'), // false
      new Fact('type', 'Test') // true
    )
    // ... can execute as many asserts and retractions as needed ...
    re.execute(evaluation).then(() => {
      expect(success).to.equal(false)
      done()
    })
  })

  it('should re-execute when a new assertion is made because of an action (inference)', done => {
    const re = new Network()
    const evaluation = new Evaluation()
    let success = false
    const childA = new Node('A').addSlot(new Slot('type', 'Test'))
    const childB = new Node('B').addSlot(new Slot('foo', 'bar'))
    const childC = new Node('C').addSlot(new Slot('go', 'baz'))
    const joinA = new Join(childA, childB).addAction(() => {
      return re.assert(evaluation, new Fact('go', 'baz')) // this will cause a revalidation
    })
    const joinB = new Join(childB, childC).addAction(() => {
      success = true
      return true
    })
    re.addChild(childA)
    re.addChild(childB)
    re.addChild(childC)
    re.addJoin(joinA)
    re.addJoin(joinB)
    // only specify 2 facts
    re.assert(
      evaluation,
      new Fact('foo', 'bar'), // true
      new Fact('type', 'Test') // true
    )
    re.execute(evaluation).then(() => {
      expect(success).to.equal(true)
      done()
    })
  })
}
