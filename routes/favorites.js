'use strict';

const boom = require('boom');
const express = require('express');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

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

router.post('/favorites', (req, res, next) => {
	// const { userId } = req.token
	const { searchId, count } = req.body;

	if ( searchId !== parseInt(searchId) || !searchId.trim() || typeof searchId !== 'number') {
		return next(boom.create(400, 'searchId must be an integer'))
	}

	knex('searches')
		.where('id', searchId)
		.first()
		.then((row) => {
			if (!row) {
				return next(boom.create(404, 'search not found'));
			}

			return knex('favorites')
				.insert({
					// user_id: userId,
					search_id: searchId
					}, '*');
		})
		.then((row) => {
			const favorite = camelizeKeys(rows[0]);

			res.send(favorite);
		})
		.catch((err) => {
			next(err);
		});
});

// router.get('/favorites', (req, res, next) => {

// })

// router.get('/favorites/:id', (req, res, next) => {

// })

// router.patch('favorites/:id', (req, res, next) => {

// })

// router.delete('favorites/:id', (req, res, next) => {

// })

module.exports = router;