module.exports = {
  development: {
    client: "pg",
    connection: "postgres://localhost/byobe",
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds/dev"
    },
    useNullAsDefault: true
  }
};
