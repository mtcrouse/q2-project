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

let cities = fs.readFileSync('cities.txt', 'utf8', (err, data) => {
  if (err) throw err;
});

cities = cities.split(/\r?\n/);

router.get('/tweets/:searchid', (req, res, next) => {
  const searchid = req.params.searchid;

  client.get('search/tweets', {q: searchid, count: 100}, function(error, tweets, response) {
    if (error) throw error;

    let tweetList = [];

    for (let tweet of tweets.statuses) {
      let maxScore = 0;
      let maxScorePopulation = 0;
      let bestGuess;
      let latitude;
      let longitude;

      if (tweet.user.location === '' || tweet.user.location === null) {
        bestGuess = null;
        maxScore = null;
        latitude = null;
        longitude = null;
      } else {
        for (let row of cities) {
          row = row.split('\t');
          let currentScore = natural.JaroWinklerDistance(tweet.user.location.split(',')[0].trim(), row[1]);
          let currentScorePopulation = row[14];
          if (currentScore > maxScore || ((currentScore === maxScore) && (currentScorePopulation > maxScorePopulation))) {
            maxScore = currentScore;
            bestGuess = row[1];
            latitude = row[4];
            longitude = row[5];
          }
        }
      }

      tweetList.push([tweet.text, tweet.user.location, bestGuess, maxScore, latitude, longitude]);
    }

    res.send(tweetList);
  });
});

module.exports = router;
