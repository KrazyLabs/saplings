// WME's are truthy when they have a number of matching facts equal to their size
class WorkingMemoryElement {
  constructor(size) {
    this.facts = []
    this.size = size
  }

  addFact(fact) {
    if (fact) {
      this.facts.push(fact)
    }
  }

  get truthy() {
    return this.facts.length === this.size
  }
}

class Evaluation {
  constructor(ruleEngine) {
    this.ruleEngine = ruleEngine
    this.memory = {}
  }

  truthy(id) {
    return this.memory[id] ? this.memory[id].truthy : false
  }

  // this can get called multiple times for each node (aka per id)
  update(id, match, size) {
    if (match) {
      if (!this.memory[id]) {
        this.memory[id] = new WorkingMemoryElement(size)
      }
      this.memory[id].addFact(match)
    }
  }

  assert() {
    this.ruleEngine.assert(this, [...arguments])
    return this
  }

  retract() {
    this.ruleEngine.retract(this, [...arguments])
    return this
  }

  execute(context) {
    return this.ruleEngine.execute(this, context)
  }
}

export default Evaluation
