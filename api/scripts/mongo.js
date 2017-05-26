// MongoDB client utilities and queries.

import mongodb from 'mongodb';
import Promise from 'bluebird';
import moment from 'moment';
import _ from 'lodash';
// import math from 'mathjs';
import economies from './utils/economies';

const client = mongodb.MongoClient;

Promise.promisifyAll(client);

let db;
let stats;

// Connect to MongoDB instance.
const connect = () => Promise.try(() => {
  if (db) {
    return db;
  }
  let url;
  if (cfg.MONGO_USER && cfg.MONGO_PASS) {
    url = `mongodb://${cfg.MONGO_USER}:${cfg.MONGO_PASS}@${cfg.MONGO_HOST}:${cfg.MONGO_PORT}/${cfg.MONGO_NAME}?authSource=admin`;
  } else {
    url = `mongodb://${cfg.MONGO_HOST}:${cfg.MONGO_PORT}/${cfg.MONGO_NAME}`;
  }
  const options = { promiseLibrary: Promise };
  return client.connect(url, options)
    .then((connection) => {
      log.info('Successfully connected to MongoDB.');
      db = connection;
      return db;
    });
});

// Disconnect from MongoDB instance.
const disconnect = () => Promise.try(() => {
  if (db) {
    return db.close().then(() => {
      db = undefined;
      log.info('Disconnected from MongoDB.');
    });
  }
});

// Get day before.
// const dayBefore = date =>
  // Number(moment(String(date), 'YYYYMMDD').subtract(1, 'days').format('YYYYMMDD'));

// Get day after.
const dayAfter = date =>
  Number(moment(String(date), 'YYYYMMDD').add(1, 'days').format('YYYYMMDD'));

// Add days.
const addDays = (date, count) =>
  Number(moment(String(date), 'YYYYMMDD').add(count, 'days').format('YYYYMMDD'));

// Day diff.
const dayDiff = (start, end) => {
  const s = moment(String(start), 'YYYYMMDD');
  const e = moment(String(end), 'YYYYMMDD');
  return s.diff(e, 'days');
};

// Fetch logs from all the modules.
const findLogs = options => Promise.try(() => connect())
  .then(() => db.collection('logs')
    .find({
      label: { $in: options.labels },
      level: { $in: options.levels },
    })
    .sort({ $natural: options.sort })
    .limit(options.limit)
    .toArray(),
  );

// Fetch jobs.
const findJobs = options => Promise.try(() => connect())
  .then(() => db.collection('jobs')
    .find({ status: { $in: options.status } })
    .sort({ $natural: options.sort })
    .limit(options.limit)
    .toArray(),
  );

// Selectively eep copy item data.
const copyItem = (value, key) => {
  const result = {};
  result[key] = {};
  if (value.asnNewCount) result[key].asnNewCount = value.asnNewCount;
  if (value.asnNewSum) result[key].asnNewSum = value.asnNewSum;
  if (value.asnTotalCount) result[key].asnTotalCount = value.asnTotalCount;
  if (value.asnTotalSum) result[key].asnTotalSum = value.asnTotalSum;
  if (value.ipv4NewCount) result[key].ipv4NewCount = value.ipv4NewCount;
  if (value.ipv4NewSum) result[key].ipv4NewSum = value.ipv4NewSum;
  if (value.ipv4TotalCount) result[key].ipv4TotalCount = value.ipv4TotalCount;
  if (value.ipv4TotalSum) result[key].ipv4TotalSum = value.ipv4TotalSum;
  if (value.ipv6NewCount) result[key].ipv6NewCount = value.ipv6NewCount;
  if (value.ipv6NewSum) result[key].ipv6NewSum = value.ipv6NewSum;
  if (value.ipv6TotalCount) result[key].ipv6TotalCount = value.ipv6TotalCount;
  if (value.ipv6TotalSum) result[key].ipv6TotalSum = value.ipv6TotalSum;
  return result;
};

