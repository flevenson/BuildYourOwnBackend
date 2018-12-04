const beerData = require('../../../public/cleaner.js');
const beers = beerData[0];
const styles = beerData[1];
// const environment = process.env.NODE_ENV || 'development';
// const config = require('../../../knexfile')[environment]
// const database = require('knex')(config);

const createStyles = (knex, style) => {

  return knex('beer_styles')
    .insert({
      style_name: style.beerStyle,
      description: style.description
    }, 'id')
    .then(styleID => {
      let beerPromises = beers.map(beer => {
        return knex('beers').insert({
          abv: beer.abv,
          description: beer.description,
          is_available: availability,
          style_id: styleID[0]
        })
      })
    })
}

// const createBeer = (knex, beer) => {
//   console.log(database('beer_styles').select('id'))
//   // return knex('beers')
//   //   .insert()
// }

exports.seed = function(knex, Promise) {
  return knex("beers")
    .del()
    .then(() => knex("beer_styles").del())
    .then(() => {
      const stylePromises = styles.map(style => {
        return createStyles(knex, style)
      })
    return Promise.all(stylePromises)
    })
    // .then(createBeer)
    .then(() => console.log('Great Success!!'))
    .catch(error => console.log(`Error seeding data: ${error}`))
};
