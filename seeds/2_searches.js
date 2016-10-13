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
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('searches_id_seq', (SELECT MAX(id) FROM searches));"
      );
    });
};
