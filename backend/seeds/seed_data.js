const topicsData = [
    {id: 1, name: 'Data Structures'},
    {id: 2, name: 'Algorithms'}
];

const contentData = [
    {
        id: 1,
        topic_id: 1,
        description: 'Array - A collection of elements identified by index or key.',
        tsv_content: 'Array - A collection of elements identified by index or key.'
    },
    {
        id: 2,
        topic_id: 1,
        description: 'Linked List - A linear collection of data elements, whose order is not given by their physical placement in memory.',
        tsv_content: 'Linked List - A linear collection of data elements, whose order is not given by their physical placement in memory.'
    },
    {
        id: 3,
        topic_id: 2,
        description: 'Bubble Sort - A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        tsv_content: 'Bubble Sort - A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'
    }
];

const examplesData = [
    {
        id: 1,
        content_id: 1,
        language: 'JavaScript',
        example: 'let arr = [1, 2, 3];',
        tsv_example: 'let arr = [1, 2, 3];'
    },
    {
        id: 2,
        content_id: 2,
        language: 'JavaScript',
        example: 'class Node { constructor(value) { this.value = value; this.next = null; } }',
        tsv_example: 'class Node { constructor(value) { this.value = value; this.next = null; } }'
    },
    {
        id: 3,
        content_id: 3,
        language: 'JavaScript',
        example: 'function bubbleSort(arr) { let swapped; do { swapped = false; for (let i = 0; i < arr.length - 1; i++) { if (arr[i] > arr[i + 1]) { [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; swapped = true; } } } while (swapped); return arr; }',
        tsv_example: 'function bubbleSort(arr) { let swapped; do { swapped = false; for (let i = 0; i < arr.length - 1; i++) { if (arr[i] > arr[i + 1]) { [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; swapped = true; } } } while (swapped); return arr; }'
    }
];

exports.seed = async function (knex) {
    try {
        await knex('examples').del();
        await knex('content').del();
        await knex('topics').del();

        await knex('topics').insert(topicsData);
        await knex('content').insert(contentData.map(content => ({
            ...content,
            tsv_content: knex.raw("to_tsvector('english', ?)", [content.tsv_content])
        })));
        await knex('examples').insert(examplesData.map(example => ({
            ...example,
            tsv_example: knex.raw("to_tsvector('english', ?)", [example.tsv_example])
        })));

        console.log('Seed data inserted successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
};
