
exports.up = function(knex, Promise) {
  return knex.schema.table('beers', table => {
    table.string('name')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('beers', table => {
    table.dropColumn('name')
  })
};
