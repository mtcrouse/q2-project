'use strict';

const express = require('express');
var Twitter = require('twitter');

// eslint-disable-next-line new-cap
const router = express.Router();

var client = new Twitter({
  consumer_key: 'a3WChaKvcropKCKS1A8DKpnt4',
  consumer_secret: 'WcTHmQxMBhbUkFeX5JXUCll7kg2eC54Nl5it8ShyfKPbgKwHiv',
  access_token_key: '778483188498739201-bTUX93sgIOWxVKImc9tAlS6eOkqf57Y',
  access_token_secret: 'ZRtcn8iUyZsnVNCiphyAm8giaxhdk1EvWDri5cSJ961kq'
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
