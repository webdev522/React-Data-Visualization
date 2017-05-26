import _ from 'lodash';
import mongo from '../../mongo';

const normalizeLabels = (labels) => {
  const all = ['api', 'connector'];
  if (labels === undefined) return all;
  const normalized = labels.split(',');
  const trimmed = _.filter(normalized, label => _.find(all, one => one === label));
  if (trimmed.length > 0) return trimmed;
  return all;
};

const normalizeLimit = (limit) => {
  if (limit === undefined) return 100;
  let normalized = Number(limit);
  if (Number.isNaN(normalized)) normalized = 100;
  return normalized;
};

const normalizeSort = (sort) => {
  const all = ['oldest', 'newest'];
  if (sort === undefined) return -1;
  if (_.find(all, one => one === sort)) {
    if (sort === 'oldest') return 1;
    return -1;
  }
  return -1;
};

const normalizeLevels = (levels) => {
  const all = ['fatal', 'error', 'warn', 'info', 'debug', 'verbose'];
  if (levels === undefined) return all;
  const normalized = levels.split(',');
  const trimmed = _.filter(normalized, level => _.find(all, one => one === level));
  if (trimmed.length > 0) return trimmed;
  return all;
};

const normalizeFormat = (format) => {
  const all = ['json', 'html'];
  if (format === undefined) return 'html';
  if (_.find(all, one => one === format)) return format;
  return 'html';
};

const logs = (req, res) => {
  const query = {
    labels: normalizeLabels(req.query.labels),
    limit: normalizeLimit(req.query.limit),
    sort: normalizeSort(req.query.sort),
    format: normalizeFormat(req.query.format),
    levels: normalizeLevels(req.query.levels),
  };

  mongo.findLogs(query).then((entries) => {
    if (query.format === 'html') {
      res.render('api/logs', {
        version: process.env.npm_package_version,
        response: entries,
      });
    } else {
      res.json({
        success: true,
        version: process.env.npm_package_version,
        query,
        response: entries,
      });
    }
  });
};

export default logs;
