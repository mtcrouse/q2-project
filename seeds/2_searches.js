/* eslint camelcase: 0, max-len: 0 */

'use strict';

exports.seed = function(knex) {
  return knex('searches').del()
    .then(() => {
      return knex('searches').insert([{
        id: 1,
        search_term: 'pizza',
        count: 1,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')
      },{
        id: 2,
        search_term: 'clinton',
        count: 40,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')
      },{
        id: 3,
        search_term: 'trump',
        count: 31,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')

      },{
        id: 4,
        search_term: 'love',
        count: 11,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')

      },{
        id: 5,
        search_term: 'hate',
        count: 131,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')

      }
      ]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('searches_id_seq', (SELECT MAX(id) FROM searches));"
      );
    });
};
