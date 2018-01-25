'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

var _slot = require('./slot');

var _slot2 = _interopRequireDefault(_slot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// convenience class for creating alpha nodes
let SelectNode = class SelectNode extends _node2.default {
  constructor(field, comparison) {
    super(field);
    this.addSlot(new _slot2.default(field, comparison));
  }

  selectNode(field, comparison) {
    this.addChild(new SelectNode(field, comparison));
    return this;
  }
};

exports.default = (field, comparison) => new SelectNode(field, comparison);