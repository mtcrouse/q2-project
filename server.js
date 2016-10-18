'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const Twitter = require('twitter');

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('short'));

app.use(express.static(path.join('public')));

// TODO: Make sure this works when uncommented
// CSRF protection
app.use((req, res, next) => {
  if (/json/.test(req.get('Accept'))) {
    return next();
  }

  res.sendStatus(406);
});

const users = require('./routes/users');
const searches = require('./routes/searches');
const favorites = require('./routes/favorites');
const searches_users = require('./routes/searches_users');
const favorites_users = require('./routes/favorites_users');
const tweets = require('./routes/tweets');

app.use(users);
app.use(searches);
app.use(favorites);
app.use(favorites_users);
app.use(tweets);
// app.use(searches_users);

app.use((_req, res) => {
  res.sendStatus(404);
});

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

io.on('connection', function(socket){

  var stream = client.stream('statuses/sample');
  stream.on('data', function(event) {
    if (event.text) {
        io.emit('tweety', event.text);
    }
  });

  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
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

http.listen(port, () => {
  if (app.get('env') !== 'test') {
    // eslint-disable-next-line no-console
    console.log('Listening on port', port);
  }
});

module.exports = app;
