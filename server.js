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

console.log(beerData)

app.listen(app.get("port"), () => {
  console.log(`Palette Picker is running on ${app.get("port")}.`);
});
