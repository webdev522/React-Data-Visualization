Object.defineProperty(exports, "__esModule", { value: true });var _express = require('express');var _express2 = _interopRequireDefault(_express);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var router = new _express2['default'].Router();

router.get('/', function (req, res) {
  res.render('docs', {
    version: process.env.npm_package_version });

});exports['default'] =

router;