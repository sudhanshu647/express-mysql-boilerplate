/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').unsigned().primary();
    table.string('name', 40);
    table.string('profile_img', 2048);
    table.date('date_of_birth');
    table.string('gender', 15);
    table.string('google_id');
    table.string('email', 60).unique().notNullable();
    table.string('password').notNullable();
    table.string('confirmation_code');
    table.timestamp('email_verified_at').defaultTo(null).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users');
};
