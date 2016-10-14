'use strict';

const boom = require('boom');
const express = require('express');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/searches', (req, res, next) => {
  knex('searches')
    .orderBy('id')
    .then((rows) => {
      const searches = camelizeKeys(rows);

      res.send(searches);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/searches', (req, res, next) => {
  const { searchTerm } = req.body;
  const count = 1;

  if (!searchTerm || !searchTerm.trim()) {
    return next(boom.create(400, 'SearchTerm must not be blank'));
  }

  const insertSearch = { searchTerm };

  return knex('searches')
    .where('search_term', searchTerm)
    .first()
    .then((row) => {
      if (row) {
        let existingCount = row.count;
        existingCount += 1;
        insertSearch.count = existingCount;
        return knex('searches')
          .update(decamelizeKeys(insertSearch))
          .where('search_term', searchTerm);
      } else {
        insertSearch.count = count;
        return knex('searches').insert(decamelizeKeys(insertSearch), '*');
      }
    })
    .then(() => {
      res.send(insertSearch);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
