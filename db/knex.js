const environment = process.env.NODE_ENV || 'development'
const convig = require('../knexfile.js')[environment]
module.exports = require('knex')(config)