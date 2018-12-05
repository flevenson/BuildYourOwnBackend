const beerNames = require("../db/scraped-data/beer-names");
const beerABV = require("../db/scraped-data/beer-abv");
const beerDescriptions = require("../db/scraped-data/beer-descriptions");
const beerAvailability = require("../db/scraped-data/beer-availability");
const beerStyles = require("../db/scraped-data/beer-styles");

const cleanBeers = beerNames.map((name, index) => {
  return {
    name,
    abv: beerABV[index],
    description: beerDescriptions[index],
    availability: beerAvailability[index],
    beerStyle: beerStyles[index]
  };
});

const cleanStyles = cleanBeers.reduce((acc, beer) => {
  let beerStyles = acc.map(obj => obj.beerStyle);
  if (!beerStyles.includes(beer.beerStyle)) {
    acc.push({
      beerStyle: beer.beerStyle,
      description: ""
    });
  }
  return acc;
}, []);

const beerData = [cleanBeers, cleanStyles];

module.exports = beerData;
