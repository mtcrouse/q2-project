'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('tweets', (table) => {
    table.increments();
    table.text('tweet')
      .defaultTo('');
    table.text('best_guess')
      .defaultTo('');
    table.text('location')
      .defaultTo('');
    table.float('lat');
    table.float('lng');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('tweets');
};
