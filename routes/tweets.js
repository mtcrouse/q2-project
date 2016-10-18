'use strict';

const express = require('express');
var Twitter = require('twitter');

// eslint-disable-next-line new-cap
const router = express.Router();

var client = new Twitter({
  consumer_key: 'tZSJ5ZiluwuAMrd8ihMHIxVcn',
  consumer_secret: 'AIf3u6l0i3Ms0brXNdwVthebbnbb4yAxLOASnb6giA8S4PdjHJ',
  access_token_key: '2660235607-h2AZhOaTY800pBxPsl0EtlMQS8lF6ml3gJLCbLq',
  access_token_secret: 'XKbQ7vQylXlPk19tnujmn1OAyiiUeCE2fp2yX8jj5mTfa'
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

  client.get('search/tweets', {q: searchid}, function(error, tweet, response) {
    if (error) {
      throw error;
    }

    res.send(tweet);
  });
});

module.exports = router;
