'use strict';

const express = require('express');
const router = express.Router();

const request = require('request');
const _ = require('lodash');
const cheerio = require('cheerio');

const AllCaps = require('../models/allcaps');
const News = require('../models/news');

router.get('/api', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send({hello: 'world'});
});

router.post('/api', (req, res) => {
  const obj = _.mapValues(req.body, val => val.toUpperCase());

  const caps = new AllCaps(obj);

  caps.save((err, _caps) => {
    if (err) throw err;

    res.send(_caps);
  });
});

router.get('/api/weather', (req, res) => {
  const API_KEY = '00c2032f84f5e9393b7a1eda02d49228';
  const url = `https://api.forecast.io/forecast/${API_KEY}/37.8267,-122.423`;

  request.get(url, (err, response, body) => {
    if (err) throw err;

    res.header('Access-Control-Allow-Origin', '*');
    res.send(JSON.parse(body));
  });
});

router.get('/api/news', (req, res) => {
  News.findOne().sort('-_id').exec((err, doc) => {
    if (err) throw err;

    if (doc) {
      const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
      const diff = new Date() - doc._id.getTimestamp() - FIFTEEN_MINUTES_IN_MS;
      const lessThan15MinutesAgo = diff < 0;

      if (lessThan15MinutesAgo) {
        res.send(doc);
        return;
      }
    }

    const url = 'http://cnn.com';

    request.get(url, (err, response, html) => {
      if (err) throw err;

      const news = [];
      const $ = cheerio.load(html);

      const $bannerText = $('.banner-text');

      news.push({
        title: $bannerText.text(),
        url: url + $bannerText.closest('a').attr('href')
      });

      const $cdHeadline = $('.cd__headline');

      _.range(1, 12).forEach(i => {
        const $headline = $cdHeadline.eq(i);

        news.push({
          title: $headline.text(),
          url: url + $headline.find('a').attr('href')
        });
      });

      const obj = new News({ top: news });

      obj.save((err, _news) => {
        if (err) throw err;

        res.send(_news);
      });
    });
  });
});

module.exports = router;
