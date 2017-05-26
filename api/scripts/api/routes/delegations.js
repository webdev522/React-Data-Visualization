import _ from 'lodash';
// import math from 'mathjs';
import mongo from '../../mongo';

const normalizeDate = (date) => {
  if (date === undefined || Number.isNaN(date)) return cfg.CSV_FIRST_DATE;
  return Number(date);
};

const normalizeEconomy = (economy) => {
  const all = ['country', 'region', 'subregion'];
  if (economy === undefined) return 'country';
  if (_.find(all, one => one === economy)) return economy;
  return 'country';
};

const normalizeFormat = (format) => {
  const all = ['json', 'html'];
  if (format === undefined) return 'html';
  if (_.find(all, one => one === format)) return format;
  return 'html';
};

const normalizeTypes = (types) => {
  const all = ['asn', 'ipv4', 'ipv6'];
  if (types === undefined) return all;
  const normalized = types.split(',');
  const trimmed = _.filter(normalized, type => _.find(all, one => one === type));
  if (trimmed.length > 0) return trimmed;
  return all;
};

const newSingle = (req, res) => {
  const query = {
    date: normalizeDate(req.query.date),
    types: normalizeTypes(req.query.types),
    format: normalizeFormat(req.query.format),
    economy: normalizeEconomy(req.query.economy),
  };

  mongo.findSingleNewDelegations(query).then((delegations) => {
    if (query.format === 'html') {
      res.render('api/delegations/new/single', {
        version: process.env.npm_package_version,
        delegations,
      });
    } else {
      res.json({
        success: true,
        version: process.env.npm_package_version,
        query,
        delegations,
      });
    }
  });
};

const newRange = (req, res) => {
  const query = {
    start: normalizeDate(req.query.start),
    end: normalizeDate(req.query.end),
    types: normalizeTypes(req.query.types),
    format: normalizeFormat(req.query.format),
    economy: normalizeEconomy(req.query.economy),
  };

  mongo.findRangeNewDelegations(query).then((delegations) => {
    if (query.format === 'html') {
      res.render('api/delegations/new/range', {
        version: process.env.npm_package_version,
        delegations,
      });
    } else {
      res.json({
        success: true,
        version: process.env.npm_package_version,
        query,
        delegations,
      });
    }
  });
};

const totalSingle = (req, res) => {
  const query = {
    date: normalizeDate(req.query.date),
    types: normalizeTypes(req.query.types),
    format: normalizeFormat(req.query.format),
    economy: normalizeEconomy(req.query.economy),
  };

  mongo.findSingleTotalDelegations(query).then((delegations) => {
    if (query.format === 'html') {
      res.render('api/delegations/total/single', {
        version: process.env.npm_package_version,
        delegations,
      });
    } else {
      res.json({
        success: true,
        version: process.env.npm_package_version,
        query,
        delegations,
      });
    }
  });
};

export default {
  new: {
    single: newSingle,
    range: newRange,
  },
  total: {
    single: totalSingle,
  },
};