// Massage statistics to more convenient format.
// NOTE: Figure out a more elegant way to do this.
const massageStats = (data, updated) => {
  if (data.length > 0) {
    stats = {
      updated,
      dates: [],
    };

    let counter = 0;
    let date;

    do {
      // Fill date.
      date = data[counter];
      const day = {};
      _.each(date.countries, (value, key) => {
        day[key] = {};

        const asnNewCount = _.get(value, 'asn.new.count', undefined);
        if (asnNewCount) day[key].asnNewCount = asnNewCount;
        const asnNewSum = _.get(value, 'asn.new.sum', undefined);
        if (asnNewSum) day[key].asnNewSum = asnNewSum;
        const asnTotalCount = _.get(value, 'asn.total.count', undefined);
        if (asnTotalCount) day[key].asnTotalCount = asnTotalCount;
        const asnTotalSum = _.get(value, 'asn.total.sum', undefined);
        if (asnTotalSum) day[key].asnTotalSum = asnTotalSum;

        const ipv4NewCount = _.get(value, 'ipv4.new.count', undefined);
        if (ipv4NewCount) day[key].ipv4NewCount = ipv4NewCount;
        const ipv4NewSum = _.get(value, 'ipv4.new.sum', undefined);
        if (ipv4NewSum) day[key].ipv4NewSum = ipv4NewSum;
        const ipv4TotalCount = _.get(value, 'ipv4.total.count', undefined);
        if (ipv4TotalCount) day[key].ipv4TotalCount = ipv4TotalCount;
        const ipv4TotalSum = _.get(value, 'ipv4.total.sum', undefined);
        if (ipv4TotalSum) day[key].ipv4TotalSum = ipv4TotalSum;

        const ipv6NewCount = _.get(value, 'ipv6.new.count', undefined);
        if (ipv6NewCount) day[key].ipv6NewCount = ipv6NewCount;
        if (value.ipv6 && value.ipv6.new && value.ipv6.new.sum && !_.isEmpty(value.ipv6.new.sum)) {
          day[key].ipv6NewSum = value.ipv6.new.sum;
        }
        const ipv6TotalCount = _.get(value, 'ipv6.total.count', undefined);
        if (ipv6TotalCount) day[key].ipv6TotalCount = ipv6TotalCount;
        if (value.ipv6 && value.ipv6.total &&
            value.ipv6.total.sum && !_.isEmpty(value.ipv6.total.sum)) {
          day[key].ipv6TotalSum = value.ipv6.total.sum;
        }
      });
      stats.dates.push(day);

      // Fill empty dates.
      let after = dayAfter(data[counter].header.endDate);
      let copy;
      while (
        counter + 1 < data.length &&
        data[counter + 1].header.endDate > after
      ) {
        copy = _.each(day, copyItem);
        stats.dates.push(copy);
        after = dayAfter(after);
      }
      counter += 1;
    } while (counter < data.length);

    stats.start = data[0].header.endDate;
    stats.end = addDays(data[0].header.endDate, stats.dates.length - 1);
  }
};

// Check stats.
const refreshStats = () => Promise.try(() => connect())
  .then(() => db.collection('jobs')
    .find({ status: 'completed' })
    .sort({ $natural: 1 })
    .toArray(),
  )
  .then((jobs) => {
    if (stats === undefined || jobs.length < 1 || jobs[jobs.length - 1].endedAt > stats.updated) {
      return Promise.try(() => db.collection('stats').find().sort({ _id: 1 }).toArray())
        .then(data => massageStats(data, jobs[jobs.length - 1].endedAt))
        .then(() => stats);
    }
    return stats;
  });

// Fetch full stats.
const fetchFullStats = () => Promise.try(() => refreshStats());

