/* eslint no-undef: 0 */
/* eslint no-unused-expressions: 0 */

const expect = require('chai').expect
const {
  Network,
  Node,
  Join,
  Slot,
  Fact,
  Evaluation
} = require('../../dist')

module.exports = () => {
  it('should have a root node that exposes the correct node API', () => {
    const re = new Network()
    expect(re.root.addSlot).to.be.undefined
    expect(re.root.addChild).not.to.be.undefined
  })

  it('should add a slot to a child node', () => {
    const re = new Network()
    const typeNode = new Node().addSlot(new Slot('type', 'Test'))
    expect(typeNode.slots.length).to.equal(1)
    re.root.addChild(typeNode)
    expect(re.root.children[0].slots.length).to.equal(1)
  })

  it('an empty node should always be truthy', () => {
    const node = new Node()
    const evaluation = new Evaluation()
    expect(node.truthy(evaluation)).to.equal(true)
  })

  it('should be non-truthy when evaluating node with slot vs. non-matching fact', () => {
    const re = new Network()
    const evaluation = new Evaluation()
    const typeNode = new Node().addSlot(new Slot('type', 'Test1'))
    re.root.addChild(typeNode)
    re.root.children[0].evaluate(evaluation, {
      facts: new Fact('type', 'Test2')
    })
    expect(re.root.children[0].truthy(evaluation)).to.equal(false)
  })

  it('should be non-truthy when evaluating node with slot vs. unknown fact', () => {
    const re = new Network()
    const evaluation = new Evaluation()
    const typeNode = new Node().addSlot(new Slot('type', 'Test1'))
    re.root.addChild(typeNode)
    re.root.children[0].evaluate(evaluation, { facts: new Fact('foo', 'bar') })
    expect(re.root.children[0].truthy(evaluation)).to.equal(false)
  })

  it('should fail fast when evaluating nodes with any false slots', () => {
    const re = new Network()
    const evaluation = new Evaluation()
    re.root.addChild(
      new Node()
        .addSlot(new Slot('type', 'Test1'))
        .addSlot(new Slot('foo', 'bar'))
    )
    re.root.children[0].evaluate(evaluation, {
      facts: [
        new Fact('foo', 'bar'), // true
        new Fact('type', 'Test2') // false
      ]
    })
    expect(re.root.children[0].truthy(evaluation)).to.equal(false)
  })

  it('should return true when evaluating nodes with multiple true slots', () => {
    const re = new Network()
    const evaluation = new Evaluation()
    re.root.addChild(
      new Node()
        .addSlot(new Slot('type', 'Test1'))
        .addSlot(new Slot('foo', 'bar'))
    )
    re.root.children[0].evaluate(evaluation, {
      facts: [
        new Fact('foo', 'bar'), // true
        new Fact('type', 'Test1') // true
      ]
    })
    expect(re.root.children[0].truthy(evaluation)).to.equal(true)
  })

  it('should allow nested joins', done => {
    let success = false
    const re = new Network()
    const evaluation = new Evaluation()

    const childA = new Node('A').addSlot(new Slot('a', 1))
    const childB = new Node('B').addSlot(new Slot('b', 1))
    const childC = new Node('C').addSlot(new Slot('c', 1))
    const childD = new Node('D').addSlot(new Slot('d', 1))
    const childE = new Node('E').addSlot(new Slot('e', 1))

    const joinA = new Join(childA, childB)
    const joinB = new Join(childC, joinA)
    const joinC = new Join(childD, childE)
    const joinD = new Join(joinB, joinC).addAction(() => {
      success = true
    })

    re.add(childA, childB, childC, childD, childE, joinA, joinB, joinC, joinD)

    re.assert(
      evaluation,
      new Fact('a', 1),
      new Fact('b', 1),
      new Fact('c', 1),
      new Fact('d', 1),
      new Fact('e', 1)
    )
    re.execute(evaluation).then(() => {
      expect(success).to.equal(true)
      done()
    })
  })

  it('should allow nested joins that accurately short circuit during expected fails', done => {
    let success = false
    const re = new Network()
    const evaluation = new Evaluation()

    const childA = new Node('A').addSlot(new Slot('a', 1))
    const childB = new Node('B').addSlot(new Slot('b', 1))
    const childC = new Node('C').addSlot(new Slot('c', 1))
    const childD = new Node('D').addSlot(new Slot('d', 1))
    const childE = new Node('E').addSlot(new Slot('e', 1))

    const joinA = new Join(childA, childB)
    const joinB = new Join(childC, joinA)
    const joinC = new Join(childD, childE)
    const joinD = new Join(joinB, joinC).addAction(() => {
      success = true
    })

    re.add(childA, childB, childC, childD, childE, joinA, joinB, joinC, joinD)

    re.assert(
      evaluation,
      new Fact('a', 1),
      new Fact('b', 1),
      new Fact('c', 2), // false
      new Fact('d', 1),
      new Fact('e', 1)
    )
    re.execute(evaluation).then(() => {
      expect(success).to.equal(false)
      done()
    })
  })
}
