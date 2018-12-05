const beerData = require('../../../public/cleaner.js');
const beers = beerData[0];
const styles = beerData[1];

const createStyles = (knex, style) => {

  return knex('beer_styles')
    .insert({
      style_name: style.beerStyle,
      description: style.description
    }, ['style_name', 'id'])
    .then(style => {
      console.log(style)
      let beerPromises = beers.map(beer => {
        if(beer.beerStyle === style[0].style_name){
          return knex('beers').insert({
            name: beer.name,
            abv: beer.abv,
            description: beer.description,
            is_available: beer.availability,
            style_id: style[0].id
          })
        }
      })
      return Promise.all(beerPromises)
    })
}

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