// Fetch single new delegations.
const findSingleNewDelegations = options => Promise.try(() => refreshStats())
  .then(() => {
    const delegations = {
      asn: [],
      ipv4: [],
      ipv6: [],
    };
    const offset = dayDiff(options.date, stats.start);
    const day = stats.dates[offset];
    _.each(day, (value, key) => {
      if (_.find(options.types, type => type === 'asn')) {
        if (value.asnNewCount) {
          delegations.asn.push({
            code: key,
            new: {
              count: value.asnNewCount,
              sum: value.asnNewSum,
            },
          });
        }
      }
      if (_.find(options.types, type => type === 'ipv4')) {
        if (value.ipv4NewCount) {
          delegations.ipv4.push({
            code: key,
            new: {
              count: value.ipv4NewCount,
              sum: value.ipv4NewSum,
            },
          });
        }
      }
      if (_.find(options.types, type => type === 'ipv6')) {
        if (value.ipv6NewCount) {
          delegations.ipv6.push({
            code: key,
            new: {
              count: value.ipv6NewCount,
              sum: value.ipv6NewSum,
            },
          });
        }
      }
    });
    return economies.groupByEconomy(delegations, options.economy, 'new');
  });

// Fetch single total delegations.
const findSingleTotalDelegations = options => Promise.try(() => refreshStats())
  .then(() => {
    const delegations = {
      asn: [],
      ipv4: [],
      ipv6: [],
    };
    const offset = dayDiff(options.date, stats.start);
    const day = stats.dates[offset];
    _.each(day, (value, key) => {
      if (_.find(options.types, type => type === 'asn')) {
        if (value.asnTotalCount) {
          delegations.asn.push({
            code: key,
            total: {
              count: value.asnTotalCount,
              sum: value.asnTotalSum,
            },
          });
        }
      }
      if (_.find(options.types, type => type === 'ipv4')) {
        if (value.ipv4TotalCount) {
          delegations.ipv4.push({
            code: key,
            total: {
              count: value.ipv4TotalCount,
              sum: value.ipv4TotalSum,
            },
          });
        }
      }
      if (_.find(options.types, type => type === 'ipv6')) {
        if (value.ipv6TotalCount) {
          delegations.ipv6.push({
            code: key,
            total: {
              count: value.ipv6TotalCount,
              sum: value.ipv6TotalSum,
            },
          });
        }
      }
    });
    return economies.groupByEconomy(delegations, options.economy, 'total');
  });

// Fetch new delegations in date range.
const findRangeNewDelegations = options => Promise.try(() => refreshStats())
  .then(() => {
    const delegations = {
      asn: [],
      ipv4: [],
      ipv6: [],
    };
    const start = dayDiff(options.start, stats.start);
    const end = dayDiff(options.end, stats.start);
    for (let i = start; i < end; i += 1) {
      const day = stats.dates[i];
      _.each(day, (value, key) => {
        if (_.find(options.types, type => type === 'asn')) {
          if (value.asnNewCount) {
            delegations.asn.push({
              code: key,
              new: {
                count: value.asnNewCount,
                sum: value.asnNewSum,
              },
            });
          }
        }
        if (_.find(options.types, type => type === 'ipv4')) {
          if (value.ipv4NewCount) {
            delegations.ipv4.push({
              code: key,
              new: {
                count: value.ipv4NewCount,
                sum: value.ipv4NewSum,
              },
            });
          }
        }
        if (_.find(options.types, type => type === 'ipv6')) {
          if (value.ipv6NewCount) {
            delegations.ipv6.push({
              code: key,
              new: {
                count: value.ipv6NewCount,
                sum: value.ipv6NewSum,
              },
            });
          }
        }
      });
    }

    return economies.groupByEconomy(delegations, options.economy, 'new');
  });

