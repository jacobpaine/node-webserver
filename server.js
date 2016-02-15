'use strict';

const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes/');
const PORT = process.env.PORT || 3000;

const MONGODB_HOST = process.env.MONGODB_URL || 'localhost';
const MONGODB_PORT = process.env.MONGODB_PORT || 27017;
const MONGODB_USER = process.env.MONGODB_USER || '';
const MONGODB_PASS = process.env.MONGODB_PASS || '';
const MONGODB_DB = 'node-webserver';
const MONGODB_NAME = process.env.MONGODB_NAME  || 'node-webserver';

const MONGODB_URL_PREFIX = MONGODB_USER
  ? `${MONGODB_USER}:${MONGODB_PASS}@`
  : '';

const MONGODB_URL = `mongodb://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_NAME}`;

app.set('view engine', 'jade');

app.locals.title = 'THE Super Cool App';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);

mongoose.connect(MONGODB_URL);

mongoose.connection.on('open', () => {
  app.listen(PORT, () => {
    console.log(`Node.js server started. Listening on port ${PORT}`);
  });
});
