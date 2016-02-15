'use strict';

const express = require('express');
const router = express.Router();

const api = require('./api');
const contact = require('./contact');
const hello = require('./hello');
const home = require('./home');
const random = require('./random');
const secret = require('./secret');
const sendphoto = require('./sendphoto');

router.use(api);
router.use(contact);
router.use(hello);
router.use(home);
router.use(random);
router.use(secret);
router.use(sendphoto);

module.exports = router;
