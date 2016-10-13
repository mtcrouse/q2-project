'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('favorites_users', (table) => {
    table.increments();
    table.integer('favorite_id')
      .unsigned()
      .references('id')
      .inTable('favorites')
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
  return knex.schema.dropTable('favorites_users');
};
