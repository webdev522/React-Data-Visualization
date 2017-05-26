// Compression related utilites.

/* eslint-disable import/prefer-default-export */

import path from 'path';
import _ from 'lodash';
import Promise from 'bluebird';
import fs from 'fs';
import fse from 'fs-extra';
import { exec } from 'child_process';

// Decompresses a single FTP file archive if it's not already decompressed.
const decompress = file =>
  new Promise((resolve, reject) => {
    const output = `${path.join(base, cfg.CSV_LOCATION, path.basename(file, '.gz'))}.csv`;
    const result = path.basename(output);
    fs.access(output, fs.constants.R_OK, (err) => {
      if (err) {
        exec(`gunzip -c ${file} > ${output}`, (err) => {
          if (err) {
            reject(new Error(`FTP archive decompression failed on ${file}.`));
          } else {
            resolve(result);
          }
        });
      } else {
        resolve(result);
      }
    });
  });

// Decompresses all FTP file archives.
const decompressArchives = (files) => {
  if (cfg.FTP_SKIP_DECOMPRESSION) {
    log.warn('Skipping FTP archive decompression.');
    return Promise.try(() => _(files)
      .map((file) => {
        const output = `${path.join(base, cfg.CSV_LOCATION, path.basename(file, '.gz'))}.csv`;
        return path.basename(output);
      })
      .value(),
    );
  }

  fse.ensureDirSync(path.resolve(path.join(base, cfg.CSV_LOCATION)));
  return Promise.try(() => files)
    .then((results) => {
      log.info('Starting FTP archive decompression.');
      return results;
    })
    .map(decompress, { concurrency: cfg.FTP_GUNZIP_CONCURRENCY })
    .then((results) => {
      log.info(`Decompressed ${results.length} archives.`);
      return results;
    });
};

export default {
  decompressArchives,
};

