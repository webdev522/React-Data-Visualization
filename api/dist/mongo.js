Object.defineProperty(exports, "__esModule", { value: true });

var _mongodb = require('mongodb');var _mongodb2 = _interopRequireDefault(_mongodb);
var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);
var _moment = require('moment');var _moment2 = _interopRequireDefault(_moment);
var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);

var _economies = require('./utils/economies');var _economies2 = _interopRequireDefault(_economies);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var client = _mongodb2['default'].MongoClient; // import math from 'mathjs';
// MongoDB client utilities and queries.
_bluebird2['default'].promisifyAll(client);

var db = void 0;
var stats = void 0;

// Connect to MongoDB instance.
var connect = function connect() {return _bluebird2['default']['try'](function () {
    if (db) {
      return db;
    }
    var url = void 0;
    if (cfg.MONGO_USER && cfg.MONGO_PASS) {
      url = 'mongodb://' + String(cfg.MONGO_USER) + ':' + String(cfg.MONGO_PASS) + '@' + String(cfg.MONGO_HOST) + ':' + String(cfg.MONGO_PORT) + '/' + String(cfg.MONGO_NAME) + '?authSource=admin';
    } else {
      url = 'mongodb://' + String(cfg.MONGO_HOST) + ':' + String(cfg.MONGO_PORT) + '/' + String(cfg.MONGO_NAME);
    }
    var options = { promiseLibrary: _bluebird2['default'] };
    return client.connect(url, options).
    then(function (connection) {
      log.info('Successfully connected to MongoDB.');
      db = connection;
      return db;
    });
  });};

// Disconnect from MongoDB instance.
var disconnect = function disconnect() {return _bluebird2['default']['try'](function () {
    if (db) {
      return db.close().then(function () {
        db = undefined;
        log.info('Disconnected from MongoDB.');
      });
    }
  });};

// Get day before.
// const dayBefore = date =>
// Number(moment(String(date), 'YYYYMMDD').subtract(1, 'days').format('YYYYMMDD'));

// Get day after.
var dayAfter = function dayAfter(date) {return (
    Number((0, _moment2['default'])(String(date), 'YYYYMMDD').add(1, 'days').format('YYYYMMDD')));};

// Add days.
var addDays = function addDays(date, count) {return (
    Number((0, _moment2['default'])(String(date), 'YYYYMMDD').add(count, 'days').format('YYYYMMDD')));};

// Day diff.
var dayDiff = function dayDiff(start, end) {
  var s = (0, _moment2['default'])(String(start), 'YYYYMMDD');
  var e = (0, _moment2['default'])(String(end), 'YYYYMMDD');
  return s.diff(e, 'days');
};

// Fetch logs from all the modules.
var findLogs = function findLogs(options) {return _bluebird2['default']['try'](function () {return connect();}).
  then(function () {return db.collection('logs').
    find({
      label: { $in: options.labels },
      level: { $in: options.levels } }).

    sort({ $natural: options.sort }).
    limit(options.limit).
    toArray();});};


// Fetch jobs.
var findJobs = function findJobs(options) {return _bluebird2['default']['try'](function () {return connect();}).
  then(function () {return db.collection('jobs').
    find({ status: { $in: options.status } }).
    sort({ $natural: options.sort }).
    limit(options.limit).
    toArray();});};


// Selectively eep copy item data.
var copyItem = function copyItem(value, key) {
  var result = {};
  result[key] = {};
  if (value.asnNewCount) result[key].asnNewCount = value.asnNewCount;
  if (value.asnNewSum) result[key].asnNewSum = value.asnNewSum;
  if (value.asnTotalCount) result[key].asnTotalCount = value.asnTotalCount;
  if (value.asnTotalSum) result[key].asnTotalSum = value.asnTotalSum;
  if (value.ipv4NewCount) result[key].ipv4NewCount = value.ipv4NewCount;
  if (value.ipv4NewSum) result[key].ipv4NewSum = value.ipv4NewSum;
  if (value.ipv4TotalCount) result[key].ipv4TotalCount = value.ipv4TotalCount;
  if (value.ipv4TotalSum) result[key].ipv4TotalSum = value.ipv4TotalSum;
  if (value.ipv6NewCount) result[key].ipv6NewCount = value.ipv6NewCount;
  if (value.ipv6NewSum) result[key].ipv6NewSum = value.ipv6NewSum;
  if (value.ipv6TotalCount) result[key].ipv6TotalCount = value.ipv6TotalCount;
  if (value.ipv6TotalSum) result[key].ipv6TotalSum = value.ipv6TotalSum;
  return result;
};

