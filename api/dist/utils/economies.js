Object.defineProperty(exports, "__esModule", { value: true });var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _fs = require('fs');var _fs2 = _interopRequireDefault(_fs);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);
var _mathjs = require('mathjs');var _mathjs2 = _interopRequireDefault(_mathjs);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

_bluebird2['default'].promisifyAll(_fs2['default']);

// Loads up file with ISO-3166 definitions.
var list = JSON.parse(
_fs2['default'].readFileSync(_path2['default'].resolve('./data/economies.json'), 'utf-8'));


// Registrar from country code.
var rirFromCode = function rirFromCode(code) {
  var entry = _lodash2['default'].find(list, function (item) {return item.code === code;});
  if (!entry || entry.rir === '') return 'unknown';
  return entry.rir;
};

// Country from country code.
var countryFromCode = function countryFromCode(code) {
  var entry = _lodash2['default'].find(list, function (item) {return item.code === code;});
  if (!entry || entry.country === '') return 'unknown';
  return entry.country;
};

// Subregion from country code.
var subregionFromCode = function subregionFromCode(code) {
  var entry = _lodash2['default'].find(list, function (item) {return item.code === code;});
  if (!entry || entry.subregion === '') return 'unknown';
  return entry.subregion;
};

// Region from country code.
var regionFromCode = function regionFromCode(code) {
  var entry = _lodash2['default'].find(list, function (item) {return item.code === code;});
  if (!entry || entry.region === '') return 'unknown';
  return entry.region;
};

// Get economy.
var getEconomy = function getEconomy(code, economy) {
  if (economy === 'region') {
    return regionFromCode(code);
  } else if (economy === 'subregion') {
    return subregionFromCode(code);
  }
  return countryFromCode(code);
};

var mergeSum = function mergeSum(one, two) {
  var result = {};

  _lodash2['default'].each(one, function (value, key) {
    if (two[key]) {
      result[key] = value + two[key];
    } else {
      result[key] = value;
    }
  });

  _lodash2['default'].each(two, function (value, key) {
    if (one[key] === undefined) {
      result[key] = value;
    }
  });

  return result;
};

var sumSquares = function sumSquares(entries) {
  var bigtwo = _mathjs2['default'].bignumber(2);
  var sum = _mathjs2['default'].bignumber(0);
  _lodash2['default'].each(entries, function (value, key) {
    var exponent = _mathjs2['default'].bignumber(Number.parseInt(key, 10));
    var item = _mathjs2['default'].bignumber(0);
    for (var i = 0; i < value; i += 1) {
      item = _mathjs2['default'].add(
      item,
      _mathjs2['default'].pow(bigtwo, exponent));

    }
    sum = _mathjs2['default'].add(sum, item);
  });
  return sum.toString();
};

// Group by economy.
var groupByEconomy = function groupByEconomy(entries, economy, field) {
  var types = ['asn', 'ipv4', 'ipv6'];
  var group = {
    asn: [],
    ipv4: [],
    ipv6: [] };


  _lodash2['default'].each(types, function (type) {
    _lodash2['default'].each(entries[type], function (entry) {
      var code = getEconomy(entry.code, economy);
      var index = _lodash2['default'].findIndex(group[type], function (stat) {return stat.code === code;});
      if (index === -1) {
        var tmp = { code: code };
        tmp[field] = {
          count: entry[field].count,
          sum: entry[field].sum };

        group[type].push(tmp);
      } else if (type === 'asn' || type === 'ipv4') {
        group[type][index][field].count += entry[field].count;
        group[type][index][field].sum += entry[field].sum;
      } else {
        group[type][index][field].count += entry[field].count;
        group[type][index][field].sum = mergeSum(
        group[type][index][field].sum,
        entry[field].sum);

      }
    });
  });

  /* eslint-disable no-param-reassign */
  _lodash2['default'].each(group.ipv6, function (entry) {
    if (entry['new'] && entry['new'].sum) {
      entry['new'].sum = sumSquares(entry['new'].sum);
    }
    if (entry.total && entry.total.sum) {
      entry.total.sum = sumSquares(entry.total.sum);
    }
  });
  /* eslint-enable no-param-reassign */

  return group;
};exports['default'] =

{
  list: list,
  getEconomy: getEconomy,
  rirFromCode: rirFromCode,
  countryFromCode: countryFromCode,
  subregionFromCode: subregionFromCode,
  regionFromCode: regionFromCode,
  groupByEconomy: groupByEconomy };