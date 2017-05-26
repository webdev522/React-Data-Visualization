// Application entry point.

import Promise from 'bluebird';
import _ from 'lodash';
import appRoot from 'app-root-path';
import config from './config';
import logger from './logger';
import server from './server';

// Export few things to global namespace for convenience.
global.cfg = config.create();
global.log = logger.start();
global.base = appRoot.path;

// Catch all uncaught errors and exceptions and log them.
process.on('unhandledRejection', (error, promise) => {
  log.error('unhandled rejection', { error, promise });
});
process.on('uncaughtException', (error) => {
  log.error('uncaught exception', error);
});

// Log configuration variables.
_.each(cfg, (value, key) => {
  if (key !== 'internal') {
    log.info(`Variable ${key} set to ${value}.`);
  }
});

// Schedule a job.
Promise.try(() => server.start(cfg.API_PORT))
  .catch(err => log.error(err));