// Massage statistics to more convenient format.
// NOTE: Figure out a more elegant way to do this.
var massageStats = function massageStats(data, updated) {
  if (data.length > 0) {
    stats = {
      updated: updated,
      dates: [] };


    var counter = 0;
    var date = void 0;var _loop = function _loop() {


      // Fill date.
      date = data[counter];
      var day = {};
      _lodash2['default'].each(date.countries, function (value, key) {
        day[key] = {};

        var asnNewCount = _lodash2['default'].get(value, 'asn.new.count', undefined);
        if (asnNewCount) day[key].asnNewCount = asnNewCount;
        var asnNewSum = _lodash2['default'].get(value, 'asn.new.sum', undefined);
        if (asnNewSum) day[key].asnNewSum = asnNewSum;
        var asnTotalCount = _lodash2['default'].get(value, 'asn.total.count', undefined);
        if (asnTotalCount) day[key].asnTotalCount = asnTotalCount;
        var asnTotalSum = _lodash2['default'].get(value, 'asn.total.sum', undefined);
        if (asnTotalSum) day[key].asnTotalSum = asnTotalSum;

        var ipv4NewCount = _lodash2['default'].get(value, 'ipv4.new.count', undefined);
        if (ipv4NewCount) day[key].ipv4NewCount = ipv4NewCount;
        var ipv4NewSum = _lodash2['default'].get(value, 'ipv4.new.sum', undefined);
        if (ipv4NewSum) day[key].ipv4NewSum = ipv4NewSum;
        var ipv4TotalCount = _lodash2['default'].get(value, 'ipv4.total.count', undefined);
        if (ipv4TotalCount) day[key].ipv4TotalCount = ipv4TotalCount;
        var ipv4TotalSum = _lodash2['default'].get(value, 'ipv4.total.sum', undefined);
        if (ipv4TotalSum) day[key].ipv4TotalSum = ipv4TotalSum;

        var ipv6NewCount = _lodash2['default'].get(value, 'ipv6.new.count', undefined);
        if (ipv6NewCount) day[key].ipv6NewCount = ipv6NewCount;
        if (value.ipv6 && value.ipv6['new'] && value.ipv6['new'].sum && !_lodash2['default'].isEmpty(value.ipv6['new'].sum)) {
          day[key].ipv6NewSum = value.ipv6['new'].sum;
        }
        var ipv6TotalCount = _lodash2['default'].get(value, 'ipv6.total.count', undefined);
        if (ipv6TotalCount) day[key].ipv6TotalCount = ipv6TotalCount;
        if (value.ipv6 && value.ipv6.total &&
        value.ipv6.total.sum && !_lodash2['default'].isEmpty(value.ipv6.total.sum)) {
          day[key].ipv6TotalSum = value.ipv6.total.sum;
        }
      });
      stats.dates.push(day);

      // Fill empty dates.
      var after = dayAfter(data[counter].header.endDate);
      var copy = void 0;
      while (
      counter + 1 < data.length &&
      data[counter + 1].header.endDate > after)
      {
        copy = _lodash2['default'].each(day, copyItem);
        stats.dates.push(copy);
        after = dayAfter(after);
      }
      counter += 1;};do {_loop();
    } while (counter < data.length);

    stats.start = data[0].header.endDate;
    stats.end = addDays(data[0].header.endDate, stats.dates.length - 1);
  }
};

// Check stats.
var refreshStats = function refreshStats() {return _bluebird2['default']['try'](function () {return connect();}).
  then(function () {return db.collection('jobs').
    find({ status: 'completed' }).
    sort({ $natural: 1 }).
    toArray();}).

  then(function (jobs) {
    if (stats === undefined || jobs.length < 1 || jobs[jobs.length - 1].endedAt > stats.updated) {
      return _bluebird2['default']['try'](function () {return db.collection('stats').find().sort({ _id: 1 }).toArray();}).
      then(function (data) {return massageStats(data, jobs[jobs.length - 1].endedAt);}).
      then(function () {return stats;});
    }
    return stats;
  });};

// Fetch full stats.
var fetchFullStats = function fetchFullStats() {return _bluebird2['default']['try'](function () {return refreshStats();});};

