// migrations/03_create_topic_relationships_table.js
exports.up = function (knex) {
    return knex.schema.createTable('topic_relationships', function (table) {
        table.increments('id').primary();
        table.integer('parent_topic_id').references('id').inTable('topics').onDelete('CASCADE');
        table.integer('child_topic_id').references('id').inTable('topics').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('topic_relationships');
};
