Object.defineProperty(exports, "__esModule", { value: true });

var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _momentTimezone = require('moment-timezone');var _momentTimezone2 = _interopRequireDefault(_momentTimezone);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };} // Utility for custom configuration and environment variable handling.

_momentTimezone2['default'].tz.setDefault('UTC');

var create = function create() {
  var defaults = {
    LOG_COLLECTION: 'logs',
    LOG_LABEL: 'api',
    API_PORT: 3000,
    MONGO_NAME: 'apnic',
    MONGO_HOST: 'localhost',
    MONGO_PORT: 27017,
    MONGO_USER: undefined,
    MONGO_PASS: undefined,
    CSV_FIRST_DATE: 20080214 };


  // Throw if invalid environment.
  if (process.env.NODE_ENV !== 'development' &&
  process.env.NODE_ENV !== 'test' &&
  process.env.NODE_ENV !== 'staging' &&
  process.env.NODE_ENV !== 'production') {
    throw new Error('Wrong or unspecified NODE_ENV!');
  }

  // Apply overrides and do exports of environment variables.
  _lodash2['default'].each(defaults, function (value, key) {
    if (process.env[key] !== undefined) {
      defaults[key] = process.env[key];
    } else {
      process.env[key] = String(value);
    }
  });

  return defaults;
};exports['default'] =

{
  create: create };