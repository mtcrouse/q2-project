'use strict';

const express = require('express');
var Twitter = require('twitter');

// eslint-disable-next-line new-cap
const router = express.Router();

var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});

router.get('/tweets/stream', (req, res, next) => {
  var stream = client.stream('statuses/sample');
  stream.on('data', function(event) {
    // console.log(event && event.text);
    if (event.text) {
        console.log(event.text);
    }
  });

  stream.on('error', function(error) {
    throw error;
  });
});

router.get('/tweets/:searchid', (req, res, next) => {
  const searchid = req.params.searchid;

  client.get('search/tweets', {q: searchid, count: 100}, function(error, tweet, response) {
    if (error) {
      throw error;
    }

    res.send(tweet);
  });
});

module.exports = router;
