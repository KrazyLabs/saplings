import Fact from './fact'

// reduce a function's arguments to a list of facts, allowing for anonymous objects
export default args =>
  args.reduce(
    (facts, arg) =>
      Array.isArray(arg)
        ? facts.concat(arg.reduce((acc, cv) => acc.concat(Fact.coerce(cv)), []))
        : facts.concat(Fact.coerce(arg)),
    []
  )
