'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

var _slot = require('./slot');

var _slot2 = _interopRequireDefault(_slot);

var _selectNode = require('./select-node');

var _selectNode2 = _interopRequireDefault(_selectNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// convenience class for creating type discrimination nodes
let TypeNode = class TypeNode extends _node2.default {
  constructor(typeName) {
    super(typeName);
    this.addSlot(new _slot2.default('type', typeName));
  }

  selectNode(node, value) {
    if (node.__type__ === 'Node') {
      this.addChild(node);
    } else if (typeof node === 'string') {
      this.addChild((0, _selectNode2.default)(node, value));
    } else {
      throw new Error(`Invalid type specified as node for TypeNode.selectNode: ${typeof node}`);
    }
    return this;
  }
};

exports.default = typeName => new TypeNode(typeName);