'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
let Agenda = class Agenda {
  constructor(context) {
    this.actions = [];
    this.staged = {};
    this.context = context;
  }

  update(evaluation, join) {
    if (!evaluation) {
      throw new Error('Missing required parameter evaluation for call to Agenda.update');
    }
    if (join.truthy(evaluation) && join.action) {
      this.actions.push(join.action);
    }
    return this;
  }

  execute(evaluation) {
    const promises = this.actions.sort((a, b) => a.priority - b.priority).filter(action => this.staged[action.id] !== true).map(action => {
      // always flag actions as staged before execution in case of action errors
      // ... kill the possibility of an infinte evaluation loop
      this.staged[action.id] = true;
      return action(evaluation, this.context);
    });

    return Promise.all(promises);
  }
};
exports.default = Agenda;