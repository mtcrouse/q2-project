'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const Twitter = require('twitter');
const natural = require('natural');
const fs = require('fs');

// eslint-disable-next-line new-cap
const router = express.Router();

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

router.get('/tweets/:searchid', (req, res, next) => {
  const searchid = req.params.searchid;
  let responseArray = [];

  fs.readFile('cities15000.txt', 'utf8', (err, data) => {
    if (err) throw err;
    let rows = data.split(/\r?\n/);

    client.get('search/tweets', {q: searchid, count: 50}, function(error, tweets, response) {
      if (error) {
        throw error;
      }
      for (let tweet of tweets.statuses) {
        let maxScore = 0;
        let bestGuess;

        for (let row of rows) {
          row = row.split('\t');
          if (row[1]) {
            let currentScore = natural.JaroWinklerDistance(tweet.user.location, row[1]);
            if (currentScore > maxScore) {
              maxScore = currentScore;
              bestGuess = row[1];
            }
          }
        }
        responseArray.push([tweet.text, tweet.user.location, bestGuess]);
        if (responseArray.length === tweets.statuses.length) {
          res.send(responseArray);
        }
      }
    });
  });
});

module.exports = router;
