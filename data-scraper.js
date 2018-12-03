var Nightmare = require("nightmare");
var nightmare = Nightmare({ show: true });
var fs = require("fs");

nightmare
  .goto("http://cerebralbrewing.com/beer/")
  .evaluate(function() {
    let titles = document.querySelectorAll("h3");
    var list = [].slice.call(titles);
    return list.map(function(node) {
      return node.innerText;
    });
  })
  .end()
  .then(function(result) {
    fs.writeFileSync(".db/data/beer-names.js", JSON.stringify(result));
    console.log(result);
  })
  .catch(error => console.error(error));
