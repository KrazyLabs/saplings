import Node from './node'
import Slot from './slot'

// convenience class for creating alpha nodes
class SelectNode extends Node {
  constructor(field, comparison) {
    super(field)
    this.addSlot(new Slot(field, comparison))
  }

  selectNode(field, comparison) {
    this.addChild(new SelectNode(field, comparison))
    return this
  }
}

export default (field, comparison) => new SelectNode(field, comparison)
