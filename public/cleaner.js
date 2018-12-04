const beerNames = require("../db/scraped-data/beer-names");
const beerABV = require("../db/scraped-data/beer-abv")
const beerDescriptions = require("../db/scraped-data/beer-descriptions")
const beerAvailability = require("../db/scraped-data/beer-availability")
const beerStyles = require("../db/scraped-data/beer-styles")

console.log(beerNames)

const cleanBeers = beerNames.map((name, index) => {
  return {
    name,
    abv: beerABV[index],
    description: beerDescriptions[index],
    availability: beerAvailability[index],
    beerStyle: beerStyles[index]
  }
})

module.exports = cleanBeers

function test() {
  console.log(beerNames);
}
test();
