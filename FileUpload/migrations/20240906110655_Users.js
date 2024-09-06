/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up (knex) {
    return knex.schema.createTable('users',(table)=>{
        table.increments('userid').primary;
        table.integer('authuserid').notNullable;
        table.string('firstname').notNullable();
        table.string('lastname').notNullable();
        table.string('imageurl').notNullable();
        table.string('email').notNullable();
        table.specificType('links', 'integer[]').defaultTo('{}');

        table.foreign('authuserid').references('authuserid').inTable('userauth').onDelete('CASCADE');
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('users');
};
