const knex = require('knex')
const config = require('./knexfile')
const db = knex(config.development)


async function add(caption) {
    const [id] = await db('captions').insert({name: caption.name});
    return id
}

async function update(imageName) {
    const id = await db('captions')
        .where({id: imageName.id})
        .update({nextImage: imageName.fileName}, ['id'])
    return id
}

async function del() {
    await db('captions').del()
    return true
}

async function getLatest() {
    const row = await db.select()
                    .table('captions')
                    .orderBy('id', 'desc')
                    
    return row
}

module.exports = {
    add,
    update,
    del,
    getLatest,
}