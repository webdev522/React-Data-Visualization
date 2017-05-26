var _appRootPath = require('app-root-path');var _appRootPath2 = _interopRequireDefault(_appRootPath);
var _chai = require('chai');
var _logger = require('../logger');var _logger2 = _interopRequireDefault(_logger);
var _config = require('../config');var _config2 = _interopRequireDefault(_config);
var _asn = require('../utils/asn');var _asn2 = _interopRequireDefault(_asn);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

global.cfg = _config2['default'].create();
global.log = _logger2['default'].start();
global.base = _appRootPath2['default'].path;

describe('asn', function () {
  describe('asn.toInteger()', function () {
    it('should return 0 for "0"', function () {return (
        (0, _chai.expect)(_asn2['default'].toInteger('0')).to.equal(0));});

    it('should return 1 for "1"', function () {return (
        (0, _chai.expect)(_asn2['default'].toInteger('1')).to.equal(1));});

    it('should return 256 for "256"', function () {return (
        (0, _chai.expect)(_asn2['default'].toInteger('256')).to.equal(256));});

    it('should return 65536 for "65536"', function () {return (
        (0, _chai.expect)(_asn2['default'].toInteger('65536')).to.equal(65536));});

    it('should return 65546 for "65546"', function () {return (
        (0, _chai.expect)(_asn2['default'].toInteger('65546')).to.equal(65546));});

    it('should return 4295032832 for "4295032832"', function () {return (
        (0, _chai.expect)(_asn2['default'].toInteger('4295032832')).to.equal(4295032832));});

    it('should return 65536 for "1.0"', function () {return (
        (0, _chai.expect)(_asn2['default'].toInteger('1.0')).to.equal(65536));});

    it('should return 65537 for "1.1"', function () {return (
        (0, _chai.expect)(_asn2['default'].toInteger('1.1')).to.equal(65537));});

    it('should return 131187 "2.115"', function () {return (
        (0, _chai.expect)(_asn2['default'].toInteger('2.115')).to.equal(131187));});

    it('should return 131111 "2.39"', function () {return (
        (0, _chai.expect)(_asn2['default'].toInteger('2.39')).to.equal(131111));});

    it('should return 65535 for "0.65535"', function () {return (
        (0, _chai.expect)(_asn2['default'].toInteger('0.65535')).to.equal(65535));});

    it('should return 65535 for ".65535"', function () {return (
        (0, _chai.expect)(_asn2['default'].toInteger('.65535')).to.equal(65535));});

    it('should return 4294967296 for "65536.0"', function () {return (
        (0, _chai.expect)(_asn2['default'].toInteger('65536.0')).to.equal(4294967296));});

    it('should throw TypeError for 1', function () {return (
        (0, _chai.expect)(function () {return _asn2['default'].toInteger(1);}).to['throw'](TypeError));});

    it('should throw TypeError for "1.2.3"', function () {return (
        (0, _chai.expect)(function () {return _asn2['default'].toInteger('1.2.3');}).to['throw'](TypeError));});

    it('should throw RangeError for "4295032833"', function () {return (
        (0, _chai.expect)(function () {return _asn2['default'].toInteger('4295032833');}).to['throw'](RangeError));});

    it('should throw RangeError for "-1"', function () {return (
        (0, _chai.expect)(function () {return _asn2['default'].toInteger('-1');}).to['throw'](RangeError));});

    it('should throw RangeError for "65536.65537"', function () {return (
        (0, _chai.expect)(function () {return _asn2['default'].toInteger('65536.65537');}).to['throw'](RangeError));});

  });

  describe('toIntegerString()', function () {
    it('should return "0" for "0"', function () {return (
        (0, _chai.expect)(_asn2['default'].toIntegerString('0')).to.equal('0'));});

    it('should return "1" for "1"', function () {return (
        (0, _chai.expect)(_asn2['default'].toIntegerString('1')).to.equal('1'));});

    it('should return "256" for "256"', function () {return (
        (0, _chai.expect)(_asn2['default'].toIntegerString('256')).to.equal('256'));});

    it('should return "65536" for "65536"', function () {return (
        (0, _chai.expect)(_asn2['default'].toIntegerString('65536')).to.equal('65536'));});

    it('should return "65546" for "65546"', function () {return (
        (0, _chai.expect)(_asn2['default'].toIntegerString('65546')).to.equal('65546'));});

    it('should return "4294967296" for "4294967296"', function () {return (
        (0, _chai.expect)(_asn2['default'].toIntegerString('4294967296')).to.equal('4294967296'));});

    it('should return "65536" for "1.0"', function () {return (
        (0, _chai.expect)(_asn2['default'].toIntegerString('1.0')).to.equal('65536'));});

    it('should return "65537" for "1.1"', function () {return (
        (0, _chai.expect)(_asn2['default'].toIntegerString('1.1')).to.equal('65537'));});

    it('should return "65535" for "0.65535"', function () {return (
        (0, _chai.expect)(_asn2['default'].toIntegerString('0.65535')).to.equal('65535'));});

    it('should return "65535" for ".65535"', function () {return (
        (0, _chai.expect)(_asn2['default'].toIntegerString('.65535')).to.equal('65535'));});

    it('should return "4294967296" for "65536.0"', function () {return (
        (0, _chai.expect)(_asn2['default'].toIntegerString('65536.0')).to.equal('4294967296'));});

    it('should throw TypeError for 1', function () {return (
        (0, _chai.expect)(function () {return _asn2['default'].toIntegerString(1);}).to['throw'](TypeError));});

    it('should throw TypeError for "1.2.3"', function () {return (
        (0, _chai.expect)(function () {return _asn2['default'].toIntegerString('1.2.3');}).to['throw'](TypeError));});

    it('should throw RangeError for "4295032833"', function () {return (
        (0, _chai.expect)(function () {return _asn2['default'].toIntegerString('4295032833');}).to['throw'](RangeError));});

    it('should throw RangeError for "-1"', function () {return (
        (0, _chai.expect)(function () {return _asn2['default'].toIntegerString('-1');}).to['throw'](RangeError));});

    it('should throw RangeError for "65536.65537"', function () {return (
        (0, _chai.expect)(function () {return _asn2['default'].toIntegerString('65536.65537');}).to['throw'](RangeError));});

  });

  describe('highAndLow()', function () {
    it('should return "{ high: 0, low: 0 }" for "0"', function () {return (
        (0, _chai.expect)(_asn2['default'].highAndLow('0')).to.deep.equal({ high: 0, low: 0 }));});

    it('should return "{ high: 0, low: 1 }" for "1"', function () {return (
        (0, _chai.expect)(_asn2['default'].highAndLow('1')).to.deep.equal({ high: 0, low: 1 }));});

    it('should return "{ high: 0, low: 256}" for "256"', function () {return (
        (0, _chai.expect)(_asn2['default'].highAndLow('256')).to.deep.equal({ high: 0, low: 256 }));});

    it('should return "{ high: 1, low: 0 }" for "65536"', function () {return (
        (0, _chai.expect)(_asn2['default'].highAndLow('65536')).to.deep.equal({ high: 1, low: 0 }));});

    it('should return "{ high: 1, low: 10 }" for "65546"', function () {return (
        (0, _chai.expect)(_asn2['default'].highAndLow('65546')).to.deep.equal({ high: 1, low: 10 }));});

    it('should return "{ high: 65536, low: 0 }" for "4294967296"', function () {return (
        (0, _chai.expect)(_asn2['default'].highAndLow('4294967296')).to.deep.equal({ high: 65536, low: 0 }));});

    it('should return "{ high: 1, low: 0 }" for "1.0"', function () {return (
        (0, _chai.expect)(_asn2['default'].highAndLow('1.0')).to.deep.equal({ high: 1, low: 0 }));});

    it('should return "{ high: 1, low: 1 }" for "1.1"', function () {return (
        (0, _chai.expect)(_asn2['default'].highAndLow('1.1')).to.deep.equal({ high: 1, low: 1 }));});

    it('should return "{ high: 0, low: 65535 }" for "0.65535"', function () {return (
        (0, _chai.expect)(_asn2['default'].highAndLow('0.65535')).to.deep.equal({ high: 0, low: 65535 }));});

    it('should return "{ high: 65536, low: 0 }" for "65536.0"', function () {return (
        (0, _chai.expect)(_asn2['default'].highAndLow('65536.0')).to.deep.equal({ high: 65536, low: 0 }));});

    it('should throw TypeError for 1', function () {return (
        (0, _chai.expect)(function () {return _asn2['default'].highAndLow(1);}).to['throw'](TypeError));});

    it('should throw TypeError for "1.2.3"', function () {return (
        (0, _chai.expect)(function () {return _asn2['default'].highAndLow('1.2.3');}).to['throw'](TypeError));});

    it('should throw RangeError for "4295032833"', function () {return (
        (0, _chai.expect)(function () {return _asn2['default'].highAndLow('4295032833');}).to['throw'](RangeError));});

    it('should throw RangeError for "-1"', function () {return (
        (0, _chai.expect)(function () {return _asn2['default'].highAndLow('-1');}).to['throw'](RangeError));});

    it('should throw RangeError for "65536.65537"', function () {return (
        (0, _chai.expect)(function () {return _asn2['default'].highAndLow('65536.65537');}).to['throw'](RangeError));});

  });
});