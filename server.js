const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const environment = process.env.NODE_ENV || "development";
const config = require("./knexfile")[environment];
const database = require("knex")(config);

app.use(express.static("public"));
app.use(bodyParser.json());
app.set("port", process.env.PORT || 3000);

function test() {
  console.log("beerNames");
}
test();

app.listen(app.get("port"), () => {
  console.log(`Palette Picker is running on ${app.get("port")}.`);
});
