 /**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export async function up (knex) {
  return knex.schema.createTable('userauth',(table)=>{
    table.increments(' authuserid').primary;
    table.string(' name  ').notNullable();
    table.string(' email ').notNullable();
    table.string(' password ').notNullable();
    table.specificType('profiles', 'integer[]').defaultTo('{}');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('person');
};
