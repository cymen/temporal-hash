var _ = require('lodash');

function TemporalHash(hash, timestamp) {
  if (_.isUndefined(timestamp)) {
    timestamp = 0;
  }

  this.store = {};
  this.store[timestamp] = _.cloneDeep(hash) || {};
};

module.exports = TemporalHash;

TemporalHash.prototype = {
  update: function(hash, timestamp) {
    if (_.isUndefined(timestamp)) {
      timestamp = Date.now();
    }

    this.store[timestamp] = _.merge(this.store[timestamp] || {}, hash);
  },

  compact: function(timestamp) {
    var resolved = this.resolve();
    this.store = {};
    this.update(resolved, timestamp);
    return _.cloneDeep(resolved) || {};
  },

  resolve: function() {
    var result = {};

    _.keys(this.store).sort(this.numericIntegerSort).forEach(function(t) {
      _.merge(result, this.store[t]);
    }.bind(this));

    return _.cloneDeep(result) || {};
  },

  numericIntegerComparision: function(a, b) {
    return parseInt(a) - parseInt(b);
  }
};
