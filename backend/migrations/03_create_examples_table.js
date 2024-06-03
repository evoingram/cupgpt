// migrations/03_create_examples_table.js
exports.up = function (knex) {
    return knex.schema.createTable('examples', function (table) {
        table.increments('id').primary();
        table.integer('content_id').references('id').inTable('content');
        table.string('language');
        table.text('example');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.specificType('tsv_example', 'tsvector');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('examples');
};
