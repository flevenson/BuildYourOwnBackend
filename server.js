const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const environment = process.env.NODE_ENV || "development";
const config = require("./knexfile")[environment];
const database = require("knex")(config);
const beerNames = require("./db/scraped-data/beer-names");
const beerData = require("./public/cleaner.js");

app.use(express.static("public"));
app.use(bodyParser.json());
app.set("port", process.env.PORT || 3000);

app.get("/api/v1/cerebral_beers/styles", (request, response) => {
  database("beer_styles")
    .select()
    .then(styles => {
      response.status(200).json(styles);
    });
});

app.post("/api/v1/cerebral_beers/styles", (request, response) => {
  const newStyle = request.body;
  let missingProperties = [];
  for (let requiredProperty of ["style_name", "description"]) {
    if (!newStyle[requiredProperty]) {
      missingProperties = [...missingProperties, requiredProperty];
      return response
        .status(422)
        .send({ error: `Missing Properties ${missingProperties}` });
    }
  }
  database("beer_styles")
    .insert({ ...newStyle }, "id")
    .then(project => {
      response.status(201).json("Beer Style successfully added!");
    })
    .catch(error => {
      response.status(500).json({ error: error.message });
    });
});

app.get("/api/v1/cerebral_beers/beer", (request, response) => {
  database("beers")
    .select()
    .then(beers => {
      response.status(200).json(beers);
    });
});

app.get("/api/v1/cerebral_beers/find_by_style", (request, response) => {
  let { style_name } = request.query;

  if (!style_name) {
    return response.status(422).send({
      error:
        "Request must include 'style_name'. All first letter must be capitalized and spaces replaced by pluses. Example: '/api/v1/cerebral_beers/find_by_style?style_name=India+Pale+Ale'"
    });
  }

  database("beer_styles")
    .where("style_name", style_name)
    .select()
    .then(style => {
      if (!style.length) {
        return response.status(422).send({
          error: `No beers found of style: ${style_name}`
        });
      }
      return database("beers")
        .where("style_id", style[0].id)
        .select();
    })
    .then(beers => response.status(200).json(beers))
    .catch(error => console.log(`Error fetching style: ${style_name}`));
});

app.get("/api/v1/cerebral_beers/currently_available", (request, response) => {
  database("beers")
    .where("is_available", true)
    .select()
    .then(beers => response.status(200).json(beers))
    .catch(error =>
      console.log(`Error fetching currently available beers: ${error.message}`)
    );
});

app.listen(app.get("port"), () => {
  console.log(`Cerebral Beer is running on ${app.get("port")}.`);
});

module.exports = app;
