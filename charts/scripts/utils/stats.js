/* eslint-disable no-loop-func, max-len */
import Promise from 'bluebird';
import 'whatwg-fetch';
import _ from 'lodash';
import moment from 'moment';
import colors from './colors';

const stats = {
  API_STATS: process.env.API_STATS,

  start: undefined,
  end: undefined,
  from: undefined,
  to: undefined,
  updated: undefined,
  dates: [],
  segment: [],
  economies: [{
    id: 'all',
    label: 'ALL',
    color: colors.list[0],
    countries: [{
      id: 'all',
      label: 'ALL',
      color: colors.list[0],
    }],
  }],

  load() {
    return Promise.try(() => fetch(`${this.API_STATS}`))
      .then(response => response.json())
      .then((data) => {
        this.updateEconomies(data.economies);
        this.start = data.statistics.start;
        this.end = data.statistics.end;
        this.updated = data.statistics.updated;
        this.dates = data.statistics.dates;
      });
  },

  updateEconomies(list) {
    _.each(list, (country) => {
      const subregion = country.subregion || 'NO SUBREGION';
      const subregionIndex = _.findIndex(this.economies, economy =>
        subregion.toLowerCase() === economy.id,
      );
      if (subregionIndex === -1) {
        this.economies.push({
          id: subregion.toLowerCase(),
          label: subregion,
          color: colors.list[this.economies.length],
          countries: [{
            id: 'all',
            label: 'ALL',
            color: colors.list[0],
          }, {
            id: country.code,
            label: country.country,
            color: colors.list[1],
          }],
        });
      } else {
        this.economies[subregionIndex].countries.push({
          id: country.code,
          label: country.country,
          color: colors.list[this.economies[subregionIndex].countries.length],
        });
      }
    });
  },

  getYear(start, offset) {
    const s = moment(String(start), 'YYYYMMDD');
    const e = s.add(offset, 'days');
    return e.year();
  },

  dayDiff(start, end) {
    const s = moment(String(start), 'YYYYMMDD');
    const e = moment(String(end), 'YYYYMMDD');
    const diff = e.diff(s, 'days');
    return Number.parseInt(diff, 10);
  },

  slice(from, to) {
    this.from = from;
    this.to = to;
    this.segment = _.slice(
      this.dates,
      this.dayDiff(this.start, from),
      this.dayDiff(this.start, to),
    );
  },

  getColorBySubregionLabel(label) {
    return _.find(this.economies, economy => economy.label === label).color;
  },

  getColorByCountryLabel(label) {
    let color;
    for (let i = 0; i < this.economies.length; i += 1) {
      color = undefined;
      for (let j = 0; j < this.economies[i].countries.length; j += 1) {
        if (this.economies[i].countries[j].label === label) {
          color = this.economies[i].countries[j].color;
          break;
        }
      }
      if (color) break;
    }
    return color;
  },

  getEconomyLabelByCountryId(code) {
    let label;
    for (let i = 0; i < this.economies.length; i += 1) {
      label = undefined;
      for (let j = 0; j < this.economies[i].countries.length; j += 1) {
        if (this.economies[i].countries[j].id === code) {
          label = this.economies[i].label;
          break;
        }
      }
      if (label) break;
    }
    return label;
  },

  getCountryLabelByCountryId(code) {
    let label;
    for (let i = 0; i < this.economies.length; i += 1) {
      label = undefined;
      for (let j = 0; j < this.economies[i].countries.length; j += 1) {
        if (this.economies[i].countries[j].id === code) {
          label = this.economies[i].countries[j].label;
          break;
        }
      }
      if (label) break;
    }
    return label;
  },

  getEconomyIdByCountryId(code) {
    let id;
    for (let i = 0; i < this.economies.length; i += 1) {
      id = undefined;
      for (let j = 0; j < this.economies[i].countries.length; j += 1) {
        if (this.economies[i].countries[j].id === code) {
          id = this.economies[i].id;
          break;
        }
      }
      if (id) break;
    }
    return id;
  },

  getBarData(type, subregion, country) {
    const results = {};
    const field = `${type}NewSum`;
    let year;
    let yearIndex;
    let label;
    let getLabel;
    const isRelevant = (countryId) => {
      if (subregion === 'all' && country === 'all') {
        return true;
      } else if (subregion !== 'all' && country === 'all') {
        return subregion === this.getEconomyIdByCountryId(countryId);
      } else if (subregion !== 'all' && country !== 'all') {
        return country === countryId;
      }
      return false;
    };

    if (subregion === 'all') getLabel = this.getEconomyLabelByCountryId.bind(this);
    else getLabel = this.getCountryLabelByCountryId.bind(this);

    for (let i = 0; i < this.segment.length; i += 1) {
      year = this.getYear(this.from, i);
      _.each(this.segment[i], (value, key) => {
        label = getLabel(key);
        if (key !== '' &&
            isRelevant(key) &&
            value &&
            value[field] &&
            !Number.isNaN(value[field])) {
          if (results[label]) {
            yearIndex = _.findIndex(results[label], result => result.year === year);
            if (yearIndex !== -1) results[label][yearIndex].total += value[field];
            else results[label].push({ year, total: value[field] });
          } else {
            results[label] = [{ year, total: value[field] }];
          }
        }
      });
    }

    return results;
  },

  getPieData(type, subregion) {
    const results = [];
    const field = `${type}NewSum`;
    let label;
    let getLabel;
    let index;
    const isRelevant = (countryId) => {
      if (subregion === 'all') {
        return true;
      } else if (subregion !== 'all') {
        return subregion === this.getEconomyIdByCountryId(countryId);
      }
      return false;
    };

    if (subregion === 'all') getLabel = this.getEconomyLabelByCountryId.bind(this);
    else getLabel = this.getCountryLabelByCountryId.bind(this);

    for (let i = 0; i < this.segment.length; i += 1) {
      _.each(this.segment[i], (value, key) => {
        label = getLabel(key);
        if (key !== '' &&
            isRelevant(key) &&
            value &&
            value[field] &&
            !Number.isNaN(value[field])) {
          index = _.findIndex(results, result => result.label === label);
          if (index === -1) {
            results.push({
              label,
              total: value[field],
            });
          } else {
            results[index].total += value[field];
          }
        }
      });
    }

    return results;
  },

};

export default stats;
