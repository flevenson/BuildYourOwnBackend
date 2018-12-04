exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("beer_styles", table => {
      table.increments("id").primary();
      table.string("style_name");
      table.string("description");

      table.timestamps(true, true);
    }),

    knex.schema.createTable("beers", table => {
      table.increments("id").primary();
      table.integer("style_id").unsigned();
      table.foreign("style_id").references("beer_styles.id");
      table.string("abv");
      table.string("description");
      table.boolean("is_available");

      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable("beers"),
    knex.schema.dropTable("beer_styles")
  ]);
};
