/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
exports.up = function (knex, Promise) {
  return knex.schema.createTable('password_reset_tokens', (table) => {
    table.increments('id').unsigned().primary();
    table.string('reset_token');
    table.integer('user_id').unsigned().notNullable().references('id')
      .inTable('users');
    table.string('user_email', 60).notNullable();
    table.timestamp('expires');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('password_reset_tokens');
};
