'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('favorites', (table) => {
    table.increments();
    table.integer('search_id')
      .unsigned()
      .references('id')
      .inTable('searches')
      .onDelete('CASCADE');
    table.integer('count')
      .notNullable()
      .defaultTo(1);
    table.text('tweet')
      .defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('favorites');
};
