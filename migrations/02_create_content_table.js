// migrations/02_create_content_table.js
exports.up = function(knex) {
    return knex.schema.createTable('content', function(table) {
        table.increments('id').primary();
        table.integer('topic_id').references('id').inTable('topics');
        table.text('description');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.specificType('tsv_content', 'tsvector');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('content');
};
