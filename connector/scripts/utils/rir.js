// RIR statistics utility.

import path from 'path';
import _ from 'lodash';

// Regular expressions for all report formats in both JS and PCRE variants.
const formats = {
  js: {
    ancient: /apnic-\d{4}-\d{2}-\d{2}/,
    legacy: /legacy-apnic-\d{8}/,
    assigned: /assigned-apnic-\d{8}/,
    ipv6: /delegated-apnic-ipv6-assigned-\d{8}/,
    delegated: /delegated-apnic-\d{8}/,
    extended: /delegated-apnic-extended-\d{8}/,
  },
  pcre: {
    ancient: 'apnic-[0-9]\\{4}-[0-9]\\{2}-[0-9]\\{2}\\.gz$',
    legacy: 'legacy-apnic-[0-9]\\{8}\\.gz$',
    assigned: 'assigned-apnic-[0-9]\\{8}\\.gz$',
    ipv6: 'delegated-apnic-ipv6-extended-[0-9]\\{8}\\.gz$',
    delegated: 'delegated-apnic-[0-9]\\{8}\\.gz$',
    extended: 'delegated-apnic-extended-[0-9]\\{8}\\.gz$',
  },
};

// Infers RIR report format from filename.
const detectFormat = (filename) => {
  let format;

  if (formats.js.ancient.test(filename)) format = 'ancient';
  else if (formats.js.legacy.test(filename)) format = 'legacy';
  else if (formats.js.assigned.test(filename)) format = 'assigned';
  else if (formats.js.ipv6.test(filename)) format = 'ipv6';
  else if (formats.js.delegated.test(filename)) format = 'delegated';
  else if (formats.js.extended.test(filename)) format = 'extended';
  else throw new TypeError('Unrecognized RIR report format!');

  return format;
};

// Finds integer time from filename.
const filenameToDate = (filename) => {
  const extension = path.extname(filename);
  const lean = path.basename(filename, extension);
  const format = detectFormat(lean);
  let date;

  if (format === 'ancient') {
    date = Number.parseInt(lean.substr(lean.length - 10).replace(/-/g, ''), 10);
  } else {
    date = Number.parseInt(lean.substr(lean.length - 8), 10);
  }

  return date;
};

// Finds registry from filename.
const filenameToRegistry = (filename) => {
  const lean = path.basename(filename);
  if (lean.indexOf('afrinic') !== -1) return 'afrinic';
  else if (lean.toLowerCase().indexOf('apnic') !== -1) return 'apnic';
  else if (lean.toLowerCase().indexOf('arin') !== -1) return 'arin';
  else if (lean.toLowerCase().indexOf('iana') !== -1) return 'iana';
  else if (lean.toLowerCase().indexOf('lacnic') !== -1) return 'lacnic';
  else if (lean.toLowerCase().indexOf('ripe') !== -1) return 'ripe';
  else if (lean.toLowerCase().indexOf('ripencc') !== -1) return 'ripe';
  else if (lean.toLowerCase().indexOf('ripe-ncc') !== -1) return 'ripe';
  return 'unknown';
};

// Sort list of filepaths according to filename-inferred epoch time.
const sortFilepathsByDate = filepaths => _(filepaths)
  .sortBy(filepath => filenameToDate(filepath))
  .value();

export default {
  formats,
  detectFormat,
  filenameToDate,
  filenameToRegistry,
  sortFilepathsByDate,
};

