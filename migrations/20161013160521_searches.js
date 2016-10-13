'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('searches', (table) => {
    table.increments();
    table.string('search_term').notNullable().defaultTo('');
    table.integer('count').notNullable().defaultTo(1);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('searches');
};
