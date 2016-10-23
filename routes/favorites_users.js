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

router.post('/favorites_users', authorize, /*ev(validations.post),*/ (req, res, next) => {
  const { userId } = req.token; 
  const { tweet } = req.body;

  // ev(validations)
  // if (!favoriteId || !favoriteId.trim() || Number(favoriteId) !== Number.parseInt(Number(favoriteId))) {
  //  throw boom.create(400, `favoriteId ${favoriteid} is blank or not an integer`)
  // }

  knex('favorites')
    .where('tweet', tweet)
    .first()
    .then((row) => {
      const favoriteId = Number(row.id);
      const newEntry = { userId: userId, favoriteId: favoriteId };
      knex('favorites_users')
        .insert(decamelizeKeys(newEntry), '*')
        .then((row) => {
          res.send(row);
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });


});

// Get particular user's favorites
router.get('/favorites_users/ucheck/:id', /*authorize,*/ (req, res, next) => {
  const userId = req.params.id;

  // console.log("UserId is");
  // console.log(userId);

  knex('favorites_users')
    .where('favorites_users.user_id', userId)
    // .innerJoin('favorites', 'favorites.id', 'favorites_users.favorite_id')
    // .innerJoin('users', 'users.id', userId)
    // .innerJoin('searches', 'searches.id', 'favorites.search_id')
    .then((rows) => {
      const favoritesUsers = camelizeKeys(rows);

      res.send(favoritesUsers);
    })
    .catch((err) => {
      next(err);
    });
});

// Get users' favorites
router.get('/favorites_users/mecheck/', authorize, (req, res, next) => {
  const { userId } = req.token;

  // console.log("UserId is");
  // console.log(userId);

  knex('favorites_users')
    .where('favorites_users.user_id', userId)
    .innerJoin('favorites', 'favorites.id', 'favorites_users.favorite_id')
    // .innerJoin('users', 'users.id', userId)
    .innerJoin('searches', 'searches.id', 'favorites.search_id')
    .then((rows) => {
      const favoritesUsers = camelizeKeys(rows);

      res.send(favoritesUsers);
    })
    .catch((err) => {
      next(err);
    });
});

// Get particular user's particular favorite
router.get('/favorites_users/userfav/:id', authorize, (req, res, next) => {
  const userId = req.params.id;

  knex('favorites_users')
    .innerJoin('favorites', 'favorites.id', 'favorites_users.favorite_id')
    .innerJoin('users', 'users.id', 'favorites_users.user_id')
    .where('users.id', userId)
    .innerJoin('searches', 'searches.id', 'favorites.search_id')
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(400, `No row(s) at id ${userId}`);
      }
      res.send(camelizeKeys(row));
    })
    .catch((err) => {
      next(err);
    });
});

// Get favorites not already present in a user's favorites
router.get('/favorites_users/outercheck/:id', authorize, (req, res, next) => {
  const userId = req.params.id;

  knex('favorites_users')
    .whereNot('user_id', userId)
    .innerJoin('favorites', 'favorites.id', 'favorites_users.favorite_id')
    .innerJoin('searches', 'searches.id', 'favorites.search_id')
    .innerJoin('users', 'users.id', 'favorites_users.user_id')
    .then((rows) => {
      const favoritesUsers = camelizeKeys(rows);

      res.send(favoritesUsers);
    })
    .catch((err) => {
      next(err);
    });
});


// Get a list of all favorites for particular searchId with user info
router.get('/favorites_users/favsforsearch/:id', authorize, (req, res, next) => {
  const searchId = req.params.id;

  knex('searches')
    .where('search_id', searchId)
    .innerJoin('favorites', 'searches.id', 'favorites.search_id')
    .innerJoin('favorites_users', 'favorites.id', 'favorites_users.favorite_id')
    .innerJoin('users', 'users.id', 'favorites_users.user_id')
    .then((row) => {
      if (row === []) {
        throw boom.create(404, `searchId ${searchId} isn't in favorites`);
      }

      res.send(camelizeKeys(row));
    })
    .catch((err) => {
      next(err);
    });
});

// Can create another request to count favorites?
// router.get(/favorites_users/***, authorize, (req, res, next) => {
// })

//Patch
router.patch('/favorites_users/', authorize, (req, res, next) => {
  const {userId, favoriteId, newUserId, newFavoriteId } = req.body;

  // if (!userId || !favoriteId) {
  //  throw boom.create(400, `Not enough patch information provided. userId (${userID}) and favoriteId(${favoriteId}) both required.`);
  // }

  knex('favorites_users')
    .where('favorite_id', favoriteId)
    .where('user_id', userId)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, `favoriteId ${favoriteId} for userId ${userId} not found in favorites_users`);
      }

      let updateFavorite = {};
      // const { favoriteId, userId } = req.body;

      if (newFavoriteId) {
        updateFavorite.favorite_id = newFavoriteId;
      } 

      if (newUserId) {
        updateFavorite.user_id = newUserId;
      }

      return knex('favorites_users')
        .where({favorite_id: favoriteId, user_id: userId})
        .first()
        .update(updateFavorite, '*');
    })
    .then((row) => {
      res.send(camelizeKeys(row));
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/favorites_users/:id', /*authorize,*/(req, res, next) => {
  if (!Number(req.params.id) || Number(req.params.id) !== Number.parseInt(Number(req.params.id))) {
    throw boom.create(404, `id ${id} not a number or integer`);
  }

  let fsrow;

  const { id } = req.params;

  knex('favorites_users')
    .where('id', id)
    .first()
    .then((row) => {
      if(!row) {
        throw boom.create(404, `no row found at id ${id}`);
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