'use strict';

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const ev = require('express-validation');
const validations = require('../validations/users');

const router = express.Router();

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

router.post('/users', ev(validations.post), (req, res, next) => {
  const { username, email, password } = req.body;

  // if (!username || !username.trim()) {
  //   return next(boom.create(400, 'Username must not be blank'));
  // }

  // if (!email || !email.trim() || email.length < 8) {
  //   return next(boom.create(400, 'Email must not be blank'));
  // }

  // if (!password || !password.trim()) {
  //   return next(boom.create(400, 'Password must not be blank'));
  // }

  bcrypt.hash(password, 12)
    .then((hashedPassword) => {
      const insertUser = { username, email, hashedPassword };

      return knex('users')
              .where('email', email)
              .first()
              .then((row) => {
                if (row) {
                  return next(boom.create(400, 'Email already exists'));
                }
              })
              .then(() => {
                return knex('users').insert(decamelizeKeys(insertUser), '*');
              });
    })
    .then((rows) => {
      const user = camelizeKeys(rows[0]);

      delete user.hashedPassword;

      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/users', (req, res, next) => {
  knex('users')
    .orderBy('id')
    .then((rows) => {
      const users = camelizeKeys(rows);

      res.send(users);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/users/:id', /*authorize,*/ (req, res, next) => {
  // const { userId } = req.token;
  const { id } = req.params;

  knex('users')
    .where('id', id)
    .first()
    .then((row) => {
      if (!row) {
        return next(boom.create(400, `No user at id ${id}`));
      }

      res.send(camelizeKeys(row));
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/users/:id', (req, res, next) => {
  // const { userId } = req.token
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  knex('users')
    .where('id', id)
    .first()
    .then((user) => {
      if (!user) {
        return next(boom.create(404, 'Not Found'));
      }

      const { username, email, password } = req.body;
      const updateUser = {};

      if (username) {
        updateUser.username = username;
      }

      if (email) {
        updateUser.email = email;
      }

      if (password) {
        bcrypt.hash(password, 12).
          then((hashedPassword) => {
            updateUser.hashedPassword = hashedPassword;

            return knex('users')
              .update(decamelizeKeys(updateUser))
              .where('id', id);
          })
          .catch((err) => {
            next(err);
          });
      } else {
        return knex('users')
          .update(decamelizeKeys(updateUser))
          .where('id', id);
      }
    })
    .then((row) => {
      const user = camelizeKeys(row[0]);
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/users', (req, res, next) => {
  const { userId } = req.token;
  let user;

  const { username } = req.body;

  knex('users')
    .where('username', username)
    .first()
    .then((row) => {
      if (!row) {
        return next(boom.create(404, `User not found at id ${username}`));
      }

      if (userId !== Number(row.user_id)) {
        return next(boom.create(400, `userId ${userId} and row.user_id ${row.user_id} fail strictly equal.`));
      }

      user = camelizeKeys(row);

      return knex('users')
        .del()
        .where('username', username);
    })
    .then(() => {
      delete user.id;
      delete user.hashedPassword;
      delete user.updatedAt;
      // TODO: Do we need this?
      // res.clearCookie('users');
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
