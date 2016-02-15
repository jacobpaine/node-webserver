'use strict';

const express = require('express');
const router = express.Router();

const News = require('../models/news');

router.get('/', (req, res) => {
  News.findOne().sort('-_id').exec((err, doc) => {
    if (err) throw err;

    doc = doc || {top: ['']};

    res.render('index', {
      date: new Date(),
      topStory: doc.top[0]
    });
  });
});

module.exports = router;
