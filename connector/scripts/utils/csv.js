// CSV utilities.

/* eslint-disable import/prefer-default-export */

import _ from 'lodash';
import fs from 'fs';
import Promise from 'bluebird';
import csv from 'csv';
import path from 'path';

Promise.promisifyAll(fs);
Promise.promisifyAll(csv);

// Just read CSV file into memory.
const readCsv = filepath => Promise.try(() => fs.readFileAsync(filepath, 'utf-8'));

// Get RIR header.
const getHeader = data =>
  _.first(data);

// Get RIR totals.
const getTotals = data =>
  _(data)
    .take(4)
    .drop(1)
    .value();

// Get RIR entries.
const getEntries = data =>
  _(data)
    .drop(4)
    .value();

// Convert header to usable object.
const parseHeader = (header) => {
  if (header === undefined) {
    return undefined;
  }
  return {
    version: Number.parseInt(header[0], 10),
    registry: header[1],
    serial: Number.parseInt(header[2], 10),
    records: Number.parseInt(header[3], 10),
    startDate: Number.parseInt(header[4], 10) || 19700101,
    endDate: Number.parseInt(header[5], 10),
  };
};

// Convert header to usable object.
const parseTotals = (totals) => {
  if (totals === undefined) {
    return undefined;
  }
  return {
    asn: {
      registry: totals[0][0].toLowerCase(),
      count: Number.parseInt(totals[0][totals[0].length - 2], 10),
    },
    ipv4: {
      registry: totals[1][0].toLowerCase(),
      count: Number.parseInt(totals[1][totals[1].length - 2], 10),
    },
    ipv6: {
      registry: totals[2][0].toLowerCase(),
      count: Number.parseInt(totals[2][totals[2].length - 2], 10),
    },
  };
};

// Convert all CSV entries to readable array of objects.
const parseEntries = (entries) => {
  if (entries === undefined) {
    return undefined;
  }
  return _(entries)
    .filter(entry => entry[6] !== 'available')
    .map((entry) => {
      const count = Number.parseInt(entry[4], 10);
      const result = {
        registry: entry[0],
        country: entry[1].toLowerCase(),
        type: entry[2].toLowerCase(),
        date: Number.parseInt(entry[5], 10),
        status: entry[6].toLowerCase(),
      };

      if (result.type === 'asn' || result.type === 'ipv4') {
        result.count = count;
      } else if (result.type === 'ipv6') {
        result.count = 128 - count;
      }

      return result;
    })
    .value();
};

// Get filename from filepath.
const parseFilename = filepath => path.basename(filepath).toLowerCase();

// Combine the results to single object.
const combine = (filepath, header, totals, entries) => {
  const result = {
    filename: parseFilename(filepath),
    header: parseHeader(header, filepath),
    totals: parseTotals(totals, filepath),
    entries: parseEntries(entries),
  };

  if (result.header && result.totals && result.entries) {
    return result;
  }

  return undefined;
};

// Parse CSV with some rules.
const parseCsv = (filepath, content) => Promise.try(() => csv.parseAsync(content, {
  comment: '#',
  delimiter: '|',
  relax_column_count: true,
}))
  .then(data => Promise.all([
    getHeader(data),
    getTotals(data),
    getEntries(data),
  ]))
  .spread((header, totals, entries) =>
    combine(filepath, header, totals, entries),
  );

// Derive stats for saving to database.
const deriveStats = (last, data) => Promise.try(() => {
  const countries = {};
  _.each(data.entries, (entry) => {
    const isNew = entry.date <= data.header.endDate && entry.date > last;
    if (countries[entry.country] === undefined) {
      countries[entry.country] = {
        asn: {
          new: { count: 0, sum: 0 },
          total: { count: 0, sum: 0 },
        },
        ipv4: {
          new: { count: 0, sum: 0 },
          total: { count: 0, sum: 0 },
        },
        ipv6: {
          new: { count: 0, sum: {} },
          total: { count: 0, sum: {} },
        },
      };
    }

    if (entry.type === 'asn' || entry.type === 'ipv4') {
      if (isNew) {
        countries[entry.country][entry.type].new.count += 1;
        countries[entry.country][entry.type].new.sum += entry.count;
      }
      countries[entry.country][entry.type].total.count += 1;
      countries[entry.country][entry.type].total.sum += entry.count;
    } else {
      if (isNew) {
        countries[entry.country].ipv6.new.count += 1;
        if (countries[entry.country].ipv6.new.sum[entry.count] === undefined) {
          countries[entry.country].ipv6.new.sum[entry.count] = 0;
        }
        countries[entry.country].ipv6.new.sum[entry.count] += 1;
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
    countries,
  };
});

export default {
  readCsv,
  parseCsv,
  deriveStats,
};

