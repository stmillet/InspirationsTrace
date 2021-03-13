
exports.up = function(knex) {
  return knex.schema.createTable('captions', (table) => {
    table.increments()
    table.text('name')
        .notNullable()
    table.text('nextImage', 64)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('captions')
};
