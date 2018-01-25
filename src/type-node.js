import Node from './node'
import Slot from './slot'
import selectNode from './select-node'

// convenience class for creating type discrimination nodes
class TypeNode extends Node {
  constructor(typeName) {
    super(typeName)
    this.addSlot(new Slot('type', typeName))
  }

  selectNode(node, value) {
    if (node.__type__ === 'Node') {
      this.addChild(node)
    } else if (typeof node === 'string') {
      this.addChild(selectNode(node, value))
    } else {
      throw new Error(
        `Invalid type specified as node for TypeNode.selectNode: ${typeof node}`
      )
    }
    return this
  }
}

export default typeName => new TypeNode(typeName)
