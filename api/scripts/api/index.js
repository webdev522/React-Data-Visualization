import express from 'express';
import logs from './routes/logs';
import jobs from './routes/jobs';
import stats from './routes/stats';
import delegations from './routes/delegations';

const router = new express.Router();

router.get('/logs', logs);
router.get('/jobs', jobs);
router.get('/stats', stats);
router.get('/delegations/new/single', delegations.new.single);
router.get('/delegations/new/range', delegations.new.range);
router.get('/delegations/total/single', delegations.total.single);

export default router;

