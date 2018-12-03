var Nightmare = require("nightmare");
var nightmare = Nightmare({ show: true });
var fs = require("fs");

nightmare
  .goto("http://cerebralbrewing.com/beer/")
  .evaluate(function() {
    let titles = document.querySelectorAll("p");
    let list = [].slice.call(titles);
    let results = list.map(node => node.innerText);
    return results.filter(str => str.includes("% ABV"));
  })
  .end()
  .then(function(result) {
    fs.writeFileSync("./db/scraped-data/beer-abv.js", JSON.stringify(result));
    console.log(result);
  })
  .catch(error => console.error("Scrape Failed", error));
