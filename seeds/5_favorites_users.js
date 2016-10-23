/* eslint camelcase: 0, max-len: 0 */

'use strict';

exports.seed = function(knex) {
  return knex('favorites_users').del()
    .then(() => {
      return knex('favorites_users').insert([]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('favorites_users_id_seq', (SELECT MAX(id) FROM favorites_users));"
      );
    });
};