// Fetch single new delegations.
var findSingleNewDelegations = function findSingleNewDelegations(options) {return _bluebird2['default']['try'](function () {return refreshStats();}).
  then(function () {
    var delegations = {
      asn: [],
      ipv4: [],
      ipv6: [] };

    var offset = dayDiff(options.date, stats.start);
    var day = stats.dates[offset];
    _lodash2['default'].each(day, function (value, key) {
      if (_lodash2['default'].find(options.types, function (type) {return type === 'asn';})) {
        if (value.asnNewCount) {
          delegations.asn.push({
            code: key,
            'new': {
              count: value.asnNewCount,
              sum: value.asnNewSum } });


        }
      }
      if (_lodash2['default'].find(options.types, function (type) {return type === 'ipv4';})) {
        if (value.ipv4NewCount) {
          delegations.ipv4.push({
            code: key,
            'new': {
              count: value.ipv4NewCount,
              sum: value.ipv4NewSum } });


        }
      }
      if (_lodash2['default'].find(options.types, function (type) {return type === 'ipv6';})) {
        if (value.ipv6NewCount) {
          delegations.ipv6.push({
            code: key,
            'new': {
              count: value.ipv6NewCount,
              sum: value.ipv6NewSum } });


        }
      }
    });
    return _economies2['default'].groupByEconomy(delegations, options.economy, 'new');
  });};

// Fetch single total delegations.
var findSingleTotalDelegations = function findSingleTotalDelegations(options) {return _bluebird2['default']['try'](function () {return refreshStats();}).
  then(function () {
    var delegations = {
      asn: [],
      ipv4: [],
      ipv6: [] };

    var offset = dayDiff(options.date, stats.start);
    var day = stats.dates[offset];
    _lodash2['default'].each(day, function (value, key) {
      if (_lodash2['default'].find(options.types, function (type) {return type === 'asn';})) {
        if (value.asnTotalCount) {
          delegations.asn.push({
            code: key,
            total: {
              count: value.asnTotalCount,
              sum: value.asnTotalSum } });


        }
      }
      if (_lodash2['default'].find(options.types, function (type) {return type === 'ipv4';})) {
        if (value.ipv4TotalCount) {
          delegations.ipv4.push({
            code: key,
            total: {
              count: value.ipv4TotalCount,
              sum: value.ipv4TotalSum } });


        }
      }
      if (_lodash2['default'].find(options.types, function (type) {return type === 'ipv6';})) {
        if (value.ipv6TotalCount) {
          delegations.ipv6.push({
            code: key,
            total: {
              count: value.ipv6TotalCount,
              sum: value.ipv6TotalSum } });


        }
      }
    });
    return _economies2['default'].groupByEconomy(delegations, options.economy, 'total');
  });};

// Fetch new delegations in date range.
var findRangeNewDelegations = function findRangeNewDelegations(options) {return _bluebird2['default']['try'](function () {return refreshStats();}).
  then(function () {
    var delegations = {
      asn: [],
      ipv4: [],
      ipv6: [] };

    var start = dayDiff(options.start, stats.start);
    var end = dayDiff(options.end, stats.start);
    for (var i = start; i < end; i += 1) {
      var _day = stats.dates[i];
      _lodash2['default'].each(_day, function (value, key) {
        if (_lodash2['default'].find(options.types, function (type) {return type === 'asn';})) {
          if (value.asnNewCount) {
            delegations.asn.push({
              code: key,
              'new': {
                count: value.asnNewCount,
                sum: value.asnNewSum } });


          }
        }
        if (_lodash2['default'].find(options.types, function (type) {return type === 'ipv4';})) {
          if (value.ipv4NewCount) {
            delegations.ipv4.push({
              code: key,
              'new': {
                count: value.ipv4NewCount,
                sum: value.ipv4NewSum } });


          }
        }
        if (_lodash2['default'].find(options.types, function (type) {return type === 'ipv6';})) {
          if (value.ipv6NewCount) {
            delegations.ipv6.push({
              code: key,
              'new': {
                count: value.ipv6NewCount,
                sum: value.ipv6NewSum } });


          }
        }
      });
    }

    return _economies2['default'].groupByEconomy(delegations, options.economy, 'new');
  });};

