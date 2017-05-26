var _appRootPath = require('app-root-path');var _appRootPath2 = _interopRequireDefault(_appRootPath);
var _chai = require('chai');var _chai2 = _interopRequireDefault(_chai);
var _chaiAsPromised = require('chai-as-promised');var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);
var _logger = require('../logger');var _logger2 = _interopRequireDefault(_logger);
var _config = require('../config');var _config2 = _interopRequireDefault(_config);
var _fsx = require('../utils/fsx');var _fsx2 = _interopRequireDefault(_fsx);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

_chai2['default'].use(_chaiAsPromised2['default']);

global.cfg = _config2['default'].create();
global.log = _logger2['default'].start();
global.base = _appRootPath2['default'].path;

describe('fsx', function () {
  describe('isSystemFile()', function () {
    it('should return "true" for ".AppleDB"', function () {return (
        (0, _chai.expect)(_fsx2['default'].isSystemFile('.AppleDB')).to.equal(true));});

    it('should return "true" for ".AppleDesktop"', function () {return (
        (0, _chai.expect)(_fsx2['default'].isSystemFile('.AppleDesktop')).to.equal(true));});

    it('should return "true" for ".AppleDouble"', function () {return (
        (0, _chai.expect)(_fsx2['default'].isSystemFile('.AppleDouble')).to.equal(true));});

    it('should return "true" for ".DocumentRevisions-V100"', function () {return (
        (0, _chai.expect)(_fsx2['default'].isSystemFile('.DocumentRevisions-V100')).to.equal(true));});

    it('should return "true" for ".DS_Store"', function () {return (
        (0, _chai.expect)(_fsx2['default'].isSystemFile('.DS_Store')).to.equal(true));});

    it('should return "true" for ".DS_Store.ext"', function () {return (
        (0, _chai.expect)(_fsx2['default'].isSystemFile('.DS_Store.ext')).to.equal(true));});

    it('should return "true" for ".LSOverride"', function () {return (
        (0, _chai.expect)(_fsx2['default'].isSystemFile('.LSOverride')).to.equal(true));});

    it('should return "true" for ".Spotlight-V100"', function () {return (
        (0, _chai.expect)(_fsx2['default'].isSystemFile('.Spotlight-V100')).to.equal(true));});

    it('should return "true" for ".Trashes"', function () {return (
        (0, _chai.expect)(_fsx2['default'].isSystemFile('.Trashes')).to.equal(true));});

    it('should return "true" for ".VolumeIcon.icns"', function () {return (
        (0, _chai.expect)(_fsx2['default'].isSystemFile('.VolumeIcon.icns')).to.equal(true));});

    it('should return "true" for ".apdisk"', function () {return (
        (0, _chai.expect)(_fsx2['default'].isSystemFile('.apdisk')).to.equal(true));});

    it('should return "true" for "fseventsd"', function () {return (
        (0, _chai.expect)(_fsx2['default'].isSystemFile('.fseventsd')).to.equal(true));});

    it('should return "true" for "Thumbs.db"', function () {return (
        (0, _chai.expect)(_fsx2['default'].isSystemFile('Thumbs.db')).to.equal(true));});

    it('should return "true" for "thumbs.db"', function () {return (
        (0, _chai.expect)(_fsx2['default'].isSystemFile('thumbs.db')).to.equal(true));});

    it('should return "true" for "ehthumbs.db"', function () {return (
        (0, _chai.expect)(_fsx2['default'].isSystemFile('.ththumbs.db')).to.equal(true));});

    it('should return "false" for "shalala.txt"', function () {return (
        (0, _chai.expect)(_fsx2['default'].isSystemFile('shalala.txt')).to.equal(false));});

  });
});

describe('fsx', function () {
  describe('uniqueFilenames()', function () {
    it('should return ["./foo/bar", "./foo/baz"] for ["./foo/bar", "./foo/baz", "./bar/baz"]', function () {return (
        (0, _chai.expect)(_fsx2['default'].uniqueFilenames([
        './foo/bar',
        './foo/baz',
        './bar/baz'])).
        to.deep.equal([
        './foo/bar',
        './foo/baz']));});


    it('should return ["./foo/bar", "./foo/baz"] for ["./foo/bar", "./foo/baz", "./foo/baz"]', function () {return (
        (0, _chai.expect)(_fsx2['default'].uniqueFilenames([
        './foo/bar',
        './foo/baz',
        './foo/baz'])).
        to.deep.equal([
        './foo/bar',
        './foo/baz']));});


  });
});