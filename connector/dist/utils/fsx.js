Object.defineProperty(exports, "__esModule", { value: true });

var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);
var _fs = require('fs');var _fs2 = _interopRequireDefault(_fs);
var _fsExtra = require('fs-extra');var _fsExtra2 = _interopRequireDefault(_fsExtra);
var _klaw = require('klaw');var _klaw2 = _interopRequireDefault(_klaw);
var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };} // Extended filesystem utilities.

_bluebird2['default'].promisifyAll(_fs2['default']);
_bluebird2['default'].promisifyAll(_fsExtra2['default']);

// Operating system files regular expressions.
var sysFileRegExps = [
/\.*\.sw?/,
/\.AppleDB/,
/\.AppleDesktop/,
/\.AppleDouble/,
/\.DS_Store/,
/\.DS_Store*/,
/\.DocumentRevisions-V100/,
/\.LSOverride/,
/\.Spotlight-V100/,
/\.Trashes/,
/\.VolumeIcon\.icns/,
/\.apdisk/,
/\.fseventsd/,
/Icon^M^M/,
/Thumbs\.db/,
/ehthumbs\.db/,
/thumbs\.db/];


// Get file stats from filepath.
var getStats = function getStats(filepath) {return _fs2['default'].lstatSync(filepath);};

// Deduplicate array of file paths according to filename.
var uniqueFilenames = function uniqueFilenames(filepaths) {return (0, _lodash2['default'])(filepaths).
  uniqBy(function (filepath) {return _path2['default'].basename(filepath);}).
  value();};

// Checks is filepath a system file.
var isSystemFile = function isSystemFile(filepath) {
  var basename = _path2['default'].basename(filepath);
  var flag = false;
  _lodash2['default'].each(sysFileRegExps, function (regex) {
    flag = flag || regex.test(basename);
  });
  return flag;
};

// Checks is filepath a file.
var isFile = function isFile(filepath) {return getStats(filepath).isFile();};

// Checks is filepath a directory.
var isDirectory = function isDirectory(filepath) {return getStats(filepath).isDirectory();};

// Checks is filepath a block device.
var isBlockDevice = function isBlockDevice(filepath) {return getStats(filepath).isBlockDevice();};

// Checks is filepath a character device.
var isCharacterDevice = function isCharacterDevice(filepath) {return getStats(filepath).isCharacterDevice();};

// Checks is filepath a symbolic link.
var isSymbolicLink = function isSymbolicLink(filepath) {return getStats(filepath).isSymbolicLink();};

// Checks is filepath a FIFO.
var isFIFO = function isFIFO(filepath) {return getStats(filepath).isFIFO();};

// Checks is filepath a socket;
var isSocket = function isSocket(filepath) {return getStats(filepath).isSocket();};

// Checks is filepath a dotfile.
var isDotFile = function isDotFile(filepath) {return _path2['default'].basename(filepath).charAt(0) === '.';};

// Checks if filepath has extension.
var hasExtension = function hasExtension(filepath, extension) {return _path2['default'].extname(filepath) === extension;};

// Finds all filepaths in a directory.
var listFiles = function listFiles(dir) {return (
    new _bluebird2['default'](function (resolve) {
      var files = [];
      (0, _klaw2['default'])(_path2['default'].resolve(dir)).
      on('data', function (file) {
        if (file.stats.isFile()) {
          files.push(file.path);
        }
      }).
      on('end', function () {
        log.info('Found ' + String(files.length) + ' files in ' + String(dir) + '.');
        resolve(files);
      });
    }));};

// Delete directory.
var removeDirectory = function removeDirectory(filepath) {return _bluebird2['default']['try'](function () {return _fsExtra2['default'].removeAsync(filepath);})['catch'](
  function () {return _bluebird2['default'].resolve();});};exports['default'] =

{
  listFiles: listFiles,
  getStats: getStats,
  uniqueFilenames: uniqueFilenames,
  isSystemFile: isSystemFile,
  isFile: isFile,
  isDirectory: isDirectory,
  isBlockDevice: isBlockDevice,
  isCharacterDevice: isCharacterDevice,
  isSymbolicLink: isSymbolicLink,
  isFIFO: isFIFO,
  isSocket: isSocket,
  isDotFile: isDotFile,
  hasExtension: hasExtension,
  removeDirectory: removeDirectory };