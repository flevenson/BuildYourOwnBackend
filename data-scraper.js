var Nightmare = require("nightmare");
var nightmare = Nightmare({ show: true });
var fs = require("fs");

nightmare
  .goto("http://cerebralbrewing.com/beer/")
  .evaluate(function() {
    let titles = document.querySelectorAll("span");
    var list = [].slice.call(titles);
    return list.map(function(node) {
      return node.innerText;
    });
  })
  .end()
  .then(function(result) {
    fs.writeFileSync("./db/scraped-data/beer-styles.js", JSON.stringify(result));
    console.log(result);
  })
  .catch(error => console.error("Scrape Failed", error));
