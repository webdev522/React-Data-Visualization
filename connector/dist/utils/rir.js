Object.defineProperty(exports, "__esModule", { value: true });

var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

// Regular expressions for all report formats in both JS and PCRE variants.
// RIR statistics utility.
var formats = { js: {
    ancient: /apnic-\d{4}-\d{2}-\d{2}/,
    legacy: /legacy-apnic-\d{8}/,
    assigned: /assigned-apnic-\d{8}/,
    ipv6: /delegated-apnic-ipv6-assigned-\d{8}/,
    delegated: /delegated-apnic-\d{8}/,
    extended: /delegated-apnic-extended-\d{8}/ },

  pcre: {
    ancient: 'apnic-[0-9]\\{4}-[0-9]\\{2}-[0-9]\\{2}\\.gz$',
    legacy: 'legacy-apnic-[0-9]\\{8}\\.gz$',
    assigned: 'assigned-apnic-[0-9]\\{8}\\.gz$',
    ipv6: 'delegated-apnic-ipv6-extended-[0-9]\\{8}\\.gz$',
    delegated: 'delegated-apnic-[0-9]\\{8}\\.gz$',
    extended: 'delegated-apnic-extended-[0-9]\\{8}\\.gz$' } };



// Infers RIR report format from filename.
var detectFormat = function detectFormat(filename) {
  var format = void 0;

  if (formats.js.ancient.test(filename)) format = 'ancient';else
  if (formats.js.legacy.test(filename)) format = 'legacy';else
  if (formats.js.assigned.test(filename)) format = 'assigned';else
  if (formats.js.ipv6.test(filename)) format = 'ipv6';else
  if (formats.js.delegated.test(filename)) format = 'delegated';else
  if (formats.js.extended.test(filename)) format = 'extended';else
  throw new TypeError('Unrecognized RIR report format!');

  return format;
};

// Finds integer time from filename.
var filenameToDate = function filenameToDate(filename) {
  var extension = _path2['default'].extname(filename);
  var lean = _path2['default'].basename(filename, extension);
  var format = detectFormat(lean);
  var date = void 0;

  if (format === 'ancient') {
    date = Number.parseInt(lean.substr(lean.length - 10).replace(/-/g, ''), 10);
  } else {
    date = Number.parseInt(lean.substr(lean.length - 8), 10);
  }

  return date;
};

// Finds registry from filename.
var filenameToRegistry = function filenameToRegistry(filename) {
  var lean = _path2['default'].basename(filename);
  if (lean.indexOf('afrinic') !== -1) return 'afrinic';else
  if (lean.toLowerCase().indexOf('apnic') !== -1) return 'apnic';else
  if (lean.toLowerCase().indexOf('arin') !== -1) return 'arin';else
  if (lean.toLowerCase().indexOf('iana') !== -1) return 'iana';else
  if (lean.toLowerCase().indexOf('lacnic') !== -1) return 'lacnic';else
  if (lean.toLowerCase().indexOf('ripe') !== -1) return 'ripe';else
  if (lean.toLowerCase().indexOf('ripencc') !== -1) return 'ripe';else
  if (lean.toLowerCase().indexOf('ripe-ncc') !== -1) return 'ripe';
  return 'unknown';
};

// Sort list of filepaths according to filename-inferred epoch time.
var sortFilepathsByDate = function sortFilepathsByDate(filepaths) {return (0, _lodash2['default'])(filepaths).
  sortBy(function (filepath) {return filenameToDate(filepath);}).
  value();};exports['default'] =

{
  formats: formats,
  detectFormat: detectFormat,
  filenameToDate: filenameToDate,
  filenameToRegistry: filenameToRegistry,
  sortFilepathsByDate: sortFilepathsByDate };