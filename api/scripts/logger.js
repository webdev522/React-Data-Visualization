// Logging utilites.

/* eslint-disable no-unused-vars */

import winston from 'winston';
import 'winston-mongodb';
import expressWinston from 'express-winston';
import moment from 'moment-timezone';
import _ from 'lodash';

const start = () => {
  // Set log level per environment.
  let level;
  switch (process.env.NODE_ENV) {
    case 'test':
      level = 'error';
      break;
    case 'production':
      level = 'info';
      break;
    case 'development':
      level = 'debug';
      break;
    case 'staging':
      level = 'verbose';
      break;
    default:
      level = 'verbose';
  }

  // Winston console transport options.
  const consoleOptions = {
    json: false,
    exceptionsLevel: 'fatal',
    level,
    colorize: true,
    humanReadableUnhandledException: true,
    timestamp: () => moment.utc().format('YYYY-MM-DD HH:mm:ss'),
  };

  // Winston MongoDB transport options.
  const mongoOptions = {
    json: true,
    exceptionsLevel: 'fatal',
    level,
    colorize: false,
    timestamp: () => moment.utc().format('YYYY-MM-DD HH:mm:ss'),
    collection: cfg.LOG_COLLECTION,
    label: cfg.LOG_LABEL,
    capped: true,
    tryReconnect: true,
    decolorize: true,
  };

  if (cfg.MONGO_USER && cfg.MONGO_PASS) {
    mongoOptions.db = `mongodb://${cfg.MONGO_USER}:${cfg.MONGO_PASS}@${cfg.MONGO_HOST}:${cfg.MONGO_PORT}/${cfg.MONGO_NAME}?authSource=admin`;
  } else {
    mongoOptions.db = `mongodb://${cfg.MONGO_HOST}:${cfg.MONGO_PORT}/${cfg.MONGO_NAME}`;
  }

  // Create new console transport.
  const consoleTransport = new winston.transports.Console(consoleOptions);

  // Create new console transport.
  const mongoTransport = new winston.transports.MongoDB(mongoOptions);

  const log = new winston.Logger({
    transports: [
      consoleTransport,
      mongoTransport,
    ],
    exitOnError: true,
  });

  // Logs multi-line string as multiple log entries.
  log.multiline = (data, lvl) => {
    const lines = data.toString().split('\n');
    _.each(lines, (line) => {
      if (line.replace(/\s/g, '').length > 0) log[lvl](line);
    });
  };

  // Express middleware.
  log.express = expressWinston.logger({
    transports: [
      consoleTransport,
      mongoTransport,
    ],
    colorize: false,
    meta: false,
    expressFormat: false,
    winstonInstance: log,
    msg: '{{req.method}} {{res.statusCode}} {{req.url}} {{res.responseTime}}ms',
    statusLevels: {
      '200>399': 'info',
      '400>499': 'warn',
      '500>': 'error',
    },
  });

  return log;
};

export default {
  start,
};
