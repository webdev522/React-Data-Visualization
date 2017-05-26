Object.defineProperty(exports, "__esModule", { value: true });

var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);
var _fsExtra = require('fs-extra');var _fsExtra2 = _interopRequireDefault(_fsExtra);
var _child_process = require('child_process');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

// Synchronizes local FTP directory with remote.
// FTP-related utilites.
var mirror = function mirror() {return new _bluebird2['default'](function (resolve, reject) {
    if (cfg.FTP_SKIP_SYNC) {
      log.warn('Skipping FTP mirror sync.');
      resolve();
    } else {
      var ftpArgs = [
      cfg.FTP_HOST,
      cfg.FTP_TIMEZONE,
      cfg.FTP_SYNC_CONCURRENCY,
      cfg.FTP_REMOTE,
      cfg.FTP_LOCAL];

      _fsExtra2['default'].ensureDirSync(_path2['default'].resolve(_path2['default'].join(base, cfg.FTP_LOCAL)));
      var ftpCmd = (0, _child_process.spawn)('./scripts/shell/ftpSync.sh', ftpArgs);

      log.info('Started FTP mirror sync.');

      ftpCmd.stdout.on('data', function (data) {
        log.multiline(data, 'info');
      });

      ftpCmd.stderr.on('data', function (data) {
        log.multiline(data, 'warn');
      });

      ftpCmd.on('close', function (code) {
        if (code === 0) {
          log.info('FTP mirror sync complete.');
          resolve();
        } else {
          reject(new Error('FTP mirror sync failure.'));
        }
      });
    }
  });};exports['default'] =

{
  mirror: mirror };