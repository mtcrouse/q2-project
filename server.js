'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('short'));

const path = require('path');

app.use(express.static(path.join('public')));

const users = require('./routes/users');
const searches = require('./routes/searches');

app.use(users);
app.use(searches);

app.use((_req, res) => {
  res.sendStatus(404);
});

// eslint-disable-next-line max-params
app.use((err, _req, res, _next) => {
  if (err.output && err.output.statusCode) {
    return res
      .status(err.output.statusCode)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }

  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.sendStatus(500);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  if (app.get('env') !== 'test') {
    // eslint-disable-next-line no-console
    console.log('Listening on port', port);
  }
});

module.exports = app;
