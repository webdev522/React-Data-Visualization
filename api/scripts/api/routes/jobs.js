import _ from 'lodash';
import mongo from '../../mongo';

const normalizeStatus = (statuses) => {
  const all = ['started', 'completed', 'failed'];
  if (statuses === undefined) return all;
  const normalized = statuses.split(',');
  const trimmed = _.filter(normalized, status => _.find(all, one => one === status));
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

const normalizeFormat = (format) => {
  const all = ['json', 'html'];
  if (format === undefined) return 'html';
  if (_.find(all, one => one === format)) return format;
  return 'html';
};

const jobs = (req, res) => {
  const query = {
    status: normalizeStatus(req.query.status),
    limit: normalizeLimit(req.query.limit),
    sort: normalizeSort(req.query.sort),
    format: normalizeFormat(req.query.format),
  };

  mongo.findJobs(query).then((entries) => {
    if (query.format === 'html') {
      res.render('api/jobs', {
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

export default jobs;
