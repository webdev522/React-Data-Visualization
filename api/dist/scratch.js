





var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);
var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _economies = require('./utils/economies');var _economies2 = _interopRequireDefault(_economies);
var _mathjs = require('mathjs');var _mathjs2 = _interopRequireDefault(_mathjs);
var _moment = require('moment');var _moment2 = _interopRequireDefault(_moment);
var _mongodb = require('mongodb');var _mongodb2 = _interopRequireDefault(_mongodb);
var _appRootPath = require('app-root-path');var _appRootPath2 = _interopRequireDefault(_appRootPath);
var _config = require('./config');var _config2 = _interopRequireDefault(_config);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

// Export few things to global namespace for convenience.
// IGNORE!
// Just a module to play with temporary stuff.
// ^_^
/* eslint-disable */global.cfg = _config2['default'].init();global.base = _appRootPath2['default'].path;var client = _mongodb2['default'].MongoClient;

_bluebird2['default'].promisifyAll(client);

var db = void 0;

// Connect to MongoDB instance.
var connect = function connect() {return _bluebird2['default']['try'](function () {
    if (db) {
      return db;
    }
    var url = 'mongodb://' + String(cfg.MONGO_HOST) + ':' + String(cfg.MONGO_PORT) + '/' + String(cfg.MONGO_NAME);
    var options = { promiseLibrary: _bluebird2['default'] };
    return client.connect(url, options).
    then(function (connection) {
      db = connection;
      return db;
    });
  });};

// Disconnect from MongoDB instance.
var disconnect = function disconnect() {return _bluebird2['default']['try'](function () {
    if (db) {
      return db.close().then(function () {
        db = undefined;
      });
    }
  });};

var fetchStats = function fetchStats() {return _bluebird2['default']['try'](function () {return connect();}).
  then(function () {return db.collection('stats').find().sort({ _id: 1 }).toArray();});};

fetchStats().
then(function (stats) {
  var counter = 0;
  _lodash2['default'].each(stats, function (stat) {
    if (stat.header.endDate < 20120101 && stat.header.endDate > 20101231) {
      _lodash2['default'].each(stat.countries, function (country) {
        if (country.asn && country.asn['new'] && country.asn['new'].sum) {
          counter += country.asn['new'].sum;
        }
      });
    }
  });
  console.log(counter);
}).
then(function () {return process.exit(0);});