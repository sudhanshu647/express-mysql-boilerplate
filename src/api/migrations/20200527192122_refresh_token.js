/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
exports.up = function (knex, Promise) {
  return knex.schema.createTable('refresh_tokens', (table) => {
    table.increments('id').primary();
    table.string('token');
    table.integer('user_id').unsigned().notNullable().references('id')
      .inTable('users');
    table.string('user_email', 60).notNullable();
    table.date('expires');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('refresh_tokens');
};
