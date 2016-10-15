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
	// I need to add count
	// const { userId } = req.token
	const { searchId, count } = req.body;

	if ( !searchId.trim() || typeof Number(searchId) !== 'number') {
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
			const favorite = camelizeKeys(row[0]);

			res.send(favorite);
		})
		.catch((err) => {
			next(err);
		});
});

router.get('/favorites', /*authorize,*/ (req, res, next) => {
	// const { userId } = req.token;

	const userId = 1;

	if (req.body.length > 0) {
		return next(boom.creat(400, 'Bad query: set :id in route'));
	}

	knex('favorites')
		.innerJoin('searches', 'searches.id', 'favorites.search_id')
		.then((rows) => {
			const favorites = camelizeKeys(rows);

			res.send(favorites);
		})
		.catch((err) => {
			next(err);
		});
});

router.get('/favorites/:id', /*authorize,*/ (req, res, next) => {
	// const { userId } = req.token;

	const userId = 1;
	const favoriteId = req.params.id;
	console.log(favoriteId);

	if (!Number.isInteger(Number(favoriteId))) {
		return next(boom.create(400, 'favoriteId must be an integer'))
	}

	knex('favorites')
		.where('favorites.id', favoriteId)
		.first()
		.innerJoin('searches', 'searches.id', 'favorites.search_id')
		.then((row) => {
			if (!row) {
				res.status(200);
				res.send(`Favorite at id ${favoriteId} does not exist`)
			} else {
				res.status(200);
				res.send(row);
			}
		})
		.catch((err) => {
			next(err);
		});
});

router.patch('/favorites/:id', /* authorize,*/ (req, res, next) => {
	// const { userId } = req.token;
	// This works, but because of foreign key constraints no keys can
	// be patched.
	const body = req.body;
	const favoriteId = req.params.id;

	console.log(req.body);
	console.log(req.params.id);

	knex('favorites')
		.where('id', Number(req.params.id))
		.first()
		.then((favorite) => {
			if (favorite === [] || !favorite) {
				return next(boom.create(400, `Favorite ${favoriteId} not found`))
			} 
			else {
				console.log(favorite);
			}

			const { searchId, count } = req.body
			const updateFavorite = {}

			if (searchId) {
				updateFavorite.searchId = searchId;
			}

			if (count) {
				updateFavorite.count = count;
			}

			return knex('favorites')
				.update(decamelizeKeys(updateFavorite), '*')
				.where('id', req.params.id);
		})
		.then((row) => {
			res.send(camelizeKeys(row/*[0]*/));
		})
		.catch((err) => {
			next(err);			
		});
});

router.delete('/favorites/:id', /*authorize,*/ (req, res, next) => {
  // const { userId } = req.token;
  const favoriteId = req.params.id

	if(!Number(req.params.id)) {
		return next(boom.create(400, `No id provided or id ${id} is not an integer`))
	}

	let favorite;

	knex('favorites')
		.where('id', favoriteId)
		.first()
		.then((row) => {
			if (!row) {
				return next(boom.create(400, `No favorite exists at req.params.id ${id}`))
			}
			favorite = camelizeKeys(row);

			return knex('favorites')
				.where({
					id: favoriteId
				})
				.del()
		})
		.then(() => {
			delete favorite.id
			res.send(favorite)
		})
		.catch((err) => {
			next(err);
		});
});

module.exports = router;