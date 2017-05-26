// MongoDB client utilities and queries.

import mongodb from 'mongodb';
import moment from 'moment-timezone';
import Promise from 'bluebird';

const client = mongodb.MongoClient;

Promise.promisifyAll(client);

let db;

// Connect to MongoDB instance.
const connect = () => Promise.try(() => {
  if (db) {
    return db;
  }
  let url;
  if (cfg.MONGO_USER && cfg.MONGO_PASS) {
    url = `mongodb://${cfg.MONGO_USER}:${cfg.MONGO_PASS}@${cfg.MONGO_HOST}:${cfg.MONGO_PORT}/${cfg.MONGO_NAME}?authSource=admin`;
  } else {
    url = `mongodb://${cfg.MONGO_HOST}:${cfg.MONGO_PORT}/${cfg.MONGO_NAME}`;
  }
  const options = { promiseLibrary: Promise };
  return client.connect(url, options)
    .then((connection) => {
      log.info('Successfully connected to MongoDB.');
      db = connection;
      return db;
    });
});

// Disconnect from MongoDB instance.
const disconnect = () => Promise.try(() => {
  if (db) {
    return db.close().then(() => {
      db = undefined;
      log.info('Disconnected from MongoDB.');
    });
  }
});

// Clean old stats.
const clean = () => Promise.try(() => connect())
  .then(() => db.collection('stats').drop())
  .catch(() => Promise.resolve());

// Invalidate all started jobs.
const invalidateJobs = () => Promise.try(() => connect())
  .then(() => db.collection('jobs').updateMany(
    { status: 'started' },
    {
      $set: {
        status: 'failed',
        endedAt: moment.utc().toDate(),
      },
    },
  ))
  .then(response => response.result.n || 0);

// Get all jobs.
const getAllJobs = () => Promise.try(() => connect())
  .then(() => db.collection('jobs')
    .find()
    .sort({ $natural: -1 })
    .toArray(),
  );

// Start a job.
const startJob = () => Promise.try(() => connect())
  .then(() => db.collection('jobs').insertOne({
    startedAt: moment.utc().toDate(),
    status: 'started',
  }))
  .then(response => response.ops[0]);

// End a job.
const failJob = id => Promise.try(() => connect())
  .then(() => db.collection('jobs').findOneAndUpdate(
    { _id: id },
    {
      $set: {
        status: 'failed',
        endedAt: moment.utc().toDate(),
      },
    },
    { returnOriginal: false },
  ))
  .then(response => response.value);

// Complete a job.
const completeJob = (id, files) => Promise.try(() => connect())
  .then(() => db.collection('jobs').findOneAndUpdate(
    { _id: id },
    {
      $set: {
        status: 'completed',
        files,
        endedAt: moment.utc().toDate(),
      },
    },
    { returnOriginal: false },
  ))
  .then(response => response.value);

// Save statistics data.
const saveStats = data => Promise.try(() => connect())
  .then(() => db.collection('stats')
    .replaceOne({ _id: data._id }, data, { upsert: true }),
  )
  .then(result => result.ops[0]);

// Find statistics by filename.
const findByFilename = filename => Promise.try(() => connect())
  .then(() => db.collection('stats').findOne({ filename }));

export default {
  connect,
  disconnect,
  clean,
  invalidateJobs,
  getAllJobs,
  startJob,
  failJob,
  completeJob,
  saveStats,
  findByFilename,
};
