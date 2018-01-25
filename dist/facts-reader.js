'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fact = require('./fact');

var _fact2 = _interopRequireDefault(_fact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// reduce a function's arguments to a list of facts, allowing for anonymous objects
exports.default = args => args.reduce((facts, arg) => Array.isArray(arg) ? facts.concat(arg.reduce((acc, cv) => acc.concat(_fact2.default.coerce(cv)), [])) : facts.concat(_fact2.default.coerce(arg)), []);