// Extended filesystem utilities.

import path from 'path';
import Promise from 'bluebird';
import fs from 'fs';
import fse from 'fs-extra';
import klaw from 'klaw';
import _ from 'lodash';

Promise.promisifyAll(fs);
Promise.promisifyAll(fse);

// Operating system files regular expressions.
const sysFileRegExps = [
  /\.*\.sw?/,
  /\.AppleDB/,
  /\.AppleDesktop/,
  /\.AppleDouble/,
  /\.DS_Store/,
  /\.DS_Store*/,
  /\.DocumentRevisions-V100/,
  /\.LSOverride/,
  /\.Spotlight-V100/,
  /\.Trashes/,
  /\.VolumeIcon\.icns/,
  /\.apdisk/,
  /\.fseventsd/,
  /Icon^M^M/,
  /Thumbs\.db/,
  /ehthumbs\.db/,
  /thumbs\.db/,
];

// Get file stats from filepath.
const getStats = filepath => fs.lstatSync(filepath);

// Deduplicate array of file paths according to filename.
const uniqueFilenames = filepaths => _(filepaths)
  .uniqBy(filepath => path.basename(filepath))
  .value();

// Checks is filepath a system file.
const isSystemFile = (filepath) => {
  const basename = path.basename(filepath);
  let flag = false;
  _.each(sysFileRegExps, (regex) => {
    flag = flag || regex.test(basename);
  });
  return flag;
};

// Checks is filepath a file.
const isFile = filepath => getStats(filepath).isFile();

// Checks is filepath a directory.
const isDirectory = filepath => getStats(filepath).isDirectory();

// Checks is filepath a block device.
const isBlockDevice = filepath => getStats(filepath).isBlockDevice();

// Checks is filepath a character device.
const isCharacterDevice = filepath => getStats(filepath).isCharacterDevice();

// Checks is filepath a symbolic link.
const isSymbolicLink = filepath => getStats(filepath).isSymbolicLink();

// Checks is filepath a FIFO.
const isFIFO = filepath => getStats(filepath).isFIFO();

// Checks is filepath a socket;
const isSocket = filepath => getStats(filepath).isSocket();

// Checks is filepath a dotfile.
const isDotFile = filepath => path.basename(filepath).charAt(0) === '.';

// Checks if filepath has extension.
const hasExtension = (filepath, extension) => path.extname(filepath) === extension;

// Finds all filepaths in a directory.
const listFiles = dir =>
  new Promise((resolve) => {
    const files = [];
    klaw(path.resolve(dir))
      .on('data', (file) => {
        if (file.stats.isFile()) {
          files.push(file.path);
        }
      })
      .on('end', () => {
        log.info(`Found ${files.length} files in ${dir}.`);
        resolve(files);
      });
  });

// Delete directory.
const removeDirectory = filepath => Promise.try(() => fse.removeAsync(filepath))
  .catch(() => Promise.resolve());

export default {
  listFiles,
  getStats,
  uniqueFilenames,
  isSystemFile,
  isFile,
  isDirectory,
  isBlockDevice,
  isCharacterDevice,
  isSymbolicLink,
  isFIFO,
  isSocket,
  isDotFile,
  hasExtension,
  removeDirectory,
};
