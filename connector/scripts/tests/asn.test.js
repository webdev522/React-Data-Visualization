import appRoot from 'app-root-path';
import { expect } from 'chai';
import logger from '../logger';
import config from '../config';
import asn from '../utils/asn';

global.cfg = config.create();
global.log = logger.start();
global.base = appRoot.path;

describe('asn', () => {
  describe('asn.toInteger()', () => {
    it('should return 0 for "0"', () =>
      expect(asn.toInteger('0')).to.equal(0),
    );
    it('should return 1 for "1"', () =>
      expect(asn.toInteger('1')).to.equal(1),
    );
    it('should return 256 for "256"', () =>
      expect(asn.toInteger('256')).to.equal(256),
    );
    it('should return 65536 for "65536"', () =>
      expect(asn.toInteger('65536')).to.equal(65536),
    );
    it('should return 65546 for "65546"', () =>
      expect(asn.toInteger('65546')).to.equal(65546),
    );
    it('should return 4295032832 for "4295032832"', () =>
      expect(asn.toInteger('4295032832')).to.equal(4295032832),
    );
    it('should return 65536 for "1.0"', () =>
      expect(asn.toInteger('1.0')).to.equal(65536),
    );
    it('should return 65537 for "1.1"', () =>
      expect(asn.toInteger('1.1')).to.equal(65537),
    );
    it('should return 131187 "2.115"', () =>
      expect(asn.toInteger('2.115')).to.equal(131187),
    );
    it('should return 131111 "2.39"', () =>
      expect(asn.toInteger('2.39')).to.equal(131111),
    );
    it('should return 65535 for "0.65535"', () =>
      expect(asn.toInteger('0.65535')).to.equal(65535),
    );
    it('should return 65535 for ".65535"', () =>
      expect(asn.toInteger('.65535')).to.equal(65535),
    );
    it('should return 4294967296 for "65536.0"', () =>
      expect(asn.toInteger('65536.0')).to.equal(4294967296),
    );
    it('should throw TypeError for 1', () =>
      expect(() => asn.toInteger(1)).to.throw(TypeError),
    );
    it('should throw TypeError for "1.2.3"', () =>
      expect(() => asn.toInteger('1.2.3')).to.throw(TypeError),
    );
    it('should throw RangeError for "4295032833"', () =>
      expect(() => asn.toInteger('4295032833')).to.throw(RangeError),
    );
    it('should throw RangeError for "-1"', () =>
      expect(() => asn.toInteger('-1')).to.throw(RangeError),
    );
    it('should throw RangeError for "65536.65537"', () =>
      expect(() => asn.toInteger('65536.65537')).to.throw(RangeError),
    );
  });

  describe('toIntegerString()', () => {
    it('should return "0" for "0"', () =>
      expect(asn.toIntegerString('0')).to.equal('0'),
    );
    it('should return "1" for "1"', () =>
      expect(asn.toIntegerString('1')).to.equal('1'),
    );
    it('should return "256" for "256"', () =>
      expect(asn.toIntegerString('256')).to.equal('256'),
    );
    it('should return "65536" for "65536"', () =>
      expect(asn.toIntegerString('65536')).to.equal('65536'),
    );
    it('should return "65546" for "65546"', () =>
      expect(asn.toIntegerString('65546')).to.equal('65546'),
    );
    it('should return "4294967296" for "4294967296"', () =>
      expect(asn.toIntegerString('4294967296')).to.equal('4294967296'),
    );
    it('should return "65536" for "1.0"', () =>
      expect(asn.toIntegerString('1.0')).to.equal('65536'),
    );
    it('should return "65537" for "1.1"', () =>
      expect(asn.toIntegerString('1.1')).to.equal('65537'),
    );
    it('should return "65535" for "0.65535"', () =>
      expect(asn.toIntegerString('0.65535')).to.equal('65535'),
    );
    it('should return "65535" for ".65535"', () =>
      expect(asn.toIntegerString('.65535')).to.equal('65535'),
    );
    it('should return "4294967296" for "65536.0"', () =>
      expect(asn.toIntegerString('65536.0')).to.equal('4294967296'),
    );
    it('should throw TypeError for 1', () =>
      expect(() => asn.toIntegerString(1)).to.throw(TypeError),
    );
    it('should throw TypeError for "1.2.3"', () =>
      expect(() => asn.toIntegerString('1.2.3')).to.throw(TypeError),
    );
    it('should throw RangeError for "4295032833"', () =>
      expect(() => asn.toIntegerString('4295032833')).to.throw(RangeError),
    );
    it('should throw RangeError for "-1"', () =>
      expect(() => asn.toIntegerString('-1')).to.throw(RangeError),
    );
    it('should throw RangeError for "65536.65537"', () =>
      expect(() => asn.toIntegerString('65536.65537')).to.throw(RangeError),
    );
  });

  describe('highAndLow()', () => {
    it('should return "{ high: 0, low: 0 }" for "0"', () =>
      expect(asn.highAndLow('0')).to.deep.equal({ high: 0, low: 0 }),
    );
    it('should return "{ high: 0, low: 1 }" for "1"', () =>
      expect(asn.highAndLow('1')).to.deep.equal({ high: 0, low: 1 }),
    );
    it('should return "{ high: 0, low: 256}" for "256"', () =>
      expect(asn.highAndLow('256')).to.deep.equal({ high: 0, low: 256 }),
    );
    it('should return "{ high: 1, low: 0 }" for "65536"', () =>
      expect(asn.highAndLow('65536')).to.deep.equal({ high: 1, low: 0 }),
    );
    it('should return "{ high: 1, low: 10 }" for "65546"', () =>
      expect(asn.highAndLow('65546')).to.deep.equal({ high: 1, low: 10 }),
    );
    it('should return "{ high: 65536, low: 0 }" for "4294967296"', () =>
      expect(asn.highAndLow('4294967296')).to.deep.equal({ high: 65536, low: 0 }),
    );
    it('should return "{ high: 1, low: 0 }" for "1.0"', () =>
      expect(asn.highAndLow('1.0')).to.deep.equal({ high: 1, low: 0 }),
    );
    it('should return "{ high: 1, low: 1 }" for "1.1"', () =>
      expect(asn.highAndLow('1.1')).to.deep.equal({ high: 1, low: 1 }),
    );
    it('should return "{ high: 0, low: 65535 }" for "0.65535"', () =>
      expect(asn.highAndLow('0.65535')).to.deep.equal({ high: 0, low: 65535 }),
    );
    it('should return "{ high: 65536, low: 0 }" for "65536.0"', () =>
      expect(asn.highAndLow('65536.0')).to.deep.equal({ high: 65536, low: 0 }),
    );
    it('should throw TypeError for 1', () =>
      expect(() => asn.highAndLow(1)).to.throw(TypeError),
    );
    it('should throw TypeError for "1.2.3"', () =>
      expect(() => asn.highAndLow('1.2.3')).to.throw(TypeError),
    );
    it('should throw RangeError for "4295032833"', () =>
      expect(() => asn.highAndLow('4295032833')).to.throw(RangeError),
    );
    it('should throw RangeError for "-1"', () =>
      expect(() => asn.highAndLow('-1')).to.throw(RangeError),
    );
    it('should throw RangeError for "65536.65537"', () =>
      expect(() => asn.highAndLow('65536.65537')).to.throw(RangeError),
    );
  });
});
