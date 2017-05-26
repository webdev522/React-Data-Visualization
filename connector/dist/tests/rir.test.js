var _appRootPath = require('app-root-path');var _appRootPath2 = _interopRequireDefault(_appRootPath);
var _chai = require('chai');var _chai2 = _interopRequireDefault(_chai);
var _chaiAsPromised = require('chai-as-promised');var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);
var _logger = require('../logger');var _logger2 = _interopRequireDefault(_logger);
var _config = require('../config');var _config2 = _interopRequireDefault(_config);
var _rir = require('../utils/rir');var _rir2 = _interopRequireDefault(_rir);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

_chai2['default'].use(_chaiAsPromised2['default']);

global.cfg = _config2['default'].create();
global.log = _logger2['default'].start();
global.base = _appRootPath2['default'].path;

describe('rir', function () {
  describe('detectFormat()', function () {
    it('should return "ancient" for "apnic-2001-05-01.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].detectFormat('apnic-2001-05-01.csv')).
        to.equal('ancient'));});

    it('should return "legacy" for "legacy-apnic-20010501.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].detectFormat('legacy-apnic-20010501.csv')).
        to.equal('legacy'));});

    it('should return "assigned" for "assigned-apnic-20010501.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].detectFormat('assigned-apnic-20010501.csv')).
        to.equal('assigned'));});

    it('should return "delegated" for "delegated-apnic-20010501.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].detectFormat('delegated-apnic-20010501.csv')).
        to.equal('delegated'));});

    it('should return "extended" for "delegated-apnic-extended-20010501.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].detectFormat('delegated-apnic-extended-20010501.csv')).
        to.equal('extended'));});

    it('should return "ipv6" for "delegated-apnic-ipv6-assigned-20010501.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].detectFormat('delegated-apnic-ipv6-assigned-20010501.csv')).
        to.equal('ipv6'));});

    it('should throw TypeError for "shalala.csv"', function () {return (
        (0, _chai.expect)(function () {return _rir2['default'].detectFormat('shalala');}).
        to['throw'](TypeError));});

  });

  describe('filenameToDate()', function () {
    it('should return 988675200 for "apnic-2001-05-01.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].filenameToDate('apnic-2001-05-01.csv')).
        to.equal(20010501));});

    it('should return 988675200 for "legacy-apnic-20010501.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].filenameToDate('legacy-apnic-20010501.csv')).
        to.equal(20010501));});

    it('should return 988675200 for "assigned-apnic-20010501.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].filenameToDate('assigned-apnic-20010501.csv')).
        to.equal(20010501));});

    it('should return 988675200 for "delegated-apnic-20010501.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].filenameToDate('delegated-apnic-20010501.csv')).
        to.equal(20010501));});

    it('should return 988675200 for "delegated-apnic-extended-20010501.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].filenameToDate('delegated-apnic-extended-20010501.csv').valueOf()).
        to.equal(20010501));});

    it('should return 988675200 for "delegated-apnic-ipv6-assigned-20010501.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].filenameToDate('delegated-apnic-ipv6-assigned-20010501.csv')).
        to.equal(20010501));});

    it('should throw TypeError for "shalala.csv"', function () {return (
        (0, _chai.expect)(function () {return _rir2['default'].filenameToDate('shalala');}).
        to['throw'](TypeError));});

  });

  describe('filenameToRegistry()', function () {
    it('should return "apnic" for "apnic-2001-05-01.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].filenameToRegistry('apnic-2001-05-01.csv')).
        to.equal('apnic'));});

    it('should return "afrinic" for "delegated-afrinic-20010501.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].filenameToRegistry('delegated-afrinic-20010501.csv')).
        to.equal('afrinic'));});

    it('should return "arin" for "assigned-arin-20010501.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].filenameToRegistry('assigned-arin-20010501.csv')).
        to.equal('arin'));});

    it('should return "iana" for "legacy-iana-20010501.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].filenameToRegistry('legacy-iana-20010501.csv')).
        to.equal('iana'));});

    it('should return "lacnic" for "delegated-lacnic-extended-20010501.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].filenameToRegistry('delegated-lacnic-extended-20010501.csv')).
        to.equal('lacnic'));});

    it('should return "ripe" for "delegated-ripencc-extended-ipv6-20010501.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].filenameToRegistry('delegated-ripencc-extended-ipv6-20010501.csv')).
        to.equal('ripe'));});

    it('should return "ripe" for "delegated-ripe-extended-ipv6-20010501.csv"', function () {return (
        (0, _chai.expect)(_rir2['default'].filenameToRegistry('delegated-ripe-extended-ipv6-20010501.csv')).
        to.equal('ripe'));});

  });

  describe('sortFilepathsByDate()', function () {
    it('should return ["./bar/delegated-apnic-20010101", "./foo/apnic-2008-01-03"] for ["./foo/apnic-2008-01-03", "./bar/delegated-apnic-20010101"]', function () {return (
        (0, _chai.expect)(_rir2['default'].sortFilepathsByDate([
        './foo/apnic-2008-01-03',
        './bar/delegated-apnic-20010101'])).
        to.deep.equal([
        './bar/delegated-apnic-20010101',
        './foo/apnic-2008-01-03']));});


  });
});