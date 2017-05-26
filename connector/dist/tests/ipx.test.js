var _appRootPath = require('app-root-path');var _appRootPath2 = _interopRequireDefault(_appRootPath);
var _chai = require('chai');
var _logger = require('../logger');var _logger2 = _interopRequireDefault(_logger);
var _config = require('../config');var _config2 = _interopRequireDefault(_config);
var _ipx = require('../utils/ipx');var _ipx2 = _interopRequireDefault(_ipx);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

global.cfg = _config2['default'].create();
global.log = _logger2['default'].start();
global.base = _appRootPath2['default'].path;

describe('ipx', function () {
  describe('ipx.parsev4()', function () {
    it('should return (0, 0, 255) for ("0.0.0.0", "256")', function () {return (
        (0, _chai.expect)(_ipx2['default'].parsev4('0.0.0.0', '256')).to.deep.equal({
          start: '0',
          end: '255',
          diff: '256' }));});



  });
  describe('ipx.parsev6()', function () {
    it('should return (0, 0, 1) for ("::", "/128")', function () {return (
        (0, _chai.expect)(_ipx2['default'].parsev6('::', '128')).to.deep.equal({
          start: '0',
          end: '0',
          diff: '1' }));});



  });
});