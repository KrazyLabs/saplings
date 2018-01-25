import Fact from './fact'

class TypeFact extends Fact {
  constructor(value) {
    super('type', value)
  }
}

export default value => new TypeFact(value)
