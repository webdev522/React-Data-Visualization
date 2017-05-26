// IGNORE!
// Just a module to play with temporary stuff.
// ^_^

/* eslint-disable */

import Promise from 'bluebird';
import _ from 'lodash';
import economies from './utils/economies';
import math from 'mathjs';
import moment from 'moment';
import mongodb from 'mongodb';
import appRoot from 'app-root-path';
import config from './config';

// Export few things to global namespace for convenience.
global.cfg = config.init();
global.base = appRoot.path;

const client = mongodb.MongoClient;

Promise.promisifyAll(client);

let db;

// Connect to MongoDB instance.
const connect = () => Promise.try(() => {
  if (db) {
    return db;
  }
  const url = `mongodb://${cfg.MONGO_HOST}:${cfg.MONGO_PORT}/${cfg.MONGO_NAME}`;
  const options = { promiseLibrary: Promise };
  return client.connect(url, options)
    .then((connection) => {
      db = connection;
      return db;
    });
});

// Disconnect from MongoDB instance.
const disconnect = () => Promise.try(() => {
  if (db) {
    return db.close().then(() => {
      db = undefined;
    });
  }
});

const fetchStats = () => Promise.try(() => connect())
  .then(() => db.collection('stats').find().sort({ _id: 1}).toArray());

fetchStats()
  .then((stats) => {
    let counter = 0;
    _.each(stats, (stat) => {
      if (stat.header.endDate < 20120101 && stat.header.endDate > 20101231) {
        _.each(stat.countries, (country) => {
          if (country.asn && country.asn.new && country.asn.new.sum) {
            counter += country.asn.new.sum;
          }
        });
      }
    });
    console.log(counter);
  })
  .then(() => process.exit(0));
