/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('links',(table)=>{
        table.increments('linkid').primary;
        // table.string('linkid').notNullable();
        table.integer('userid').notNullable();
        table.string('platform').notNullable();
        table.string('url').notNullable();
        table.foreign('userid').references('userid').inTable('users').onDelete('CASCADE');
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTable('person');
};
