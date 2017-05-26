Object.defineProperty(exports, "__esModule", { value: true });var _mongo = require('../../mongo');var _mongo2 = _interopRequireDefault(_mongo);
var _economies = require('../../utils/economies');var _economies2 = _interopRequireDefault(_economies);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var stats = function stats(req, res) {return _mongo2['default'].fetchFullStats().
  then(function (result) {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', 0);
    if (result) {
      res.json({
        sucess: true,
        version: process.env.npm_package_version,
        statistics: result,
        economies: _economies2['default'].list });

    } else {
      res.json({
        sucess: false,
        version: process.env.npm_package_version,
        error: 'Statistics are not ingested yet.' });

    }
  });};exports['default'] =

stats;