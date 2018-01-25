'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fact = require('./fact');

var _fact2 = _interopRequireDefault(_fact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let TypeFact = class TypeFact extends _fact2.default {
  constructor(value) {
    super('type', value);
  }
};

exports.default = value => new TypeFact(value);