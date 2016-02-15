'use strict';

const express = require('express');
const router = express.Router();

const api = require('./routes/api');
const contact = require('./routes/contact');
const hello = require('./routes/hello');
const home = require('./routes/home');
const random = require('./routes/random');
const secret = require('./routes/secret');
const sendphoto = require('./routes/sendphoto');

router.use(api);
router.use(contact);
router.use(hello);
router.use(home);
router.use(random);
router.use(secret);
router.use(sendphoto);

module.exports = router;
