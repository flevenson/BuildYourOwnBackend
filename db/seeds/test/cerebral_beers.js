const beerData = require("../../../public/cleaner.js");
const beers = [
  {
    name: "TREMBLING GIANT",
    abv: "6.9%",
    description: "a good beer",
    availability: true,
    beerStyle: "Barrel Aged Biere de Garde"
  },
  {
    name: "GUAVA-ING THROUGH DIMENSIONS",
    abv: "6.7%",
    description: "a very good beer",
    availability: true,
    beerStyle: "Brettanomyces Saison"
  },
  {
    name: "TANGERINE-ING THROUGH DIMENSIONS",
    abv: "6.7%",
    description: "an ok beer",
    availability: false,
    beerStyle: "Brettanomyces Saison"
  }
];

const styles = [
  {
    beerStyle: "Barrel Aged Biere de Garde",
    description: "Barrel aged Dark style meant for cellaring"
  },
  {
    beerStyle: "Brettanomyces Saison",
    description: "Spicy saison with wild yeast"
  },
  { beerStyle: "Pilsner2", description: "It's new" }
];

const createStyles = (knex, style) => {
  return knex("beer_styles")
    .insert(
      {
        style_name: style.beerStyle,
        description: style.description
      },
      ["style_name", "id"]
    )
    .then(style => {
      let beerPromises = beers.map(beer => {
        if (beer.beerStyle === style[0].style_name) {
          return knex("beers").insert({
            name: beer.name,
            abv: beer.abv,
            description: beer.description,
            is_available: beer.availability,
            style_id: style[0].id
          });
        }
      });
      return Promise.all(beerPromises);
    });
};

exports.seed = function(knex, Promise) {
  return knex("beers")
    .del()
    .then(() => knex("beer_styles").del())
    .then(() => {
      const stylePromises = styles.map(style => {
        return createStyles(knex, style);
      });
      return Promise.all(stylePromises);
    })
    .then(() => console.log("Great Success!!"))
    .catch(error => console.log(`Error seeding data: ${error}`));
};
