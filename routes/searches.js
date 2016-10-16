'use strict';

const boom = require('boom');
const express = require('express');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/searches', (req, res, next) => {
  const { searchTerm } = req.body;

  if (!searchTerm || !searchTerm.trim()) {
    return next(boom.create(400, 'SearchTerm must not be blank'));
  }

  return knex('searches')
    .where('search_term', searchTerm)
    .first()
    .then((row) => {
      if (row) {
        return next(boom.create(400, 'Search already exists'));
      }
    })
    .then(() => {
      return knex('searches').insert(decamelizeKeys(searchTerm), '*');
    })
    .then((rows) => {
      const currentSearch = camelizeKeys(rows[0]);

      res.send(currentSearch);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/searches', /*authorize,*/, (req, res, next) => {
  
})

router.get('/searches/:id', /*authorize,*/, (req, res, next) => {

})

router.post('/searches', /*authorize,*/, (req, res, next) => {

})

router.patch('/searches/:id', /*authorize,*/, (req, res, next) => {

})

router.delete('/searches/:id', /*authorize,*/, (req, res, next) => {

})

module.exports = router;
