import appRoot from 'app-root-path';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import logger from '../logger';
import config from '../config';
import rir from '../utils/rir';

chai.use(chaiAsPromised);

global.cfg = config.create();
global.log = logger.start();
global.base = appRoot.path;

describe('rir', () => {
  describe('detectFormat()', () => {
    it('should return "ancient" for "apnic-2001-05-01.csv"', () =>
      expect(rir.detectFormat('apnic-2001-05-01.csv'))
        .to.equal('ancient'),
    );
    it('should return "legacy" for "legacy-apnic-20010501.csv"', () =>
      expect(rir.detectFormat('legacy-apnic-20010501.csv'))
        .to.equal('legacy'),
    );
    it('should return "assigned" for "assigned-apnic-20010501.csv"', () =>
      expect(rir.detectFormat('assigned-apnic-20010501.csv'))
        .to.equal('assigned'),
    );
    it('should return "delegated" for "delegated-apnic-20010501.csv"', () =>
      expect(rir.detectFormat('delegated-apnic-20010501.csv'))
        .to.equal('delegated'),
    );
    it('should return "extended" for "delegated-apnic-extended-20010501.csv"', () =>
      expect(rir.detectFormat('delegated-apnic-extended-20010501.csv'))
        .to.equal('extended'),
    );
    it('should return "ipv6" for "delegated-apnic-ipv6-assigned-20010501.csv"', () =>
      expect(rir.detectFormat('delegated-apnic-ipv6-assigned-20010501.csv'))
        .to.equal('ipv6'),
    );
    it('should throw TypeError for "shalala.csv"', () =>
      expect(() => rir.detectFormat('shalala'))
        .to.throw(TypeError),
    );
  });

  describe('filenameToDate()', () => {
    it('should return 988675200 for "apnic-2001-05-01.csv"', () =>
      expect(rir.filenameToDate('apnic-2001-05-01.csv'))
        .to.equal(20010501),
    );
    it('should return 988675200 for "legacy-apnic-20010501.csv"', () =>
      expect(rir.filenameToDate('legacy-apnic-20010501.csv'))
        .to.equal(20010501),
    );
    it('should return 988675200 for "assigned-apnic-20010501.csv"', () =>
      expect(rir.filenameToDate('assigned-apnic-20010501.csv'))
        .to.equal(20010501),
    );
    it('should return 988675200 for "delegated-apnic-20010501.csv"', () =>
      expect(rir.filenameToDate('delegated-apnic-20010501.csv'))
        .to.equal(20010501),
    );
    it('should return 988675200 for "delegated-apnic-extended-20010501.csv"', () =>
      expect(rir.filenameToDate('delegated-apnic-extended-20010501.csv').valueOf())
        .to.equal(20010501),
    );
    it('should return 988675200 for "delegated-apnic-ipv6-assigned-20010501.csv"', () =>
      expect(rir.filenameToDate('delegated-apnic-ipv6-assigned-20010501.csv'))
        .to.equal(20010501),
    );
    it('should throw TypeError for "shalala.csv"', () =>
      expect(() => rir.filenameToDate('shalala'))
        .to.throw(TypeError),
    );
  });

  describe('filenameToRegistry()', () => {
    it('should return "apnic" for "apnic-2001-05-01.csv"', () =>
      expect(rir.filenameToRegistry('apnic-2001-05-01.csv'))
        .to.equal('apnic'),
    );
    it('should return "afrinic" for "delegated-afrinic-20010501.csv"', () =>
      expect(rir.filenameToRegistry('delegated-afrinic-20010501.csv'))
        .to.equal('afrinic'),
    );
    it('should return "arin" for "assigned-arin-20010501.csv"', () =>
      expect(rir.filenameToRegistry('assigned-arin-20010501.csv'))
        .to.equal('arin'),
    );
    it('should return "iana" for "legacy-iana-20010501.csv"', () =>
      expect(rir.filenameToRegistry('legacy-iana-20010501.csv'))
        .to.equal('iana'),
    );
    it('should return "lacnic" for "delegated-lacnic-extended-20010501.csv"', () =>
      expect(rir.filenameToRegistry('delegated-lacnic-extended-20010501.csv'))
        .to.equal('lacnic'),
    );
    it('should return "ripe" for "delegated-ripencc-extended-ipv6-20010501.csv"', () =>
      expect(rir.filenameToRegistry('delegated-ripencc-extended-ipv6-20010501.csv'))
        .to.equal('ripe'),
    );
    it('should return "ripe" for "delegated-ripe-extended-ipv6-20010501.csv"', () =>
      expect(rir.filenameToRegistry('delegated-ripe-extended-ipv6-20010501.csv'))
        .to.equal('ripe'),
    );
  });

  describe('sortFilepathsByDate()', () => {
    it('should return ["./bar/delegated-apnic-20010101", "./foo/apnic-2008-01-03"] for ["./foo/apnic-2008-01-03", "./bar/delegated-apnic-20010101"]', () =>
      expect(rir.sortFilepathsByDate([
        './foo/apnic-2008-01-03',
        './bar/delegated-apnic-20010101',
      ])).to.deep.equal([
        './bar/delegated-apnic-20010101',
        './foo/apnic-2008-01-03',
      ]),
    );
  });
});
