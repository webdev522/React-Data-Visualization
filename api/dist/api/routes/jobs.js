Object.defineProperty(exports, "__esModule", { value: true });var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _mongo = require('../../mongo');var _mongo2 = _interopRequireDefault(_mongo);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var normalizeStatus = function normalizeStatus(statuses) {
  var all = ['started', 'completed', 'failed'];
  if (statuses === undefined) return all;
  var normalized = statuses.split(',');
  var trimmed = _lodash2['default'].filter(normalized, function (status) {return _lodash2['default'].find(all, function (one) {return one === status;});});
  if (trimmed.length > 0) return trimmed;
  return all;
};

var normalizeLimit = function normalizeLimit(limit) {
  if (limit === undefined) return 100;
  var normalized = Number(limit);
  if (Number.isNaN(normalized)) normalized = 100;
  return normalized;
};

var normalizeSort = function normalizeSort(sort) {
  var all = ['oldest', 'newest'];
  if (sort === undefined) return -1;
  if (_lodash2['default'].find(all, function (one) {return one === sort;})) {
    if (sort === 'oldest') return 1;
    return -1;
  }
  return -1;
};

var normalizeFormat = function normalizeFormat(format) {
  var all = ['json', 'html'];
  if (format === undefined) return 'html';
  if (_lodash2['default'].find(all, function (one) {return one === format;})) return format;
  return 'html';
};

var jobs = function jobs(req, res) {
  var query = {
    status: normalizeStatus(req.query.status),
    limit: normalizeLimit(req.query.limit),
    sort: normalizeSort(req.query.sort),
    format: normalizeFormat(req.query.format) };


  _mongo2['default'].findJobs(query).then(function (entries) {
    if (query.format === 'html') {
      res.render('api/jobs', {
        version: process.env.npm_package_version,
        response: entries });

    } else {
      res.json({
        success: true,
        version: process.env.npm_package_version,
        query: query,
        response: entries });

    }
  });
};exports['default'] =

jobs;