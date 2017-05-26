Object.defineProperty(exports, "__esModule", { value: true });



var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);
var _fs = require('fs');var _fs2 = _interopRequireDefault(_fs);
var _fsExtra = require('fs-extra');var _fsExtra2 = _interopRequireDefault(_fsExtra);
var _child_process = require('child_process');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

// Decompresses a single FTP file archive if it's not already decompressed.
// Compression related utilites.
/* eslint-disable import/prefer-default-export */var decompress = function decompress(file) {return new _bluebird2['default'](function (resolve, reject) {
    var output = String(_path2['default'].join(base, cfg.CSV_LOCATION, _path2['default'].basename(file, '.gz'))) + '.csv';
    var result = _path2['default'].basename(output);
    _fs2['default'].access(output, _fs2['default'].constants.R_OK, function (err) {
      if (err) {
        (0, _child_process.exec)('gunzip -c ' + String(file) + ' > ' + output, function (err) {
          if (err) {
            reject(new Error('FTP archive decompression failed on ' + String(file) + '.'));
          } else {
            resolve(result);
          }
        });
      } else {
        resolve(result);
      }
    });
  });};

// Decompresses all FTP file archives.
var decompressArchives = function decompressArchives(files) {
  if (cfg.FTP_SKIP_DECOMPRESSION) {
    log.warn('Skipping FTP archive decompression.');
    return _bluebird2['default']['try'](function () {return (0, _lodash2['default'])(files).
      map(function (file) {
        var output = String(_path2['default'].join(base, cfg.CSV_LOCATION, _path2['default'].basename(file, '.gz'))) + '.csv';
        return _path2['default'].basename(output);
      }).
      value();});

  }

  _fsExtra2['default'].ensureDirSync(_path2['default'].resolve(_path2['default'].join(base, cfg.CSV_LOCATION)));
  return _bluebird2['default']['try'](function () {return files;}).
  then(function (results) {
    log.info('Starting FTP archive decompression.');
    return results;
  }).
  map(decompress, { concurrency: cfg.FTP_GUNZIP_CONCURRENCY }).
  then(function (results) {
    log.info('Decompressed ' + String(results.length) + ' archives.');
    return results;
  });
};exports['default'] =

{
  decompressArchives: decompressArchives };