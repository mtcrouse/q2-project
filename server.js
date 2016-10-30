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
const knex = require('./knex');
const fs = require('fs');
const natural = require('natural');

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('short'));

app.use(express.static(path.join('public')));

const users = require('./routes/users');
const searches = require('./routes/searches');
const favorites = require('./routes/favorites');
const searches_users = require('./routes/searches_users');
const favorites_users = require('./routes/favorites_users');
const tweets = require('./routes/tweets');
const token = require('./routes/token');

app.use(users);
app.use(searches);
app.use(favorites);
app.use(favorites_users);
app.use(tweets);
app.use(token);
app.use(searches_users);

app.use((_req, res) => {
  res.sendStatus(404);
});

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

let cities = fs.readFileSync('cities.txt', 'utf8', (err, data) => {
  if (err) throw err;
});

cities = cities.split(/\r?\n/);

io.on('connection', function(socket) {
  socket.on('streamingStart', function(testData) {
    let stream = client.stream('statuses/sample');
    stream.on('data', function(event) {
      if (event.text) {
        let maxScore = 0;
        let maxScorePopulation = 0;
        let bestGuess;
        let latitude;
        let longitude;

        if (event.user.location === '' || event.user.location === null) {
          bestGuess = null;
          maxScore = null;
          latitude = null;
          longitude = null;
        } else {
          for (let city of cities) {
            city = city.split('\t');
            cityName = city[1];
            cityLatitude = city[4];
            cityLongitude = city[5];
            let currentScore = natural.JaroWinklerDistance(event.user.location.split(',')[0].trim(), cityName);
            let currentScorePopulation = city[14];
            if (currentScore > maxScore || ((currentScore === maxScore) && (currentScorePopulation > maxScorePopulation))) {
              maxScore = currentScore;
              bestGuess = cityName;
              latitude = cityLatitude;
              longitude = cityLongitude;
            }
          }
        }

        io.emit('tweety', [event.text, event.user.location, bestGuess, maxScore, latitude, longitude]);
      }
     });

     stream.on('error', function(error) {
       console.log(error);
     });
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
    socket.emit('streamingError', true);
  });

  socket.on('error', function(){
    console.log('a socket.io error occurred');
    socket.emit('streamingError', true);
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
