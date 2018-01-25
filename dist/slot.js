'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
let Slot = class Slot {
  constructor(field, comparison) {
    this.field = field;
    this.comparison = comparison;
  }

  // update can be a single fact or a list of facts
  evaluate(wme) {
    const facts = [].concat(wme.facts);
    const result = facts.reduce((accumulator, fact) => {
      if (accumulator) {
        // slot already matching
        return accumulator;
      }
      if (fact.name !== this.field) {
        // unknown; no state change
        return accumulator;
      }
      if (typeof this.comparison !== 'function') {
        // straight value-to-value comparison
        if (fact.value === this.comparison) {
          return fact;
        }
        return fact.value === this.comparison ? fact : undefined;
      }
      return this.comparison(fact.value);
    }, undefined);
    return result;
  }
};
exports.default = Slot;