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

// router.post('/searches', (req, res, next) => {
//   const { searchTerm } = req.body;

//   if (!searchTerm || !searchTerm.trim()) {
//     return next(boom.create(400, 'SearchTerm must not be blank'));
//   }

//   return knex('searches')
//     .where('search_term', searchTerm)
//     .first()
//     .then((row) => {
//       if (row) {
//         return next(boom.create(400, 'Search already exists'));
//       }
//     })
//     .then(() => {
//       return knex('searches').insert(decamelizeKeys(searchTerm), '*');
//     })
//     .then((rows) => {
//       const currentSearch = camelizeKeys(rows[0]);

//       res.send(currentSearch);
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

router.get('/searches', (req, res, next) => {
  knex('searches')
    .orderBy('id')
    .then((rows) => {
      const searches = camelizeKeys(rows);

      res.send(searches);

// router.get('/searches', /*authorize,*/ (req, res, next) => {
//   knex('searches')
//     .orderBy('search_term')
//     .then((searches) => {
//       res.send(camelizeKeys(searches));

    })
    .catch((err) => {
      next(err);
    });
});

router.get('/searches/:id', /*authorize,*/ (req, res, next) => {
  const { id } = req.params;

  if (!Number(id)) {
    return next(boom.create(400, `id ${id} not valid`));
  }

  knex('searches')
    .where('id', id)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(400, `No row at id ${id}`)
      }

      res.send(camelizeKeys(row));
    })
    .catch((err) => {
      next(err)
    });
});

router.post('/searches', /*authorize,*/ (req, res, next) => {
  const { searchTerm } = req.body;
  if (!searchTerm || !searchTerm.trim()) {
    throw boom.create(400, 'searchTerm must not be blank')
  }

  knex('searches')
    .where('search_term', searchTerm)
    .first()
    .then((row) => {
      if (!row) {
        const newSearch = decamelizeKeys({searchTerm});
        return knex('searches')
          .insert(newSearch, '*')
          .then(() => {
            res.send(camelizeKeys(newSearch));
          })
          .catch((err) => {
            next(err);
          });
      } 
      else {
        return knex('searches')
          .where('search_term', searchTerm)
          .first()
          .then((row) => {
            const patchedSearch = row;
            row.count++;
            return knex('searches')
              .update(decamelizeKeys(patchedSearch), `*`)
              .where('search_term', searchTerm)
              .then((search) => {
                res.send(camelizeKeys(search[0]));
              });
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/searches/:id', /*authorize,*/ (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    throw boom.create(400, `No id provided`)
  }

  knex('searches')
    .where('id', id)
    .then ((row) => {
      if (!row) {
        throw boom.create(404, `No search found at id ${id}`)
      }

      const { count, createdAt, searchTerm} = req.body;
      const patchedSearch = {};

      if (count) {
        patchedSearch.count = count;
      }

      if (createdAt) {
        patchedSearch.createdAt = createdAt;
      }

      if (searchTerm) {
        patchedSearch.searchTerm = searchTerm;
      }

      return knex('searches')
        .update(decamelizeKeys(patchedSearch), `*`)
        .where(`id`, id)
    })
    .then((row) => {
      const search = camelizeKeys(row[0]);

      res.send(search);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/searches/:id', /*authorize,*/ (req, res, next) => {
  const searchId = req.params.id;

  if (Number.parseInt(Number(searchId)) !== Number(searchId)) {
    return next(boom.create(400, `searchId blank or not an integer`));
  }

  let search;

  knex('searches')
    .where(`id`, searchId)
    .first()
    .then((row) => {
      if (!row) {
        return next(boom.create(400, `No search exists at id ${searchId}`))
      }

    search = row;

    return knex('searches')
      .del()
      .where('id', searchId);
    })
    .then(() => {
      delete search.id;
      res.send(camelizeKeys(search));
    })
    .catch((err) => {
      next(err);
    });
});
  

module.exports = router;