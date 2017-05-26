import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import math from 'mathjs';

Promise.promisifyAll(fs);

// Loads up file with ISO-3166 definitions.
const list = JSON.parse(
  fs.readFileSync(path.resolve('./data/economies.json'), 'utf-8'),
);

// Registrar from country code.
const rirFromCode = (code) => {
  const entry = _.find(list, item => item.code === code);
  if (!entry || entry.rir === '') return 'unknown';
  return entry.rir;
};

// Country from country code.
const countryFromCode = (code) => {
  const entry = _.find(list, item => item.code === code);
  if (!entry || entry.country === '') return 'unknown';
  return entry.country;
};

// Subregion from country code.
const subregionFromCode = (code) => {
  const entry = _.find(list, item => item.code === code);
  if (!entry || entry.subregion === '') return 'unknown';
  return entry.subregion;
};

// Region from country code.
const regionFromCode = (code) => {
  const entry = _.find(list, item => item.code === code);
  if (!entry || entry.region === '') return 'unknown';
  return entry.region;
};

// Get economy.
const getEconomy = (code, economy) => {
  if (economy === 'region') {
    return regionFromCode(code);
  } else if (economy === 'subregion') {
    return subregionFromCode(code);
  }
  return countryFromCode(code);
};

const mergeSum = (one, two) => {
  const result = {};

  _.each(one, (value, key) => {
    if (two[key]) {
      result[key] = value + two[key];
    } else {
      result[key] = value;
    }
  });

  _.each(two, (value, key) => {
    if (one[key] === undefined) {
      result[key] = value;
    }
  });

  return result;
};

const sumSquares = (entries) => {
  const bigtwo = math.bignumber(2);
  let sum = math.bignumber(0);
  _.each(entries, (value, key) => {
    const exponent = math.bignumber(Number.parseInt(key, 10));
    let item = math.bignumber(0);
    for (let i = 0; i < value; i += 1) {
      item = math.add(
        item,
        math.pow(bigtwo, exponent),
      );
    }
    sum = math.add(sum, item);
  });
  return sum.toString();
};

// Group by economy.
const groupByEconomy = (entries, economy, field) => {
  const types = ['asn', 'ipv4', 'ipv6'];
  const group = {
    asn: [],
    ipv4: [],
    ipv6: [],
  };

  _.each(types, (type) => {
    _.each(entries[type], (entry) => {
      const code = getEconomy(entry.code, economy);
      const index = _.findIndex(group[type], stat => stat.code === code);
      if (index === -1) {
        const tmp = { code };
        tmp[field] = {
          count: entry[field].count,
          sum: entry[field].sum,
        };
        group[type].push(tmp);
      } else if (type === 'asn' || type === 'ipv4') {
        group[type][index][field].count += entry[field].count;
        group[type][index][field].sum += entry[field].sum;
      } else {
        group[type][index][field].count += entry[field].count;
        group[type][index][field].sum = mergeSum(
          group[type][index][field].sum,
          entry[field].sum,
        );
      }
    });
  });

  /* eslint-disable no-param-reassign */
  _.each(group.ipv6, (entry) => {
    if (entry.new && entry.new.sum) {
      entry.new.sum = sumSquares(entry.new.sum);
    }
    if (entry.total && entry.total.sum) {
      entry.total.sum = sumSquares(entry.total.sum);
    }
  });
  /* eslint-enable no-param-reassign */

  return group;
};

export default {
  list,
  getEconomy,
  rirFromCode,
  countryFromCode,
  subregionFromCode,
  regionFromCode,
  groupByEconomy,
};

