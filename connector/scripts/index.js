// Application entry point.

import Promise from 'bluebird';
import path from 'path';
import _ from 'lodash';
import appRoot from 'app-root-path';
import config from './config';
import logger from './logger';
import job from './utils/job';
import fsx from './utils/fsx';
import mongo from './mongo';

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
  log.info(`Variable ${key} set to ${value}.`);
});

// Schedule a job.
Promise.try(() => {
  if (cfg.CLEAN_START) {
    log.info('Cleaning previous ingestion...');
    return mongo.clean()
      .then(() => fsx.removeDirectory(path.join(base, cfg.FTP_LOCAL)))
      .then(() => fsx.removeDirectory(path.join(base, cfg.CSV_LOCATION)))
      .then(() => log.warn('Previous ingestion cleaned.'));
  }
})
  .then(mongo.invalidateJobs)
  .then((count) => {
    if (count) log.warn(`Invalidated ${count} old jobs.`);
  })
  .then(job.runJob)
  .catch(err => log.error(err));
