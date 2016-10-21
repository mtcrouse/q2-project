'use strict';

const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

const ev = require('express-validation');
const validations = require('../validations/favorites');

// eslint-disable-next-line new-cap
const router = express.Router();

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

// I need to add count
router.post('/favorites', authorize, /*ev(validations.post),*/ (req, res, next) => {
	// const { userId } = req.token;
	const { searchId } = req.body;
	const { tweet } = req.body;
	const count = 1;

	// ev(validations)
	// if ( !searchId || !searchId.trim()) {
	// 	return next(boom.create(400, 'no searchId'))
	// }

	knex('searches')
		.where('id', searchId)
		.first()
		.then((row) => {
			if (!row) {
				return next(boom.create(404, `search not found at id ${searchId}`));
			}

			return knex('favorites')
				.insert({
					search_id: searchId,
					tweet: tweet
					}, '*');
		})
		.then((row) => {
			// FIX ME
			// knex('favorites_users')
			// 	.insert({favorite_id: row.id, user_id: userId}, '*');

			const favorite = camelizeKeys(row[0]);

			res.send(favorite);
		})
		.catch((err) => {
			next(err);
		});

});

// Returns all favorites.
router.get('/favorites', (req, res, next) => {
	if (req.body.length > 0) {
		return next(boom.creat(400, `Bad query. Set :id in url.`));
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

// Returns all instances of a favorite with userId n
router.get('/favorites/ucheck', authorize, /*ev(validations.ucheck),*/ (req, res, next) => {
	const { userId } = req.token;
	const { favoriteId } = req.body;

	// ev(validations)
	// if (isNaN(favoriteId)) {
	// 	return next(boom.create(400, `favoriteId (currently ${favoriteId}) must be an integer`))
	// }

	knex('users')
		.where('users.id', userId)
		.innerJoin('favorites_users', 'users.id', 'favorites_users.user_id')
		.innerJoin('favorites', 'favorites.id', 'favorites_users.favorite_id')
		.innerJoin('searches', 'favorites.search_id', 'searches.id')
		.then((rows) => {
			if (!rows || rows === []) {
				res.status(200);
				res.send(`Favorite at id ${favoriteId} does not exist`)
			} else {
				res.status(200);
				res.send(rows);
			}
		})
		.catch((err) => {
			next(err);
		});
});

// Returns all instances of favorite with favoriteId n
router.get('/favorites/fcheck', ev(validations.fcheck), (req, res, next) => {
	const favoriteId = Number(req.query.favoriteId);

	// if (isNaN(favoriteId)) {
	// 	return next(boom.create(400, `favoriteId (currently ${favoriteId}) must be an integer`))
	// }

	knex('favorites')
		.where('favorites.id', favoriteId)
		.innerJoin('searches', 'searches.id', 'favorites.search_id')
		.then((rows) => {
			if (!rows) {
				res.status(200);
				res.send(`Favorite at id ${favoriteId} does not exist`)
			} else {
				res.status(200);
				res.send(rows);
			}
		})
		.catch((err) => {
			next(err);
		});
});

router.patch('/favorites/:id', authorize, /*ev(validations.patch),*/ (req, res, next) => {
	const { userId } = req.token;
	const { searchId, count } = req.body;
	const favoriteId = Number(req.params.id);

	// if (isNaN(favoriteId)) {
	// 	return next(boom.create(400, `favoriteId (currently ${favoriteId} must be an integer`))
	// }

	// First check whether favoriteId belongs to user making query
	knex('favorites_users')
		.where({ favorite_id: favoriteId })
		.where({ user_id: userId })
		.first()
		.then((favorite) => {
			console.log()
			if (!favorite) {
				return next(boom.create(400, `Favorite ${favoriteId} not found for userId ${userId}`));
			} 

			return knex('favorites')
				.where('id', favoriteId)
				.first()
				.then((row) => {
					const updateFavorite = {};
					
					if (searchId) {
						updateFavorite.searchId = searchId;
					}

					if (count) {
						updateFavorite.count = count;
					}

					return knex('favorites')
					.update(decamelizeKeys(updateFavorite), '*')
					.where('id', favoriteId);
				})					
				.then((row) => {
					res.send(camelizeKeys(row/*[0]*/));
				})
		})
		.catch((err) => {
			next(err);			
		});
});

router.delete('/favorites/:id', authorize, (req, res, next) => {
	let favorite;
  const { userId } = req.token;
  const { favoriteId } = req.body

	if(typeof favoriteId !== 'number') {
		return next(boom.create(400, `favorite ${favoriteId} invalid, must be integer`))
	}

	knex('favorites')
		.where('id', favoriteId)
		.first()
		.then((row) => {
			if (!row) {
				return next(boom.create(400, `No favorite exists at id ${favoriteId}`));
			}

			if (userId !== Number(row.user_id)) {
				return next(boom.create(400, `userId ${userId} and row.user_id ${row.user_id} fail strictly equal.`));
			}

			favorite = camelizeKeys(row);

			return knex('favorites')
				.where({ id: favoriteId })
				.del();
		})
		.then(() => {
			delete favorite.id;
			res.send(favorite);
		})
		.catch((err) => {
			next(err);
		});
});

module.exports = router;