// ISO-code-related utilities.

import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';

Promise.promisifyAll(fs);

// Loads up file with ISO-3166 definitions.
const iso3166 = JSON.parse(
  fs.readFileSync(path.join(base, './docs/iso/iso3166.json'), 'utf-8'),
);

// Figures out which subregion does the country code belong to, and handles
// some edge cases.
const subRegionFromAlpha2 = (code) => {
  const entry = _.find(iso3166, country => country['alpha-2'] === code);
  if (entry === undefined) {
    if (code === 'EU') return 'Europe';
    else if (code === 'AP') return 'Asia-Pacific';
    return '';
  }
  if (entry['sub-region'] === undefined) return 'No Region';
  else if (entry['sub-region'] === 'Australia and New Zealand') return 'Oceania';
  else if (entry['sub-region'] === 'Polynesia') return 'Oceania';
  else if (entry['sub-region'] === 'Micronesia') return 'Oceania';
  else if (entry['sub-region'] === 'Melanesia') return 'Oceania';
  return entry['sub-region'];
};

export default {
  iso3166,
  subRegionFromAlpha2,
};

