// Data sychronization job logic.

import Promise from 'bluebird';
import path from 'path';
import _ from 'lodash';
import ftp from './ftp';
import mongo from '../mongo';
import zip from './zip';
import fsx from './fsx';
import rir from './rir';
import csv from './csv';

// Check is there job in progress.
const checkProgress = jobs =>
  _.find(jobs, job => job.state === 'progress') || false;

// Find all the processed files in jobs.
const findProcessedFiles = (jobs) => {
  let files = [];
  _.each(jobs, (job) => {
    if (job.status === 'completed') {
      files = _.concat(files, job.files);
    }
  });
  return files;
};

// Find last processed date.
const findLastDate = jobs => Promise.try(() => {
  const files = findProcessedFiles(jobs);
  if (files.length === 0) {
    return undefined;
  }
  return path.basename(_(files)
    .sortBy(file => rir.filenameToDate(file))
    .last());
})
  .then((lastFile) => {
    if (lastFile === undefined) {
      return { _id: cfg.CSV_FIRST_DATE };
    }
    return mongo.findByFilename(lastFile);
  });

// Find unprocessed files.
const findUnprocessedFiles = (archives, commas) =>
  _.differenceWith(archives, commas, (archive, comma) =>
    path.basename(archive, '.gz') === path.basename(comma, '.csv'));

// Deduplicate FTP archives by "extended" > "ancient" preference.
const deduplicateArchives = (files) => {
  const ancient = _(files)
    .filter(file => rir.detectFormat(path.basename(file)) === 'ancient')
    .map(file => ({
      file,
      date: rir.filenameToDate(file),
    }))
    .value();

  const extended = _(files)
    .filter(file => rir.detectFormat(path.basename(file)) === 'extended')
    .map(file => ({
      file,
      date: rir.filenameToDate(file),
    }))
    .value();

  const union = _.unionBy(extended, ancient, entry => entry.date);

  return _.map(union, entry => entry.file);
};

// CSV parsing chain.
const interpretCsv = (last, filepath) => Promise.try(() => csv.readCsv(filepath))
  .then(content => csv.parseCsv(filepath, content))
  .then(data => csv.deriveStats(last, data))
  .then(data => mongo.saveStats(data)
    .then(() => log.info(`Interpreted ${path.basename(filepath)} file.`))
    .then(() => data.header.endDate),
  );

// Run a job.
const runJob = () => Promise.try(() => mongo.getAllJobs())
  .then((jobs) => {
    log.info('Checking job history.');
    const inProgress = checkProgress(jobs);
    if (inProgress) {
      log.warn('Job already in progress. Doing nothing.');
      return undefined;
    }
    log.info('No other jobs in progress.');

    return findLastDate(jobs)
      .then(lastDate => mongo.startJob()
        .then((job) => {
          log.info(`Started job with id ${job._id}.`);
          return ftp.mirror()
            .then(() => fsx.listFiles(cfg.FTP_LOCAL))
            .then((files) => {
              const filtered = _.filter(files, file =>
                fsx.hasExtension(file, '.gz') && !fsx.isSystemFile(file),
              );
              log.info(`Found ${filtered.length} non-system gzip files.`);
              const processed = findProcessedFiles(jobs);
              const deduplicated = deduplicateArchives(filtered);
              return findUnprocessedFiles(deduplicated, processed);
            })
            .then(zip.decompressArchives)
            .then((files) => {
              const paths = _(files)
                .map(file => path.join(base, cfg.CSV_LOCATION, file))
                .sortBy(file => rir.filenameToDate(file))
                .value();
              return Promise.reduce(paths, interpretCsv, lastDate._id)
                .then(() => mongo.completeJob(job._id, files));
            })
            .then(() => log.info(`Job with id ${job._id} completed.`))
            .catch((err) => {
              log.error('Error running the job.', err);
              return mongo.failJob(job._id);
            });
        }),
      );
  })
  .then(mongo.disconnect)
  .catch(err => log.error('MongoDB error.', err));

export default {
  runJob,
};

