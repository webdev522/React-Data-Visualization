Object.defineProperty(exports, "__esModule", { value: true });var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);
var _bodyParser = require('body-parser');var _bodyParser2 = _interopRequireDefault(_bodyParser);
var _cookieParser = require('cookie-parser');var _cookieParser2 = _interopRequireDefault(_cookieParser);
var _express = require('express');var _express2 = _interopRequireDefault(_express);
var _serveFavicon = require('serve-favicon');var _serveFavicon2 = _interopRequireDefault(_serveFavicon);
var _expressHandlebars = require('express-handlebars');var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);
var _http = require('http');var _http2 = _interopRequireDefault(_http);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _api = require('./api');var _api2 = _interopRequireDefault(_api);
var _docs = require('./docs');var _docs2 = _interopRequireDefault(_docs);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var server = void 0;
var app = void 0;

var createExpress = function createExpress() {return _bluebird2['default']['try'](function () {
    app = (0, _express2['default'])();
    server = _http2['default'].createServer(app);
  });};

var setupExpress = function setupExpress() {return _bluebird2['default']['try'](function () {
    app.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      // res.header('Access-Control-Allow-Credentials', 'true');
      // res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
      // res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Content-Type, Origin');
      next();
    });
    app.use((0, _cookieParser2['default'])());
    app.use(_bodyParser2['default'].json());
    app.use(_bodyParser2['default'].urlencoded({
      extended: true }));

    app.use(log.express);
    app.set('views', './views');
    app.engine('hbs', (0, _expressHandlebars2['default'])({
      extname: '.hbs',
      layoutsDir: './views/layouts/',
      partialsDir: './views/partials/',
      defaultLayout: 'main' }));

    app.set('view engine', 'hbs');
    app.use('/assets', _express2['default']['static'](_path2['default'].resolve('./assets')));
    app.use((0, _serveFavicon2['default'])(_path2['default'].resolve('./assets/favicon.ico')));
    app.use('/', _api2['default']);
    app.use('/docs', _docs2['default']);
    app.all('*', function (req, res, next) {
      var err = new Error();
      err.status = 404;
      next(err);
    });
    app.use(function (err, req, res, next) {
      var code = err.status || 500;
      res.status(code).render('error', {
        version: process.env.npm_package_version });

    });
  });};

var startServer = function startServer(port) {return new _bluebird2['default'](function (resolve, reject) {
    server.listen(port, function (err) {return err ? reject(err) : resolve(port);});
  });};

var start = function start(port) {return _bluebird2['default']['try'](function () {return createExpress();}).
  then(setupExpress).
  then(function () {return startServer(port);}).
  then(function () {return log.info('Started server at port ' + String(port) + '.');})['catch'](
  function (err) {return log.error(err);});};

var stop = function stop() {return _bluebird2['default'].resolve().
  then(server.close());};exports['default'] =

{
  start: start,
  stop: stop };