const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const environment = process.env.NODE_ENV || "development";
const config = require("./knexfile")[environment];
const database = require("knex")(config);
const beerNames = require("./db/scraped-data/beer-names");
const beerData = require('./public/cleaner.js');



app.use(express.static("public"));
app.use(bodyParser.json());
app.set("port", process.env.PORT || 3000);

app.get('/api/v1/cerebral_beers', (request, response) => {
  database('beer_styles').select()
    .then(styles => {
      response.status(200).json(styles)
    })
})

app.listen(app.get("port"), () => {
  console.log(`Cerebral Beer is running on ${app.get("port")}.`);
});

module.exports = app;