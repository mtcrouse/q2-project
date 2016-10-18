'use strict';

const boom = require('boom');
const express = require('express');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

// const ev = require('express-validation');
// const validations = require('../validations/favorites');

// const authorize = function(req, res, next) {
//   jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       res.verify = false;

//       return next(boom.create(401, 'Unauthorized'));
//     }

//     res.verify = true;
//     req.token = decoded;

//     next();
//   });
// };

router.post('/searches_users', (req, res, next) => {

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
