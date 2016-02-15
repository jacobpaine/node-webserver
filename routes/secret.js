'use strict';

const express = require('express');
const router = express.Router();

router.get('/secret', (req, res) => {
  res
    .status(403)
    .send('Access Denied!');
});

module.exports = router;
