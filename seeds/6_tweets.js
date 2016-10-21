/* eslint camelcase: 0, max-len: 0 */

'use strict';

exports.seed = function(knex) {
  return knex('tweets').del()
    .then(() => {
      return knex('tweets').insert([{
        id: 1,
        tweet: 'Hello, world.',
        best_guess: 'Earth',
        lat: 41,
        lng: 52,
        created_at: new Date('2016-10-13 16:17:12 UTC'),
        updated_at: new Date('2016-10-13 16:17:12 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('tweets_id_seq', (SELECT MAX(id) FROM tweets));"
      );
    });
};
