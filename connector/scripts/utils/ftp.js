// FTP-related utilites.

import path from 'path';
import Promise from 'bluebird';
import fse from 'fs-extra';
import { spawn } from 'child_process';

// Synchronizes local FTP directory with remote.
const mirror = () =>
  new Promise((resolve, reject) => {
    if (cfg.FTP_SKIP_SYNC) {
      log.warn('Skipping FTP mirror sync.');
      resolve();
    } else {
      const ftpArgs = [
        cfg.FTP_HOST,
        cfg.FTP_TIMEZONE,
        cfg.FTP_SYNC_CONCURRENCY,
        cfg.FTP_REMOTE,
        cfg.FTP_LOCAL,
      ];
      fse.ensureDirSync(path.resolve(path.join(base, cfg.FTP_LOCAL)));
      const ftpCmd = spawn('./scripts/shell/ftpSync.sh', ftpArgs);

      log.info('Started FTP mirror sync.');

      ftpCmd.stdout.on('data', (data) => {
        log.multiline(data, 'info');
      });

      ftpCmd.stderr.on('data', (data) => {
        log.multiline(data, 'warn');
      });

      ftpCmd.on('close', (code) => {
        if (code === 0) {
          log.info('FTP mirror sync complete.');
          resolve();
        } else {
          reject(new Error('FTP mirror sync failure.'));
        }
      });
    }
  });

export default {
  mirror,
};

