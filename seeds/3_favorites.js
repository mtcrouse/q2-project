/* eslint camelcase: 0, max-len: 0 */

'use strict';

exports.seed = function(knex) {
  return knex('favorites').del()
    .then(() => {
      return knex('favorites').insert([{
        id: 1,
        search_id: 1,
        count: 8,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')
      },{
        id: 2,
        search_id: 2,
        count: 5,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')
      },{
        id: 3,
        search_id: 3,
        count: 11,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')
      },{
        id: 4,
        search_id: 5,
        count: 111,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')
      },{
        id: 5,
        search_id: 4,
        count: 43,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')
      }
      ]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('favorites_id_seq', (SELECT MAX(id) FROM favorites));"
      );
    });
};
