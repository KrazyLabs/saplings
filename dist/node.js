'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rootNode = require('./root-node');

var _rootNode2 = _interopRequireDefault(_rootNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const uuidv1 = require('uuid/v1');

let Node = class Node extends _rootNode2.default {
  constructor(label) {
    super();
    this.id = uuidv1();
    this.__type__ = 'Node'; // simplify runtime type detection
    this.slots = [];
    this.label = label;
  }

  // a node that has no slots is always truthy
  truthy(evaluation) {
    return this.slots.length ? evaluation.truthy(this.id) : true;
  }

  addSlot(slot) {
    if (!slot.evaluate) {
      throw new Error('Invalid Slot object passed to Node.addSlot');
    }
    this.slots.push(slot);
    return this;
  }

  // only store explicit knowledge
  evaluate(evaluation, wme) {
    if (!evaluation) {
      throw new Error('Missing required parameter evaluation for call to Node.evaluate');
    }
    const size = this.slots.length;

    this.slots.forEach(slot => evaluation.update(this.id, slot.evaluate(wme), size));

    return this.truthy(evaluation);
  }
};
exports.default = Node;