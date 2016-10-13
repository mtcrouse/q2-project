/* eslint camelcase: 0, max-len: 0 */

'use strict';

exports.seed = function(knex) {
  return knex('favorites_users').del()
    .then(() => {
      return knex('favorites_users').insert([{
        id: 1,
        favorite_id: 1,
        user_id: 1,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('favorites_users_id_seq', (SELECT MAX(id) FROM favorites_users));"
      );
    });
};
