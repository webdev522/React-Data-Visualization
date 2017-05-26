Object.defineProperty(exports, "__esModule", { value: true });var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);

var _mongo = require('../../mongo');var _mongo2 = _interopRequireDefault(_mongo);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var normalizeDate = function normalizeDate(date) {
  if (date === undefined || Number.isNaN(date)) return cfg.CSV_FIRST_DATE;
  return Number(date);
}; // import math from 'mathjs';

var normalizeEconomy = function normalizeEconomy(economy) {
  var all = ['country', 'region', 'subregion'];
  if (economy === undefined) return 'country';
  if (_lodash2['default'].find(all, function (one) {return one === economy;})) return economy;
  return 'country';
};

var normalizeFormat = function normalizeFormat(format) {
  var all = ['json', 'html'];
  if (format === undefined) return 'html';
  if (_lodash2['default'].find(all, function (one) {return one === format;})) return format;
  return 'html';
};

var normalizeTypes = function normalizeTypes(types) {
  var all = ['asn', 'ipv4', 'ipv6'];
  if (types === undefined) return all;
  var normalized = types.split(',');
  var trimmed = _lodash2['default'].filter(normalized, function (type) {return _lodash2['default'].find(all, function (one) {return one === type;});});
  if (trimmed.length > 0) return trimmed;
  return all;
};

var newSingle = function newSingle(req, res) {
  var query = {
    date: normalizeDate(req.query.date),
    types: normalizeTypes(req.query.types),
    format: normalizeFormat(req.query.format),
    economy: normalizeEconomy(req.query.economy) };


  _mongo2['default'].findSingleNewDelegations(query).then(function (delegations) {
    if (query.format === 'html') {
      res.render('api/delegations/new/single', {
        version: process.env.npm_package_version,
        delegations: delegations });

    } else {
      res.json({
        success: true,
        version: process.env.npm_package_version,
        query: query,
        delegations: delegations });

    }
  });
};

var newRange = function newRange(req, res) {
  var query = {
    start: normalizeDate(req.query.start),
    end: normalizeDate(req.query.end),
    types: normalizeTypes(req.query.types),
    format: normalizeFormat(req.query.format),
    economy: normalizeEconomy(req.query.economy) };


  _mongo2['default'].findRangeNewDelegations(query).then(function (delegations) {
    if (query.format === 'html') {
      res.render('api/delegations/new/range', {
        version: process.env.npm_package_version,
        delegations: delegations });

    } else {
      res.json({
        success: true,
        version: process.env.npm_package_version,
        query: query,
        delegations: delegations });

    }
  });
};

var totalSingle = function totalSingle(req, res) {
  var query = {
    date: normalizeDate(req.query.date),
    types: normalizeTypes(req.query.types),
    format: normalizeFormat(req.query.format),
    economy: normalizeEconomy(req.query.economy) };


  _mongo2['default'].findSingleTotalDelegations(query).then(function (delegations) {
    if (query.format === 'html') {
      res.render('api/delegations/total/single', {
        version: process.env.npm_package_version,
        delegations: delegations });

    } else {
      res.json({
        success: true,
        version: process.env.npm_package_version,
        query: query,
        delegations: delegations });

    }
  });
};exports['default'] =

{
  'new': {
    single: newSingle,
    range: newRange },

  total: {
    single: totalSingle } };