// Fetch new delegations in date range.
// const findRangeNewDelegations = options => Promise.try(() => connect())
// .then(() => {
// const isAsn = _.find(options.types, type => type === 'asn');
// const isIpv4 = _.find(options.types, type => type === 'ipv4');
// const isIpv6 = _.find(options.types, type => type === 'ipv6');
// return Promise.try(() => {
// const match = {
// _id: {
// $gte: dayBefore(options.start),
// $lte: dayBefore(options.end),
// },
// };
// const projection = {
// _id: 0,
// filename: 0,
// header: 0,
// totals: 0,
// };
// if (!isAsn) projection.asn = 0;
// if (!isIpv4) projection.ipv4 = 0;
// if (!isIpv6) projection.ipv6 = 0;
// return db.collection('stats')
// .find(match, projection)
// .toArray();
// })
// .then((results) => {
// const filtered = {
// asn: [],
// ipv4: [],
// ipv6: [],
// };
// _.each(results, (result) => {
// _.each(options.types, (type) => {
// _.each(result[type], (item) => {
// const index = _.findIndex(filtered[type], stat => stat.code === item.code);
// if (item.new.count > 0) {
// if (index === -1) {
// filtered[type].push({
// code: item.code,
// new: {
// count: item.new.count,
// sum: item.new.sum,
// },
// });
// } else if (type === 'asn') {
// filtered.asn[index].new.count += item.new.count;
// filtered.asn[index].new.sum += item.new.sum;
// } else {
// filtered[type][index].new.count += item.new.count;
// filtered[type][index].new.sum = math.add(
// math.bignumber(filtered[type][index].new.sum),
// math.bignumber(item.new.sum),
// );
// }
// }
// });
// });
// });
// return economies.groupByEconomy(filtered, options.economy, 'new');
// });
// });
exports['default'] =
{
  connect: connect,
  disconnect: disconnect,
  findLogs: findLogs,
  findJobs: findJobs,
  findSingleNewDelegations: findSingleNewDelegations,
  findSingleTotalDelegations: findSingleTotalDelegations,
  findRangeNewDelegations: findRangeNewDelegations,
  fetchFullStats: fetchFullStats };


// Fetch new delegations in date range.
// const findRangeDelegations = options => Promise.try(() => connect())
//   .then(() => {
//     const after = dayBefore(options.start);
//     const before = dayBefore(options.end);
//     const isAsn = _.find(options.types, type => type === 'asn');
//     const isIpv4 = _.find(options.types, type => type === 'ipv4');
//     const isIpv6 = _.find(options.types, type => type === 'ipv6');
//     const pipeline = [];

//     console.log(after, before);
//     pipeline.push({ $match: { _id: { $gte: after, $lte: before } } });
//     if (isAsn) pipeline.push({ $unwind: '$asn' });
//     if (isIpv4) pipeline.push({ $unwind: '$ipv4' });
//     if (isIpv6) pipeline.push({ $unwind: '$ipv6' });
//     pipeline.push({

//     return db.collection('stats')
//       .aggregate(pipeline)
//       .toArray();
//   })
//   .then(result => console.log(result));

// Fetch sum of new delegations in date range.
// NOTE: temporarily retired
// const findRangeDelegations = options => Promise.try(() => connect())
//   .then(() => {
//     const ranges = {};
//     return Promise.try(() => db.collection('stats').aggregate([
//       { $match: { _id: { $gte: dayBefore(options.start), $lte: dayBefore(options.end) } } },
//       { $unwind: '$asn' },
//       { $group: { _id: '$asn.code', sum: { $sum: '$asn.new' } } },
//     ]).toArray())
//       .then((result) => { ranges.asn = result; })
//       .then(() => db.collection('stats').aggregate([
//         { $match: { _id: { $gte: dayBefore(options.start), $lte: dayBefore(options.end) } } },
//         { $unwind: '$ipv4' },
//         { $group: { _id: '$ipv4.code', sum: { $sum: '$ipv4.new' } } },
//       ]).toArray())
//       .then((result) => { ranges.ipv4 = result; })
//       .then(() => db.collection('stats').aggregate([
//         { $match: { _id: { $gte: dayBefore(options.start), $lte: dayBefore(options.end) } } },
//         { $unwind: '$ipv6' },
//         { $group: { _id: '$ipv6.code', sum: { $sum: '$ipv4.new' } } },
//       ]).toArray())
//       .then((result) => { ranges.ipv6 = result; })
//       .then(() => ranges);
//   });