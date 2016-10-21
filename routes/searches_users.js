'use strict';

const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

const ev = require('express-validation');
const validations = require('../validations/favorites');

const authorize = function(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.verify = false;

      return next(boom.create(401, 'Unauthorized'));
    }

    res.verify = true;
    req.token = decoded;

    next();
  });
};

router.post('/searches_users', authorize, (req, res, next) => {
  const { userId } = req.token; 

  // ev(validations)
  // if (!favoriteId || !favoriteId.trim() || Number(favoriteId) !== Number.parseInt(Number(favoriteId))) {
  //  throw boom.create(400, `favoriteId ${favoriteid} is blank or not an integer`)
  // }

  knex('searches').max('id').first()
    .then((row) => {
      const searchId = Number(row.max);
        const newEntry = { userId: userId, searchId: searchId };

        knex('searches_users')
          .insert (decamelizeKeys(newEntry), '*')
          .then((rows) => {
            res.send(decamelizeKeys(newEntry))
          })
          .catch((err) => {
            next(err);
          });
    })
    .catch((err) => {
      next(err)
    })


});

router.get('/searches_users', /*authorize,*/ (req, res, next) => {
  
})

router.get('/searches_users/:id', /*authorize,*/ (req, res, next) => {

})

router.post('/searches_users', /*authorize,*/ (req, res, next) => {

})

router.patch('/searches_users/:id', /*authorize,*/ (req, res, next) => {

})

router.delete('/searches_users/:id', /*authorize,*/ (req, res, next) => {

})

module.exports = router;
