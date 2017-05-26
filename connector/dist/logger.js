Object.defineProperty(exports, "__esModule", { value: true });

var _winston = require('winston');var _winston2 = _interopRequireDefault(_winston);
require('winston-mongodb');
var _momentTimezone = require('moment-timezone');var _momentTimezone2 = _interopRequireDefault(_momentTimezone);
var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };} // Logging utilites.

var start = function start() {
  // Set log level per environment.
  var level = void 0;
  switch (process.env.NODE_ENV) {
    case 'test':
      level = 'error';
      break;
    case 'production':
      level = 'info';
      break;
    case 'development':
      level = 'debug';
      break;
    case 'staging':
      level = 'verbose';
      break;
    default:
      level = 'verbose';}


  // Winston console transport options.
  var consoleOptions = {
    json: false,
    exceptionsLevel: 'error',
    level: level,
    colorize: true,
    humanReadableUnhandledException: true,
    timestamp: function () {function timestamp() {return _momentTimezone2['default'].utc().format('YYYY-MM-DD HH:mm:ss');}return timestamp;}() };


  // Winston MongoDB transport options.
  var mongoOptions = {
    json: true,
    exceptionsLevel: 'error',
    level: level,
    colorize: false,
    timestamp: function () {function timestamp() {return _momentTimezone2['default'].utc().format('YYYY-MM-DD HH:mm:ss');}return timestamp;}(),
    collection: cfg.LOG_COLLECTION,
    label: cfg.LOG_LABEL,
    capped: true,
    tryReconnect: true,
    decolorize: true };


  if (cfg.MONGO_USER && cfg.MONGO_PASS) {
    mongoOptions.db = 'mongodb://' + String(cfg.MONGO_USER) + ':' + String(cfg.MONGO_PASS) + '@' + String(cfg.MONGO_HOST) + ':' + String(cfg.MONGO_PORT) + '/' + String(cfg.MONGO_NAME) + '?authSource=admin';
  } else {
    mongoOptions.db = 'mongodb://' + String(cfg.MONGO_HOST) + ':' + String(cfg.MONGO_PORT) + '/' + String(cfg.MONGO_NAME);
  }

  // Create new console transport.
  var consoleTransport = new _winston2['default'].transports.Console(consoleOptions);

  // Create new console transport.
  var mongoTransport = new _winston2['default'].transports.MongoDB(mongoOptions);

  var log = new _winston2['default'].Logger({
    transports: [
    consoleTransport,
    mongoTransport],

    exitOnError: true });


  // Logs multi-line string as multiple log entries.
  log.multiline = function (data, lvl) {
    var lines = data.toString().split('\n');
    _lodash2['default'].each(lines, function (line) {
      if (line.replace(/\s/g, '').length > 0) log[lvl](line);
    });
  };

  return log;
};exports['default'] =

{
  start: start };