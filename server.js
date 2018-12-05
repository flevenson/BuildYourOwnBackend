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

app.get("/api/v1/cerebral_beers/:style_id/beers", (request, response) => {
  const { id } = request.params;
  console.log(request.params)

  // database("papers")
  //   .where("id", id)
  //   .select()
  //   .then(paper => response.status(200).json(paper))
  //   .catch(error => console.log(`Error fetching paper: ${error.message}`));
});

app.listen(app.get("port"), () => {
  console.log(`Cerebral Beer is running on ${app.get("port")}.`);
});

module.exports = app;
