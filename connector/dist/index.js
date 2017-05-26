

var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _appRootPath = require('app-root-path');var _appRootPath2 = _interopRequireDefault(_appRootPath);
var _config = require('./config');var _config2 = _interopRequireDefault(_config);
var _logger = require('./logger');var _logger2 = _interopRequireDefault(_logger);
var _job = require('./utils/job');var _job2 = _interopRequireDefault(_job);
var _fsx = require('./utils/fsx');var _fsx2 = _interopRequireDefault(_fsx);
var _mongo = require('./mongo');var _mongo2 = _interopRequireDefault(_mongo);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

// Export few things to global namespace for convenience.
global.cfg = _config2['default'].create(); // Application entry point.
global.log = _logger2['default'].start();
global.base = _appRootPath2['default'].path;

// Catch all uncaught errors and exceptions and log them.
process.on('unhandledRejection', function (error, promise) {
  log.error('unhandled rejection', { error: error, promise: promise });
});
process.on('uncaughtException', function (error) {
  log.error('uncaught exception', error);
});

// Log configuration variables.
_lodash2['default'].each(cfg, function (value, key) {
  log.info('Variable ' + String(key) + ' set to ' + String(value) + '.');
});

// Schedule a job.
_bluebird2['default']['try'](function () {
  if (cfg.CLEAN_START) {
    log.info('Cleaning previous ingestion...');
    return _mongo2['default'].clean().
    then(function () {return _fsx2['default'].removeDirectory(_path2['default'].join(base, cfg.FTP_LOCAL));}).
    then(function () {return _fsx2['default'].removeDirectory(_path2['default'].join(base, cfg.CSV_LOCATION));}).
    then(function () {return log.warn('Previous ingestion cleaned.');});
  }
}).
then(_mongo2['default'].invalidateJobs).
then(function (count) {
  if (count) log.warn('Invalidated ' + String(count) + ' old jobs.');
}).
then(_job2['default'].runJob)['catch'](
function (err) {return log.error(err);});