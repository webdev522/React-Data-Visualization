Object.defineProperty(exports, "__esModule", { value: true });

var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _fs = require('fs');var _fs2 = _interopRequireDefault(_fs);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };} // ISO-code-related utilities.

_bluebird2['default'].promisifyAll(_fs2['default']);

// Loads up file with ISO-3166 definitions.
var iso3166 = JSON.parse(
_fs2['default'].readFileSync(_path2['default'].join(base, './docs/iso/iso3166.json'), 'utf-8'));


// Figures out which subregion does the country code belong to, and handles
// some edge cases.
var subRegionFromAlpha2 = function subRegionFromAlpha2(code) {
  var entry = _lodash2['default'].find(iso3166, function (country) {return country['alpha-2'] === code;});
  if (entry === undefined) {
    if (code === 'EU') return 'Europe';else
    if (code === 'AP') return 'Asia-Pacific';
    return '';
  }
  if (entry['sub-region'] === undefined) return 'No Region';else
  if (entry['sub-region'] === 'Australia and New Zealand') return 'Oceania';else
  if (entry['sub-region'] === 'Polynesia') return 'Oceania';else
  if (entry['sub-region'] === 'Micronesia') return 'Oceania';else
  if (entry['sub-region'] === 'Melanesia') return 'Oceania';
  return entry['sub-region'];
};exports['default'] =

{
  iso3166: iso3166,
  subRegionFromAlpha2: subRegionFromAlpha2 };