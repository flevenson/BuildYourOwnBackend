const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const environment = process.env.NODE_ENV || "development";
const config = require("./knexfile")[environment];
const database = require("knex")(config);

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

app.delete("/api/v1/cerebral_beers/styles/:name", (request, response) => {
  let { name } = request.params;
  name = name.replace(/\+/g, " ");

  database("beer_styles")
    .where("style_name", name)
    .del()
    .then(style => {
      if (style === 0) {
        response.status(404).json(`No style '${name}' found in database`);
      } else {
        response.status(202).json(`Style '${name}' successfully deleted`);
      }
    })
    .catch(error => {
      response.status(405).json({
        error:
          "You're most likely trying to delete a style that has beers attached to it. Please remove those beers first!"
      });
    });
});

app.get("/api/v1/cerebral_beers/beer", (request, response) => {
  database("beers")
    .select()
    .then(beers => {
      response.status(200).json(beers);
    });
});

app.post("/api/v1/cerebral_beers/beer", (request, response) => {
  const newBeer = request.body;
  let missingProperties = [];
  for (let requiredProperty of [
    "name",
    "description",
    "abv",
    "is_available",
    "style"
  ]) {
    if (!newBeer[requiredProperty]) {
      missingProperties = [...missingProperties, requiredProperty];
      return response
        .status(422)
        .send({ error: `Missing Properties ${missingProperties}` });
    }
  }
  database("beer_styles")
    .where("style_name", newBeer.style)
    .select()
    .then(style => {
      database("beers")
        .insert(
          {
            name: newBeer.name,
            description: newBeer.description,
            is_available: newBeer.is_available,
            abv: newBeer.abv,
            style_id: style[0].id
          },
          "id"
        )
        .then(project => {
          response.status(201).json("Beer successfully added!");
        })
        .catch(error => {
          response.status(500).json({ error: error.message });
        });
    })
    .catch(error => {
      response.status(409).json({
        error: "That style does not exist. Try adding style to database first"
      });
    });
});

app.patch(
  "/api/v1/cerebral_beers/beer/:name/:availability",
  (request, response) => {
    let { name, availability } = request.params;
    name = name.replace(/\+/g, " ").toUpperCase();
    availability = availability.toLowerCase();

    if (availability !== "true" && availability !== "false") {
      response.status(404).json(`Availability must be 'true' or 'false'`);
    } else {
      database("beers")
        .where("name", name)
        .update({ is_available: availability })
        .then(numEdited => {
          if (numEdited === 0) {
            response
              .status(404)
              .json(`Beer '${name}' does not exist in database.`);
          } else {
            response
              .status(202)
              .json(`Availibility of ${name} sucessfully updated!`);
          }
        })
        .catch(error => {
          response.status(500).json({ error: error.message });
        });
    }
  }
);

app.patch("/api/v1/cerebral_beers/beer/", (request, response) => {
  let newAbv = request.body;
  let missingProperties = [];
  for (let requiredProperty of ["name", "abv"]) {
    if (!newAbv[requiredProperty]) {
      missingProperties = [...missingProperties, requiredProperty];
      return response
        .status(422)
        .send({ error: `Missing Properties ${missingProperties}` });
    }
  }
  newAbv.name = newAbv.name.toUpperCase();
  newAbv.abv = newAbv.abv + "% ABV";

  if (isNaN(newAbv.abv.slice(0, -6))) {
    response.status(404).json(`Abv must be a number`);
  } else {
    database("beers")
      .where("name", newAbv.name)
      .update({ abv: newAbv.abv })
      .then(numEdited => {
        if (numEdited === 0) {
          response
            .status(404)
            .json(`Beer '${newAbv.name}' does not exist in database.`);
        } else {
          response
            .status(202)
            .json(`ABV of ${newAbv.name} sucessfully updated!`);
        }
      })
      .catch(error => {
        response.status(500).json({ error: error.message });
      });
  }
});

app.get("/api/v1/cerebral_beers/beer/:name", (request, response) => {
  let { name } = request.params;
  name = name.replace(/\+/g, " ").toUpperCase();

  database("beers")
    .where("name", name)
    .select()
    .then(beer => {
      if (beer.length === 0) {
        response.status(404).json(`No beer '${name}' found in database`);
      } else {
        response.status(200).json(beer);
      }
    })
    .catch(error => {
      response.status(500).json({ error: error.message });
    });
});

app.delete("/api/v1/cerebral_beers/beer/:name", (request, response) => {
  let { name } = request.params;
  name = name.replace(/\+/g, " ").toUpperCase();

  database("beers")
    .where("name", name)
    .del()
    .then(beer => {
      if (beer === 0) {
        response.status(404).json(`No beer '${name}' found in database`);
      } else {
        response.status(202).json(`Beer '${name}' successfully deleted!`);
      }
    })
    .catch(error => {
      response.status(500).json({ error: error.message });
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

app.get(
  "/api/v1/cerebral_beers/currently_available/:availability",
  (request, response) => {
    const availability = request.params.availability.toUpperCase();

    database("beers")
      .where("is_available", availability)
      .select()
      .then(beers => response.status(200).json(beers))
      .catch(error =>
        console.log(
          `Error fetching currently available beers: ${error.message}`
        )
      );
  }
);

app.listen(app.get("port"), () => {
  console.log(`Cerebral Beer is running on ${app.get("port")}.`);
});

module.exports = app;
