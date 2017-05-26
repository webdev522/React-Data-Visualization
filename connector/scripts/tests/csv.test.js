// import Promise from 'bluebird';
import appRoot from 'app-root-path';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import logger from '../logger';
import config from '../config';
import csv from '../utils/csv';

chai.use(chaiAsPromised);

global.cfg = config.create();
global.log = logger.start();
global.base = appRoot.path;

const data = {
  filepath: './foo/bar/delegated-apnic-20031009.csv',
  content: [
    '2|apnic|20031009|3|19930101|20031008|\n',
    'apnic|*|asn|3|summary\n',
    'apnic|*|ipv4|0|summary\n',
    'apnic|*|ipv6|0|summary\n',
    'apnic|AU|asn|0|1|19941221|allocated\n',
    'apnic|JP|asn|10|10|19941221|allocated\n',
    'apnic|NZ|asn|2.39|1|19941221|allocated\n',
  ].join(''),
};

describe('csv', () => {
  describe('parseCsv()', () => {
    const result = csv.parseCsv(data.filepath, data.content);

    it('should contain filename', () =>
      expect(result).to.eventually.have.property('filename')
      .to.deep.equal('delegated-apnic-20031009.csv'),
    );

    it('should contain header', () =>
      expect(result).to.eventually.have.property('header')
      .to.deep.equal({
        version: 2,
        registry: 'apnic',
        serial: 20031009,
        records: 3,
        startDate: 19930101,
        endDate: 20031008,
      }),
    );

    it('should contain totals', () =>
      expect(result).to.eventually.have.property('totals')
      .to.deep.equal({
        asn: { registry: 'apnic', count: 3 },
        ipv4: { registry: 'apnic', count: 0 },
        ipv6: { registry: 'apnic', count: 0 },
      }),
    );

    it('should contain entries', () =>
      expect(result).to.eventually.have.property('entries')
      .to.deep.equal([
        {
          registry: 'apnic',
          country: 'au',
          type: 'asn',
          count: 1,
          date: 19941221,
          status: 'allocated',
        },
        {
          registry: 'apnic',
          country: 'jp',
          type: 'asn',
          count: 10,
          date: 19941221,
          status: 'allocated',
        },
        {
          registry: 'apnic',
          country: 'nz',
          type: 'asn',
          count: 1,
          date: 19941221,
          status: 'allocated',
        },
      ]),
    );
  });
});
