// Utility for custom configuration and environment variable handling.

import _ from 'lodash';
import moment from 'moment-timezone';

moment.tz.setDefault('UTC');

const create = () => {
  const defaults = {
    LOG_COLLECTION: 'logs',
    LOG_LABEL: 'connector',
    MONGO_HOST: 'localhost',
    MONGO_PORT: 27017,
    MONGO_NAME: 'apnic',
    MONGO_USER: undefined,
    MONGO_PASS: undefined,
    FTP_HOST: 'http://ftp.apnic.net',
    FTP_LOCAL: './.data/ftp',
    FTP_REMOTE: '/stats/apnic/',
    FTP_TIMEZONE: 'Australia/Brisbane',
    FTP_SYNC_CONCURRENCY: 20,
    FTP_GUNZIP_CONCURRENCY: 10,
    CSV_LOCATION: './.data/csv/',
    CSV_FIRST_DATE: 20080214,
    CSV_PARSING_CONCURRENCY: 10,
  };

  const internals = {
    CLEAN_START: false,
    FTP_SKIP_SYNC: false,
    FTP_SKIP_DECOMPRESSION: false,
  };

  // Merge internals with defaults.
  const config = _.merge(defaults, internals);

  // Throw if invalid environment.
  if (process.env.NODE_ENV !== 'test' &&
      process.env.NODE_ENV !== 'development' &&
      process.env.NODE_ENV !== 'staging' &&
      process.env.NODE_ENV !== 'production') {
    throw new Error('Wrong or unspecified NODE_ENV!');
  }

  // Apply overrides and do exports of environment variables.
  _.each(config, (value, key) => {
    if (process.env[key] !== undefined && !_.find(internals, item => item === process.env[key])) {
      config[key] = process.env[key];
    } else {
      process.env[key] = String(value);
    }
  });

  return config;
};

export default {
  create,
};
