'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _evaluation = require('./evaluation');

var _evaluation2 = _interopRequireDefault(_evaluation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = ruleEngine => new _evaluation2.default(ruleEngine);