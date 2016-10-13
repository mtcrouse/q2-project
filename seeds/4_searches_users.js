/* eslint camelcase: 0, max-len: 0 */

'use strict';

exports.seed = function(knex) {
  return knex('searches_users').del()
    .then(() => {
      return knex('searches_users').insert([{
        id: 1,
        search_id: 1,
        user_id: 1,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('searches_users_id_seq', (SELECT MAX(id) FROM searches_users));"
      );
    });
};
