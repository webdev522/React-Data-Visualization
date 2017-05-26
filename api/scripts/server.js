import Promise from 'bluebird';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import favicon from 'serve-favicon';
import hbs from 'express-handlebars';
import http from 'http';
import path from 'path';
import api from './api';
import docs from './docs';

let server;
let app;

const createExpress = () => Promise.try(() => {
  app = express();
  server = http.createServer(app);
});

const setupExpress = () => Promise.try(() => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Credentials', 'true');
    // res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    // res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Content-Type, Origin');
    next();
  });
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(log.express);
  app.set('views', './views');
  app.engine('hbs', hbs({
    extname: '.hbs',
    layoutsDir: './views/layouts/',
    partialsDir: './views/partials/',
    defaultLayout: 'main',
  }));
  app.set('view engine', 'hbs');
  app.use('/assets', express.static(path.resolve('./assets')));
  app.use(favicon(path.resolve('./assets/favicon.ico')));
  app.use('/', api);
  app.use('/docs', docs);
  app.all('*', (req, res, next) => {
    const err = new Error();
    err.status = 404;
    next(err);
  });
  app.use((err, req, res, next) => {
    const code = err.status || 500;
    res.status(code).render('error', {
      version: process.env.npm_package_version,
    });
  });
});

const startServer = port => new Promise((resolve, reject) => {
  server.listen(port, err => (err ? reject(err) : resolve(port)));
});

const start = port => Promise.try(() => createExpress())
  .then(setupExpress)
  .then(() => startServer(port))
  .then(() => log.info(`Started server at port ${port}.`))
  .catch(err => log.error(err));

const stop = () => Promise.resolve()
  .then(server.close());

export default {
  start,
  stop,
};
