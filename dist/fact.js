'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
let Fact = class Fact {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static coerce(something) {
    if (typeof something.name !== 'undefined' && typeof something.value !== 'undefined') {
      return [something];
    }
    if (typeof something === 'object') {
      return Object.getOwnPropertyNames(something).map(key => new Fact(key, something[key]));
    }
    throw new Error('Cannot coerce non-object types with Fact.coerce');
  }
};
exports.default = Fact;