// Utility for custom configuration and environment variable handling.

import _ from 'lodash';
import moment from 'moment-timezone';

moment.tz.setDefault('UTC');

const create = () => {
  const defaults = {
    LOG_COLLECTION: 'logs',
    LOG_LABEL: 'api',
    API_PORT: 3000,
    MONGO_NAME: 'apnic',
    MONGO_HOST: 'localhost',
    MONGO_PORT: 27017,
    MONGO_USER: undefined,
    MONGO_PASS: undefined,
    CSV_FIRST_DATE: 20080214,
  };

  // Throw if invalid environment.
  if (process.env.NODE_ENV !== 'development' &&
      process.env.NODE_ENV !== 'test' &&
      process.env.NODE_ENV !== 'staging' &&
      process.env.NODE_ENV !== 'production') {
    throw new Error('Wrong or unspecified NODE_ENV!');
  }

  // Apply overrides and do exports of environment variables.
  _.each(defaults, (value, key) => {
    if (process.env[key] !== undefined) {
      defaults[key] = process.env[key];
    } else {
      process.env[key] = String(value);
    }
  });

  return defaults;
};

export default {
  create,
};
