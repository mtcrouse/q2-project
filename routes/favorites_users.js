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

router.post('/favorites_users/', /*authorize,*/(req, res, next) => {
	// const { userId } = req.token;
	// CHANGE THIS 
	const { favoriteId, userId } = req.body;

	if (!favoriteId || !favoriteId.trim() || Number(favoriteId) !== Number.parseInt(Number(favoriteId))) {
		throw boom.create(400, `favoriteId ${favoriteid} is blank or not an integer`)
	}

	if (!userId || !userId.trim() || Number(userId) !== Number.parseInt(Number(userId))) {
		throw boom.create(400, `userId ${userId} is blank or not an integer`)
	}

	const newEntry = { user_id: userId, favorite_id: favoriteId };

	knex('favorites_users')
		.insert (newEntry, '*')
		.then((rows) => {
			res.send(decamelizeKeys(newEntry))
		})
		.catch((err) => {
			next(err);
		})

});

// Get all favorites for a user
// Get a particular favorite for a user

router.get('/favorites_users/', /*authorize, */(req, res, next) => {
	// const { userId } = req.token;

	knex('favorites_users')
		.innerJoin('favorites', 'favorites.id', 'favorites_users.favorite_id')
		.innerJoin('users', 'users.id', 'favorites_users.user_id')
		.innerJoin('searches', 'searches.id', 'favorites.search_id')
		.then((rows) => {
			const favoritesUsers = camelizeKeys(rows);

			res.send(favoritesUsers);
		})
		.catch((err) => {
			next(err);
		});
});;

// Get all of a user's favorites
router.get('/favorites_users/:id', /*authorize,*/(req, res, next) => {
	// const { userId } = req.token;

	const userId = req.params.id;	//Change this after adding authentication

	knex('favorites_users')
		.innerJoin('favorites', 'favorites.id', 'favorites_users.favorite_id')
		.innerJoin('users', 'users.id', 'favorites_users.user_id')
		.where('users.id', userId)
		.innerJoin('searches', 'searches.id', 'favorites.search_id')
		.then((row) => {
			res.send(camelizeKeys(row));
		})
		.catch((err) => {
			next(err);
		})
});

// Get favorites not already present in a user's favorites

// Get a particular favorite for/from a particular user
router.get('/favorites_users/:id', /*authorize,*/(req, res, next) => {
	// const { userId } = req.token;

	const favoriteId = req.params.id;

	knex('favorites_users')
		.innerJoin('favorites', 'favorites.id', 'favorites_users.favorite_id')
		.where('favorites.id', favoriteId)
		.innerJoin('users', 'users.id', 'favorites_users.user_id')
		.innerJoin('searches', 'searches.id', 'favorites.search_id')
		.then((row) => {
			res.send(camelizeKeys(row));
		})
		.catch((err) => {
			next(err);
		})
});

// Can create another request to count favorites
// router.get(/favorites_users/***, authorize, (req, res, next) => {

// })

router.patch('/favorites_users/:id', /*authorize,*/ (req, res, next) => {
	// const userId = req.token;
	const { id } = req.params;

	knex('favorites_users')
		.where('id', id)
		.first()
		.then((row) => {
			if (!row) {
				throw boom.create(404, `id ${id} not found in favorites_users`)
			}
			const { favoriteId, userId } = req.body;
			const updateFavorite = {};

			if (favoriteId) {
				updateFavorite.favoriteId = favoriteId;
			} 

			if (userId) {
				updateFavorite.userId = userId;
			}

			return knex('favorites_users')
				.update(decamelizeKeys(updateFavorite), '*')
				.where('id', id);
		})
		.then((row) => {
			res.send(camelizeKeys(row[0]));
		})
		.catch((err) => {
			next(err);
		})


});

router.delete('/favorites_users/:id', /*authorize,*/(req, res, next) => {
	if (!Number(req.params.id) || Number(req.params.id) !== Number.parseInt(Number(req.params.id))) {
		throw boom.create(404, `id ${id} not a number or integer`)
	}

	let fsrow;

	const { id } = req.params;

	knex('favorites_users')
		.where('id', id)
		.first()
		.then((row) => {
			if(!row) {
				throw boom.create(404, `no row found at id ${id}`)
			}

			fsrow = row;

			return knex('favorites_users')
				.del()
				.where('id', id);
		})
		.then(() => {
			delete fsrow.id;
			res.send(camelizeKeys(fsrow));
		})
		.catch((err) => {
			next(err);
		});
});

module.exports = router;