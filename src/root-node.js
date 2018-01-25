class RootNode {
  // root nodes cannot have slots or joins
  constructor() {
    this.children = [
      /* Node */
    ]
  }

  addChild(node) {
    this.children.push(node)
    return this
  }

  // TODO: retractions
  traverse(evaluation, wme) {
    if (!evaluation) {
      throw new Error(
        'Missing required parameter evaluation for call to RootNode.traverse'
      )
    }
    // TODO: aLlow for out-of-order single facts
    this.children.forEach(child => {
      if (child.evaluate(evaluation, wme)) {
        child.traverse(evaluation, wme)
      }
    })
  }

  extrudeChildren() {
    let first = []
    let next = first
    this.children.forEach((child, index) => {
      next.push(child)
      next.push(child.extrudeChildren())
      next = next[1]
    })
    return first
  }

  // return the tree structure as a nested array
  extrude() {
    const shape = [this]
    const children = this.extrudeChildren()
    if (children.length) {
      shape.push(children)
    }
    return shape
  }

  getChildByLabel(label) {
    let foundChild
    this.children.forEach(child => {
      if (!foundChild) {
        foundChild =
          child.label === label ? child : child.getChildByLabel(label)
      }
    })
    return foundChild
  }
}

export default RootNode
