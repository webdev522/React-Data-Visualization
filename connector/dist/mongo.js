Object.defineProperty(exports, "__esModule", { value: true });

var _mongodb = require('mongodb');var _mongodb2 = _interopRequireDefault(_mongodb);
var _momentTimezone = require('moment-timezone');var _momentTimezone2 = _interopRequireDefault(_momentTimezone);
var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var client = _mongodb2['default'].MongoClient; // MongoDB client utilities and queries.

_bluebird2['default'].promisifyAll(client);

var db = void 0;

// Connect to MongoDB instance.
var connect = function connect() {return _bluebird2['default']['try'](function () {
    if (db) {
      return db;
    }
    var url = void 0;
    if (cfg.MONGO_USER && cfg.MONGO_PASS) {
      url = 'mongodb://' + String(cfg.MONGO_USER) + ':' + String(cfg.MONGO_PASS) + '@' + String(cfg.MONGO_HOST) + ':' + String(cfg.MONGO_PORT) + '/' + String(cfg.MONGO_NAME) + '?authSource=admin';
    } else {
      url = 'mongodb://' + String(cfg.MONGO_HOST) + ':' + String(cfg.MONGO_PORT) + '/' + String(cfg.MONGO_NAME);
    }
    var options = { promiseLibrary: _bluebird2['default'] };
    return client.connect(url, options).
    then(function (connection) {
      log.info('Successfully connected to MongoDB.');
      db = connection;
      return db;
    });
  });};

// Disconnect from MongoDB instance.
var disconnect = function disconnect() {return _bluebird2['default']['try'](function () {
    if (db) {
      return db.close().then(function () {
        db = undefined;
        log.info('Disconnected from MongoDB.');
      });
    }
  });};

// Clean old stats.
var clean = function clean() {return _bluebird2['default']['try'](function () {return connect();}).
  then(function () {return db.collection('stats').drop();})['catch'](
  function () {return _bluebird2['default'].resolve();});};

// Invalidate all started jobs.
var invalidateJobs = function invalidateJobs() {return _bluebird2['default']['try'](function () {return connect();}).
  then(function () {return db.collection('jobs').updateMany(
    { status: 'started' },
    {
      $set: {
        status: 'failed',
        endedAt: _momentTimezone2['default'].utc().toDate() } });}).



  then(function (response) {return response.result.n || 0;});};

// Get all jobs.
var getAllJobs = function getAllJobs() {return _bluebird2['default']['try'](function () {return connect();}).
  then(function () {return db.collection('jobs').
    find().
    sort({ $natural: -1 }).
    toArray();});};


// Start a job.
var startJob = function startJob() {return _bluebird2['default']['try'](function () {return connect();}).
  then(function () {return db.collection('jobs').insertOne({
      startedAt: _momentTimezone2['default'].utc().toDate(),
      status: 'started' });}).

  then(function (response) {return response.ops[0];});};

// End a job.
var failJob = function failJob(id) {return _bluebird2['default']['try'](function () {return connect();}).
  then(function () {return db.collection('jobs').findOneAndUpdate(
    { _id: id },
    {
      $set: {
        status: 'failed',
        endedAt: _momentTimezone2['default'].utc().toDate() } },


    { returnOriginal: false });}).

  then(function (response) {return response.value;});};

// Complete a job.
var completeJob = function completeJob(id, files) {return _bluebird2['default']['try'](function () {return connect();}).
  then(function () {return db.collection('jobs').findOneAndUpdate(
    { _id: id },
    {
      $set: {
        status: 'completed',
        files: files,
        endedAt: _momentTimezone2['default'].utc().toDate() } },


    { returnOriginal: false });}).

  then(function (response) {return response.value;});};

// Save statistics data.
var saveStats = function saveStats(data) {return _bluebird2['default']['try'](function () {return connect();}).
  then(function () {return db.collection('stats').
    replaceOne({ _id: data._id }, data, { upsert: true });}).

  then(function (result) {return result.ops[0];});};

// Find statistics by filename.
var findByFilename = function findByFilename(filename) {return _bluebird2['default']['try'](function () {return connect();}).
  then(function () {return db.collection('stats').findOne({ filename: filename });});};exports['default'] =

{
  connect: connect,
  disconnect: disconnect,
  clean: clean,
  invalidateJobs: invalidateJobs,
  getAllJobs: getAllJobs,
  startJob: startJob,
  failJob: failJob,
  completeJob: completeJob,
  saveStats: saveStats,
  findByFilename: findByFilename };