Object.defineProperty(exports, "__esModule", { value: true });

var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _momentTimezone = require('moment-timezone');var _momentTimezone2 = _interopRequireDefault(_momentTimezone);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };} // Utility for custom configuration and environment variable handling.

_momentTimezone2['default'].tz.setDefault('UTC');

var create = function create() {
  var defaults = {
    LOG_COLLECTION: 'logs',
    LOG_LABEL: 'connector',
    MONGO_HOST: 'localhost',
    MONGO_PORT: 27017,
    MONGO_NAME: 'apnic',
    MONGO_USER: undefined,
    MONGO_PASS: undefined,
    FTP_HOST: 'http://ftp.apnic.net',
    FTP_LOCAL: './.data/ftp',
    FTP_REMOTE: '/stats/apnic/',
    FTP_TIMEZONE: 'Australia/Brisbane',
    FTP_SYNC_CONCURRENCY: 20,
    FTP_GUNZIP_CONCURRENCY: 10,
    CSV_LOCATION: './.data/csv/',
    CSV_FIRST_DATE: 20080214,
    CSV_PARSING_CONCURRENCY: 10 };


  var internals = {
    CLEAN_START: false,
    FTP_SKIP_SYNC: false,
    FTP_SKIP_DECOMPRESSION: false };


  // Merge internals with defaults.
  var config = _lodash2['default'].merge(defaults, internals);

  // Throw if invalid environment.
  if (process.env.NODE_ENV !== 'test' &&
  process.env.NODE_ENV !== 'development' &&
  process.env.NODE_ENV !== 'staging' &&
  process.env.NODE_ENV !== 'production') {
    throw new Error('Wrong or unspecified NODE_ENV!');
  }

  // Apply overrides and do exports of environment variables.
  _lodash2['default'].each(config, function (value, key) {
    if (process.env[key] !== undefined && !_lodash2['default'].find(internals, function (item) {return item === process.env[key];})) {
      config[key] = process.env[key];
    } else {
      process.env[key] = String(value);
    }
  });

  return config;
};exports['default'] =

{
  create: create };