'use strict';

const boom = require('boom');
const bcrypt = require('bcrypt-as-promised');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

const ev = require('express-validation');
const validations = require('../validations/token');

const router = express.Router();

const authorize = function(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.verify = false;
    } else {
      res.verify = true;
    }

    next();
  });
};


router.delete('/token', (req, res, next) => {
  res.clearCookie('token');
  res.status(200);
  res.send('true');
});
router.get('/token', authorize, (req, res, next) => {
  res.send(res.verify);
});

router.post('/token', /*ev(validations.post),*/ (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return next(boom.create(400, 'Email must not be blank'));
  }

  if (!password || password.length < 8) {
    return next(boom.create(400, 'Password must not be blank'));
  }

  let user;

  knex('users')
    .where('email', email)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(400, 'Bad username or password');
      }

      user = camelizeKeys(row);

      return bcrypt.compare(password, user.hashedPassword);
    })
    .then(() => {
      delete user.hashedPassword;

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

      res.cookie('token', token, {
        httpOnly: true,
        secure: router.get('env') === 'production'
      });

      res.send(user);
    })
    .catch(bcrypt.MISMATCH_ERROR, () => {
      throw boom.create(400, 'Bad username or password');
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
