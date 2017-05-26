Object.defineProperty(exports, "__esModule", { value: true });



var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _fs = require('fs');var _fs2 = _interopRequireDefault(_fs);
var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);
var _csv = require('csv');var _csv2 = _interopRequireDefault(_csv);
var _path = require('path');var _path2 = _interopRequireDefault(_path);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

_bluebird2['default'].promisifyAll(_fs2['default']); // CSV utilities.
/* eslint-disable import/prefer-default-export */_bluebird2['default'].promisifyAll(_csv2['default']);

// Just read CSV file into memory.
var readCsv = function readCsv(filepath) {return _bluebird2['default']['try'](function () {return _fs2['default'].readFileAsync(filepath, 'utf-8');});};

// Get RIR header.
var getHeader = function getHeader(data) {return (
    _lodash2['default'].first(data));};

// Get RIR totals.
var getTotals = function getTotals(data) {return (
    (0, _lodash2['default'])(data).
    take(4).
    drop(1).
    value());};

// Get RIR entries.
var getEntries = function getEntries(data) {return (
    (0, _lodash2['default'])(data).
    drop(4).
    value());};

// Convert header to usable object.
var parseHeader = function parseHeader(header) {
  if (header === undefined) {
    return undefined;
  }
  return {
    version: Number.parseInt(header[0], 10),
    registry: header[1],
    serial: Number.parseInt(header[2], 10),
    records: Number.parseInt(header[3], 10),
    startDate: Number.parseInt(header[4], 10) || 19700101,
    endDate: Number.parseInt(header[5], 10) };

};

// Convert header to usable object.
var parseTotals = function parseTotals(totals) {
  if (totals === undefined) {
    return undefined;
  }
  return {
    asn: {
      registry: totals[0][0].toLowerCase(),
      count: Number.parseInt(totals[0][totals[0].length - 2], 10) },

    ipv4: {
      registry: totals[1][0].toLowerCase(),
      count: Number.parseInt(totals[1][totals[1].length - 2], 10) },

    ipv6: {
      registry: totals[2][0].toLowerCase(),
      count: Number.parseInt(totals[2][totals[2].length - 2], 10) } };


};

// Convert all CSV entries to readable array of objects.
var parseEntries = function parseEntries(entries) {
  if (entries === undefined) {
    return undefined;
  }
  return (0, _lodash2['default'])(entries).
  filter(function (entry) {return entry[6] !== 'available';}).
  map(function (entry) {
    var count = Number.parseInt(entry[4], 10);
    var result = {
      registry: entry[0],
      country: entry[1].toLowerCase(),
      type: entry[2].toLowerCase(),
      date: Number.parseInt(entry[5], 10),
      status: entry[6].toLowerCase() };


    if (result.type === 'asn' || result.type === 'ipv4') {
      result.count = count;
    } else if (result.type === 'ipv6') {
      result.count = 128 - count;
    }

    return result;
  }).
  value();
};

// Get filename from filepath.
var parseFilename = function parseFilename(filepath) {return _path2['default'].basename(filepath).toLowerCase();};

// Combine the results to single object.
var combine = function combine(filepath, header, totals, entries) {
  var result = {
    filename: parseFilename(filepath),
    header: parseHeader(header, filepath),
    totals: parseTotals(totals, filepath),
    entries: parseEntries(entries) };


  if (result.header && result.totals && result.entries) {
    return result;
  }

  return undefined;
};

// Parse CSV with some rules.
var parseCsv = function parseCsv(filepath, content) {return _bluebird2['default']['try'](function () {return _csv2['default'].parseAsync(content, {
      comment: '#',
      delimiter: '|',
      relax_column_count: true });}).

  then(function (data) {return _bluebird2['default'].all([
    getHeader(data),
    getTotals(data),
    getEntries(data)]);}).

  spread(function (header, totals, entries) {return (
      combine(filepath, header, totals, entries));});};


// Derive stats for saving to database.
var deriveStats = function deriveStats(last, data) {return _bluebird2['default']['try'](function () {
    var countries = {};
    _lodash2['default'].each(data.entries, function (entry) {
      var isNew = entry.date <= data.header.endDate && entry.date > last;
      if (countries[entry.country] === undefined) {
        countries[entry.country] = {
          asn: {
            'new': { count: 0, sum: 0 },
            total: { count: 0, sum: 0 } },

          ipv4: {
            'new': { count: 0, sum: 0 },
            total: { count: 0, sum: 0 } },

          ipv6: {
            'new': { count: 0, sum: {} },
            total: { count: 0, sum: {} } } };


      }

      if (entry.type === 'asn' || entry.type === 'ipv4') {
        if (isNew) {
          countries[entry.country][entry.type]['new'].count += 1;
          countries[entry.country][entry.type]['new'].sum += entry.count;
        }
        countries[entry.country][entry.type].total.count += 1;
        countries[entry.country][entry.type].total.sum += entry.count;
      } else {
        if (isNew) {
          countries[entry.country].ipv6['new'].count += 1;
          if (countries[entry.country].ipv6['new'].sum[entry.count] === undefined) {
            countries[entry.country].ipv6['new'].sum[entry.count] = 0;
          }
          countries[entry.country].ipv6['new'].sum[entry.count] += 1;
        }
        countries[entry.country].ipv6.total.count += 1;
        if (countries[entry.country].ipv6.total.sum[entry.count] === undefined) {
          countries[entry.country].ipv6.total.sum[entry.count] = 0;
        }
        countries[entry.country].ipv6.total.sum[entry.count] += 1;
      }
    });
    return {
      _id: data.header.endDate,
      filename: data.filename,
      header: data.header,
      totals: data.totals,
      countries: countries };

  });};exports['default'] =

{
  readCsv: readCsv,
  parseCsv: parseCsv,
  deriveStats: deriveStats };