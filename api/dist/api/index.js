Object.defineProperty(exports, "__esModule", { value: true });var _express = require('express');var _express2 = _interopRequireDefault(_express);
var _logs = require('./routes/logs');var _logs2 = _interopRequireDefault(_logs);
var _jobs = require('./routes/jobs');var _jobs2 = _interopRequireDefault(_jobs);
var _stats = require('./routes/stats');var _stats2 = _interopRequireDefault(_stats);
var _delegations = require('./routes/delegations');var _delegations2 = _interopRequireDefault(_delegations);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var router = new _express2['default'].Router();

router.get('/logs', _logs2['default']);
router.get('/jobs', _jobs2['default']);
router.get('/stats', _stats2['default']);
router.get('/delegations/new/single', _delegations2['default']['new'].single);
router.get('/delegations/new/range', _delegations2['default']['new'].range);
router.get('/delegations/total/single', _delegations2['default'].total.single);exports['default'] =

router;