// Fetch new delegations in date range.
// const findRangeNewDelegations = options => Promise.try(() => connect())
  // .then(() => {
    // const isAsn = _.find(options.types, type => type === 'asn');
    // const isIpv4 = _.find(options.types, type => type === 'ipv4');
    // const isIpv6 = _.find(options.types, type => type === 'ipv6');
    // return Promise.try(() => {
      // const match = {
        // _id: {
          // $gte: dayBefore(options.start),
          // $lte: dayBefore(options.end),
        // },
      // };
      // const projection = {
        // _id: 0,
        // filename: 0,
        // header: 0,
        // totals: 0,
      // };
      // if (!isAsn) projection.asn = 0;
      // if (!isIpv4) projection.ipv4 = 0;
      // if (!isIpv6) projection.ipv6 = 0;
      // return db.collection('stats')
        // .find(match, projection)
        // .toArray();
    // })
      // .then((results) => {
        // const filtered = {
          // asn: [],
          // ipv4: [],
          // ipv6: [],
        // };
        // _.each(results, (result) => {
          // _.each(options.types, (type) => {
            // _.each(result[type], (item) => {
              // const index = _.findIndex(filtered[type], stat => stat.code === item.code);
              // if (item.new.count > 0) {
                // if (index === -1) {
                  // filtered[type].push({
                    // code: item.code,
                    // new: {
                      // count: item.new.count,
                      // sum: item.new.sum,
                    // },
                  // });
                // } else if (type === 'asn') {
                  // filtered.asn[index].new.count += item.new.count;
                  // filtered.asn[index].new.sum += item.new.sum;
                // } else {
                  // filtered[type][index].new.count += item.new.count;
                  // filtered[type][index].new.sum = math.add(
                    // math.bignumber(filtered[type][index].new.sum),
                    // math.bignumber(item.new.sum),
                  // );
                // }
              // }
            // });
          // });
        // });
        // return economies.groupByEconomy(filtered, options.economy, 'new');
      // });
  // });

export default {
  connect,
  disconnect,
  findLogs,
  findJobs,
  findSingleNewDelegations,
  findSingleTotalDelegations,
  findRangeNewDelegations,
  fetchFullStats,
};

// Fetch new delegations in date range.
// const findRangeDelegations = options => Promise.try(() => connect())
//   .then(() => {
//     const after = dayBefore(options.start);
//     const before = dayBefore(options.end);
//     const isAsn = _.find(options.types, type => type === 'asn');
//     const isIpv4 = _.find(options.types, type => type === 'ipv4');
//     const isIpv6 = _.find(options.types, type => type === 'ipv6');
//     const pipeline = [];

//     console.log(after, before);
//     pipeline.push({ $match: { _id: { $gte: after, $lte: before } } });
//     if (isAsn) pipeline.push({ $unwind: '$asn' });
//     if (isIpv4) pipeline.push({ $unwind: '$ipv4' });
//     if (isIpv6) pipeline.push({ $unwind: '$ipv6' });
//     pipeline.push({

//     return db.collection('stats')
//       .aggregate(pipeline)
//       .toArray();
//   })
//   .then(result => console.log(result));

// Fetch sum of new delegations in date range.
// NOTE: temporarily retired
// const findRangeDelegations = options => Promise.try(() => connect())
//   .then(() => {
//     const ranges = {};
//     return Promise.try(() => db.collection('stats').aggregate([
//       { $match: { _id: { $gte: dayBefore(options.start), $lte: dayBefore(options.end) } } },
//       { $unwind: '$asn' },
//       { $group: { _id: '$asn.code', sum: { $sum: '$asn.new' } } },
//     ]).toArray())
//       .then((result) => { ranges.asn = result; })
//       .then(() => db.collection('stats').aggregate([
//         { $match: { _id: { $gte: dayBefore(options.start), $lte: dayBefore(options.end) } } },
//         { $unwind: '$ipv4' },
//         { $group: { _id: '$ipv4.code', sum: { $sum: '$ipv4.new' } } },
//       ]).toArray())
//       .then((result) => { ranges.ipv4 = result; })
//       .then(() => db.collection('stats').aggregate([
//         { $match: { _id: { $gte: dayBefore(options.start), $lte: dayBefore(options.end) } } },
//         { $unwind: '$ipv6' },
//         { $group: { _id: '$ipv6.code', sum: { $sum: '$ipv4.new' } } },
//       ]).toArray())
//       .then((result) => { ranges.ipv6 = result; })
//       .then(() => ranges);
//   });

