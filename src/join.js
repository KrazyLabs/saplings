import Node from './node'
const uuidv1 = require('uuid/v1')

class Join {
  constructor(left /* Node|Join */, right /* Node|Join */) {
    this.__type__ = 'Join'
    this.left = left || new Node() // default to dummy input
    this.right = right || new Node() // default to dummy input
    this.action = undefined
  }

  truthy(evaluation) {
    return this.left.truthy(evaluation) && this.right.truthy(evaluation)
  }

  // actions get an id unique to all contexts since the same function might be used in multiple joins
  addAction(callback, priority = 1) {
    if (typeof callback !== 'function') {
      throw new Error(
        `Callback parameter must be a function; found type: ${typeof callback}`
      )
    }
    const leftId = this.left.id
    const rightId = this.right.id
    const action = async function(evaluation, context) {
      const leftMemory = evaluation.memory[leftId]
      const rightMemory = evaluation.memory[rightId]
      return callback(leftMemory, rightMemory, context)
    }
    action.priority = parseInt(priority)
    action.id = uuidv1()
    this.action = action
    return this
  }
}

export default Join
