'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rootNode = require('./root-node');

var _rootNode2 = _interopRequireDefault(_rootNode);

var _agenda = require('./agenda');

var _agenda2 = _interopRequireDefault(_agenda);

var _join = require('./join');

var _join2 = _interopRequireDefault(_join);

var _factsReader = require('./facts-reader');

var _factsReader2 = _interopRequireDefault(_factsReader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let Network = class Network {
  constructor() {
    this.root = new _rootNode2.default();
    this.joins = [];
    this.recycle = false;
  }

  assert() {
    this.recycle = true;
    const args = [...arguments];
    const evaluation = args[0];
    const facts = (0, _factsReader2.default)(args.slice(1));
    this.root.traverse(evaluation, Object.assign({ facts }, { retraction: false }));
    return this;
  }

  retract() {
    this.recycle = true;
    const args = [...arguments];
    const evaluation = args[0];
    const facts = (0, _factsReader2.default)(args.slice(1));
    this.root.traverse(evaluation, Object.assign({ facts }, { retraction: true }));
    return this;
  }

  // build an agenda of rules that apply according to the current memory
  execute(evaluation, context) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const agenda = new _agenda2.default(context);
      return _this.cycle(evaluation, agenda);
    })();
  }

  cycle(evaluation, agenda) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      _this2.recycle = false;
      _this2.joins.forEach(function (join) {
        return agenda.update(evaluation, join);
      });
      // actions that assert or retract facts will cause another cycle
      const returnValue = yield agenda.execute(evaluation);
      if (_this2.recycle) {
        return _this2.cycle(evaluation, agenda);
      }
      return Promise.resolve(returnValue);
    })();
  }

  addChild(node) {
    this.root.addChild(node);
    return this;
  }

  addJoin(join) {
    this.joins.push(join);
    return this;
  }

  // convenience method for adding children and joins at once
  add() {
    const args = [...arguments];
    args.forEach(arg => {
      if (arg.__type__ === 'Node') {
        this.addChild(arg);
      } else if (arg.__type__ === 'Join') {
        this.addJoin(arg);
      } else {
        throw new Error(`Invalid object type specified in call to Network.add (expecting Node or Join): ${typeof arg}`);
      }
    });
    return this;
  }

  getJoinableType(item) {
    if (typeof item === 'string') {
      return this.root.getChildByLabel(item);
    } else if (Array.isArray(item)) {
      return this.getJoin(item[0], item[1]);
    }
    return item;
  }

  getJoin(itemA, itemB) {
    let left = this.getJoinableType(itemA);
    let right = this.getJoinableType(itemB);
    return new _join2.default(left, right);
  }

  // convenience method for adding joins by label and then chaining next call
  join() {
    let itemA = arguments[0];
    let itemB = typeof arguments[1] === 'function' ? undefined : arguments[1];
    let callback = typeof arguments[1] === 'function' ? arguments[1] : arguments[2];
    const join = this.getJoin(itemA, itemB);
    if (typeof callback === 'function') {
      join.addAction(callback);
    }
    this.addJoin(join);
    return this;
  }
};
exports.default = Network;