
var _appRootPath = require('app-root-path');var _appRootPath2 = _interopRequireDefault(_appRootPath);
var _chai = require('chai');var _chai2 = _interopRequireDefault(_chai);
var _chaiAsPromised = require('chai-as-promised');var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);
var _logger = require('../logger');var _logger2 = _interopRequireDefault(_logger);
var _config = require('../config');var _config2 = _interopRequireDefault(_config);
var _csv = require('../utils/csv');var _csv2 = _interopRequireDefault(_csv);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };} // import Promise from 'bluebird';

_chai2['default'].use(_chaiAsPromised2['default']);

global.cfg = _config2['default'].create();
global.log = _logger2['default'].start();
global.base = _appRootPath2['default'].path;

var data = {
  filepath: './foo/bar/delegated-apnic-20031009.csv',
  content: [
  '2|apnic|20031009|3|19930101|20031008|\n',
  'apnic|*|asn|3|summary\n',
  'apnic|*|ipv4|0|summary\n',
  'apnic|*|ipv6|0|summary\n',
  'apnic|AU|asn|0|1|19941221|allocated\n',
  'apnic|JP|asn|10|10|19941221|allocated\n',
  'apnic|NZ|asn|2.39|1|19941221|allocated\n'].
  join('') };


describe('csv', function () {
  describe('parseCsv()', function () {
    var result = _csv2['default'].parseCsv(data.filepath, data.content);

    it('should contain filename', function () {return (
        (0, _chai.expect)(result).to.eventually.have.property('filename').
        to.deep.equal('delegated-apnic-20031009.csv'));});


    it('should contain header', function () {return (
        (0, _chai.expect)(result).to.eventually.have.property('header').
        to.deep.equal({
          version: 2,
          registry: 'apnic',
          serial: 20031009,
          records: 3,
          startDate: 19930101,
          endDate: 20031008 }));});



    it('should contain totals', function () {return (
        (0, _chai.expect)(result).to.eventually.have.property('totals').
        to.deep.equal({
          asn: { registry: 'apnic', count: 3 },
          ipv4: { registry: 'apnic', count: 0 },
          ipv6: { registry: 'apnic', count: 0 } }));});



    it('should contain entries', function () {return (
        (0, _chai.expect)(result).to.eventually.have.property('entries').
        to.deep.equal([
        {
          registry: 'apnic',
          country: 'au',
          type: 'asn',
          count: 1,
          date: 19941221,
          status: 'allocated' },

        {
          registry: 'apnic',
          country: 'jp',
          type: 'asn',
          count: 10,
          date: 19941221,
          status: 'allocated' },

        {
          registry: 'apnic',
          country: 'nz',
          type: 'asn',
          count: 1,
          date: 19941221,
          status: 'allocated' }]));});



  });
});