/* eslint camelcase: 0, max-len: 0 */

'use strict';

exports.seed = function(knex) {
  return knex('favorites_searches_users').del()
    .then(() => {
      return knex('favorites_searches_users').insert([{
        id: 1,
        favorite_id: 1,
        user_id: 1,
        search_id: 1,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')
      },{
        id: 2,
        favorite_id: 2,
        user_id: 1,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')
      },{
        id: 3,
        favorite_id: 3,
        user_id: 2,
        search_id: 2,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')
      },{
        id: 4,
        favorite_id: 4,
        user_id: 1,
        search_id: 4,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')
      },{
        id: 5,
        favorite_id: 5,
        user_id: 1,
        search_id: 5,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')
      },{
        id: 6,
        favorite_id: 1,
        user_id: 5,
        search_id: 5,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('favorites_searches_users_id_seq', (SELECT MAX(id) FROM favorites_searches_users));"
      );
    });
};
