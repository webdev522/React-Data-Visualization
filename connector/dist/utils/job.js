Object.defineProperty(exports, "__esModule", { value: true });

var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _ftp = require('./ftp');var _ftp2 = _interopRequireDefault(_ftp);
var _mongo = require('../mongo');var _mongo2 = _interopRequireDefault(_mongo);
var _zip = require('./zip');var _zip2 = _interopRequireDefault(_zip);
var _fsx = require('./fsx');var _fsx2 = _interopRequireDefault(_fsx);
var _rir = require('./rir');var _rir2 = _interopRequireDefault(_rir);
var _csv = require('./csv');var _csv2 = _interopRequireDefault(_csv);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

// Check is there job in progress.
var checkProgress = function checkProgress(jobs) {return (
    _lodash2['default'].find(jobs, function (job) {return job.state === 'progress';}) || false);};

// Find all the processed files in jobs.
// Data sychronization job logic.
var findProcessedFiles = function findProcessedFiles(jobs) {var files = [];
  _lodash2['default'].each(jobs, function (job) {
    if (job.status === 'completed') {
      files = _lodash2['default'].concat(files, job.files);
    }
  });
  return files;
};

// Find last processed date.
var findLastDate = function findLastDate(jobs) {return _bluebird2['default']['try'](function () {
    var files = findProcessedFiles(jobs);
    if (files.length === 0) {
      return undefined;
    }
    return _path2['default'].basename((0, _lodash2['default'])(files).
    sortBy(function (file) {return _rir2['default'].filenameToDate(file);}).
    last());
  }).
  then(function (lastFile) {
    if (lastFile === undefined) {
      return { _id: cfg.CSV_FIRST_DATE };
    }
    return _mongo2['default'].findByFilename(lastFile);
  });};

// Find unprocessed files.
var findUnprocessedFiles = function findUnprocessedFiles(archives, commas) {return (
    _lodash2['default'].differenceWith(archives, commas, function (archive, comma) {return (
        _path2['default'].basename(archive, '.gz') === _path2['default'].basename(comma, '.csv'));}));};

// Deduplicate FTP archives by "extended" > "ancient" preference.
var deduplicateArchives = function deduplicateArchives(files) {
  var ancient = (0, _lodash2['default'])(files).
  filter(function (file) {return _rir2['default'].detectFormat(_path2['default'].basename(file)) === 'ancient';}).
  map(function (file) {return {
      file: file,
      date: _rir2['default'].filenameToDate(file) };}).

  value();

  var extended = (0, _lodash2['default'])(files).
  filter(function (file) {return _rir2['default'].detectFormat(_path2['default'].basename(file)) === 'extended';}).
  map(function (file) {return {
      file: file,
      date: _rir2['default'].filenameToDate(file) };}).

  value();

  var union = _lodash2['default'].unionBy(extended, ancient, function (entry) {return entry.date;});

  return _lodash2['default'].map(union, function (entry) {return entry.file;});
};

// CSV parsing chain.
var interpretCsv = function interpretCsv(last, filepath) {return _bluebird2['default']['try'](function () {return _csv2['default'].readCsv(filepath);}).
  then(function (content) {return _csv2['default'].parseCsv(filepath, content);}).
  then(function (data) {return _csv2['default'].deriveStats(last, data);}).
  then(function (data) {return _mongo2['default'].saveStats(data).
    then(function () {return log.info('Interpreted ' + String(_path2['default'].basename(filepath)) + ' file.');}).
    then(function () {return data.header.endDate;});});};


// Run a job.
var runJob = function runJob() {return _bluebird2['default']['try'](function () {return _mongo2['default'].getAllJobs();}).
  then(function (jobs) {
    log.info('Checking job history.');
    var inProgress = checkProgress(jobs);
    if (inProgress) {
      log.warn('Job already in progress. Doing nothing.');
      return undefined;
    }
    log.info('No other jobs in progress.');

    return findLastDate(jobs).
    then(function (lastDate) {return _mongo2['default'].startJob().
      then(function (job) {
        log.info('Started job with id ' + String(job._id) + '.');
        return _ftp2['default'].mirror().
        then(function () {return _fsx2['default'].listFiles(cfg.FTP_LOCAL);}).
        then(function (files) {
          var filtered = _lodash2['default'].filter(files, function (file) {return (
              _fsx2['default'].hasExtension(file, '.gz') && !_fsx2['default'].isSystemFile(file));});

          log.info('Found ' + String(filtered.length) + ' non-system gzip files.');
          var processed = findProcessedFiles(jobs);
          var deduplicated = deduplicateArchives(filtered);
          return findUnprocessedFiles(deduplicated, processed);
        }).
        then(_zip2['default'].decompressArchives).
        then(function (files) {
          var paths = (0, _lodash2['default'])(files).
          map(function (file) {return _path2['default'].join(base, cfg.CSV_LOCATION, file);}).
          sortBy(function (file) {return _rir2['default'].filenameToDate(file);}).
          value();
          return _bluebird2['default'].reduce(paths, interpretCsv, lastDate._id).
          then(function () {return _mongo2['default'].completeJob(job._id, files);});
        }).
        then(function () {return log.info('Job with id ' + String(job._id) + ' completed.');})['catch'](
        function (err) {
          log.error('Error running the job.', err);
          return _mongo2['default'].failJob(job._id);
        });
      });});

  }).
  then(_mongo2['default'].disconnect)['catch'](
  function (err) {return log.error('MongoDB error.', err);});};exports['default'] =

{
  runJob: runJob };