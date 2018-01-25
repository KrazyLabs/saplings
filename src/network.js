import RootNode from './root-node'
import Agenda from './agenda'
import Join from './join'
import factsReader from './facts-reader'

class Network {
  constructor() {
    this.root = new RootNode()
    this.joins = []
    this.recycle = false
  }

  assert() {
    this.recycle = true
    const args = [...arguments]
    const evaluation = args[0]
    const facts = factsReader(args.slice(1))
    this.root.traverse(
      evaluation,
      Object.assign({ facts }, { retraction: false })
    )
    return this
  }

  retract() {
    this.recycle = true
    const args = [...arguments]
    const evaluation = args[0]
    const facts = factsReader(args.slice(1))
    this.root.traverse(
      evaluation,
      Object.assign({ facts }, { retraction: true })
    )
    return this
  }

  // build an agenda of rules that apply according to the current memory
  async execute(evaluation, context) {
    const agenda = new Agenda(context)
    return this.cycle(evaluation, agenda)
  }

  async cycle(evaluation, agenda) {
    this.recycle = false
    this.joins.forEach(join => agenda.update(evaluation, join))
    // actions that assert or retract facts will cause another cycle
    const returnValue = await agenda.execute(evaluation)
    if (this.recycle) {
      return this.cycle(evaluation, agenda)
    }
    return Promise.resolve(returnValue)
  }

  addChild(node) {
    this.root.addChild(node)
    return this
  }

  addJoin(join) {
    this.joins.push(join)
    return this
  }

  // convenience method for adding children and joins at once
  add() {
    const args = [...arguments]
    args.forEach(arg => {
      if (arg.__type__ === 'Node') {
        this.addChild(arg)
      } else if (arg.__type__ === 'Join') {
        this.addJoin(arg)
      } else {
        throw new Error(
          `Invalid object type specified in call to Network.add (expecting Node or Join): ${typeof arg}`
        )
      }
    })
    return this
  }

  getJoinableType(item) {
    if (typeof item === 'string') {
      return this.root.getChildByLabel(item)
    } else if (Array.isArray(item)) {
      return this.getJoin(item[0], item[1])
    }
    return item
  }

  getJoin(itemA, itemB) {
    let left = this.getJoinableType(itemA)
    let right = this.getJoinableType(itemB)
    return new Join(left, right)
  }

  // convenience method for adding joins by label and then chaining next call
  join() {
    let itemA = arguments[0]
    let itemB = typeof arguments[1] === 'function' ? undefined : arguments[1]
    let callback =
      typeof arguments[1] === 'function' ? arguments[1] : arguments[2]
    const join = this.getJoin(itemA, itemB)
    if (typeof callback === 'function') {
      join.addAction(callback)
    }
    this.addJoin(join)
    return this
  }
}

export default Network
