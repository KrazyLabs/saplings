'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const uuidv1 = require('uuid/v1');

let Join = class Join {
  constructor(left /* Node|Join */, right /* Node|Join */) {
    this.__type__ = 'Join';
    this.left = left || new _node2.default(); // default to dummy input
    this.right = right || new _node2.default(); // default to dummy input
    this.action = undefined;
  }

  truthy(evaluation) {
    return this.left.truthy(evaluation) && this.right.truthy(evaluation);
  }

  // actions get an id unique to all contexts since the same function might be used in multiple joins
  addAction(callback, priority = 1) {
    if (typeof callback !== 'function') {
      throw new Error(`Callback parameter must be a function; found type: ${typeof callback}`);
    }
    const leftId = this.left.id;
    const rightId = this.right.id;
    const action = (() => {
      var _ref = _asyncToGenerator(function* (evaluation, context) {
        const leftMemory = evaluation.memory[leftId];
        const rightMemory = evaluation.memory[rightId];
        return callback(leftMemory, rightMemory, context);
      });

      return function action(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    })();
    action.priority = parseInt(priority);
    action.id = uuidv1();
    this.action = action;
    return this;
  }
};
exports.default = Join;