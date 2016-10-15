'use strict';

const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
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

router.get('/favorites_users/', /*authorize, */(req, res, next) => {
	// const { userId } = req.token;

	knex('favorites_users')
		.innerJoin('favorites', 'favorites.id', 'favorites_users.favorite_id')
		.innerJoin('users', 'users.id', 'favorites_users.user_id')
		.then((rows) => {
			const favoritesUsers = camelizeKeys(rows);

			res.send(favoritesUsers);
		})
		.catch((err) => {
			next(err);
		});
});;

router.get('/favorites_users/:id', /*authorize,*/(req, res, next) => {

});

router.post('/favorites_users/', /*authorize,*/(req, res, next) => {

});

router.patch('/favorites_users/', /*authorize,*/ (req, res, next) => {

});

router.delete('/favorites_users/delete:id', /*authorize,*/(req, res, next) => {

});

module.exports = router;