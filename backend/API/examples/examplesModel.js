// backend/API/examples/examplesModel.js
const db = require('../../knexfile');

const addExample = (example) => {
    return db('examples').insert(example).returning('id');
};

const getAllExamples = () => {
    return db('examples').select('*');
};

module.exports = {
    addExample,
    getAllExamples
};
