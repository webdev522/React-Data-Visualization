import express from 'express';

const router = new express.Router();

router.get('/', (req, res) => {
  res.render('docs', {
    version: process.env.npm_package_version,
  });
});

export default router;

