'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('searches_users', (table) => {
    table.increments();
    table.integer('search_id')
      .unsigned()
      .references('id')
      .inTable('searches')
      .onDelete('CASCADE');
    table.integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('searches_users');
};
