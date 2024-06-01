// seeds/seed_data.js
exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('topics').del()
        .then(function () {
            // Inserts seed entries for topics
            return knex('topics').insert([
                {id: 1, name: 'Data Structures'},
                {id: 2, name: 'Algorithms'}
            ]);
        })
        .then(function () {
            // Inserts seed entries for content
            return knex('content').insert([
                {id: 1, topic_id: 1, description: 'Array - A collection of elements identified by index or key.', tsv_content: knex.raw("to_tsvector('english', ?)", ['Array - A collection of elements identified by index or key.'])},
                {id: 2, topic_id: 1, description: 'Linked List - A linear collection of data elements, whose order is not given by their physical placement in memory.', tsv_content: knex.raw("to_tsvector('english', ?)", ['Linked List - A linear collection of data elements, whose order is not given by their physical placement in memory.'])},
                {id: 3, topic_id: 2, description: 'Bubble Sort - A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.', tsv_content: knex.raw("to_tsvector('english', ?)", ['Bubble Sort - A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'])}
            ]);
        })
        .then(function () {
            // Inserts seed entries for examples
            return knex('examples').insert([
                {id: 1, content_id: 1, language: 'JavaScript', example: 'let arr = [1, 2, 3];', tsv_example: knex.raw("to_tsvector('english', ?)", ['let arr = [1, 2, 3];'])},
                {id: 2, content_id: 2, language: 'JavaScript', example: 'class Node { constructor(value) { this.value = value; this.next = null; } }', tsv_example: knex.raw("to_tsvector('english', ?)", ['class Node { constructor(value) { this.value = value; this.next = null; } }'])},
                {id: 3, content_id: 3, language: 'JavaScript', example: 'function bubbleSort(arr) { let swapped; do { swapped = false; for (let i = 0; i < arr.length - 1; i++) { if (arr[i] > arr[i + 1]) { [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; swapped = true; } } } while (swapped); return arr; }', tsv_example: knex.raw("to_tsvector('english', ?)", ['function bubbleSort(arr) { let swapped; do { swapped = false; for (let i = 0; i < arr.length - 1; i++) { if (arr[i] > arr[i + 1]) { [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; swapped = true; } } } while (swapped); return arr; }'])}
            ]);
        });
};
