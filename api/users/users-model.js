const db = require("../../data/dbConfig");

function find() {
    return db('users').select('*');
}

function findBy(filter) {
    return db('users').select('*').where(filter);
}

async function add(user) {
    const [id] = await db('users').insert(user,'id').select('*')
    return findById(id);
}

function findById(id) {
    return db('users').select('*').where('id',id).first();
}

module.exports = {
    add,
    findBy,
    find,
    findById,
}