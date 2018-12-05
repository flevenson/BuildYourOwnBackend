process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server.js");
const expect = chai.expect;
const config = require("../knexfile")["test"];
const database = require("knex")(config);
chai.use(chaiHttp);

describe("Server file", () => {
  beforeEach(done => {
    database.seed.run().then(() => {
      done();
    });
  });

  it("should return a 404 for a route that does not exist", done => {
    chai
      .request(app)
      .get("/supersad")
      .end((error, response) => {
        expect(response).to.have.status(404);
        done();
      });
  });

  describe("/api/v1/cerebral_beers/styles", () => {
    it("should have a 200 status", done => {
      chai
        .request(app)
        .get("/api/v1/cerebral_beers/styles")
        .end((error, response) => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it("should return the data as JSON", done => {
      chai
        .request(app)
        .get("/api/v1/cerebral_beers/styles")
        .end((error, response) => {
          expect(response).to.be.json;
          done();
        });
    });

    it("should return an array with all of the beer styles", done => {
      chai
        .request(app)
        .get("/api/v1/cerebral_beers/styles")
        .end((error, response) => {
          expect(response.body).to.be.a("array");
          expect(response.body.length).to.equal(2);
          done();
        });
    });

    it("should correctly add a new style", done => {
      const newStyle = {
        style_name: "freddies secret style",
        description: "omg so amazing wow"
      };

      chai
        .request(app)
        .post("/api/v1/cerebral_beers/styles")
        .send(newStyle)
        .end((error, response) => {
          expect(response).to.have.status(201);
          expect(response.body).to.equal("Beer Style successfully added!");
          done();
        });
    });
  });

  describe("/api/v1/cerebral_beers/beer", () => {
    it("should have a 200 status", done => {
      chai
        .request(app)
        .get("/api/v1/cerebral_beers/beer")
        .end((error, response) => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it("should return the data as JSON", done => {
      chai
        .request(app)
        .get("/api/v1/cerebral_beers/beer")
        .end((error, response) => {
          expect(response).to.be.json;
          done();
        });
    });

    it("should return an array with all of the beer", done => {
      chai
        .request(app)
        .get("/api/v1/cerebral_beers/beer")
        .end((error, response) => {
          expect(response.body).to.be.a("array");
          expect(response.body.length).to.equal(3);
          done();
        });
    });
  });

  describe("/api/v1/cerebral_beers/find_by_style", () => {
    it("should have a 200 status", done => {
      chai
        .request(app)
        .get(
          "/api/v1/cerebral_beers/find_by_style?style_name=Brettanomyces+Saison"
        )
        .end((error, response) => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it("should return the data as JSON", done => {
      chai
        .request(app)
        .get(
          "/api/v1/cerebral_beers/find_by_style?style_name=Brettanomyces+Saison"
        )
        .end((error, response) => {
          expect(response).to.be.json;
          done();
        });
    });

    it("should return an array with all beers of a certain style", done => {
      chai
        .request(app)
        .get(
          "/api/v1/cerebral_beers/find_by_style?style_name=Brettanomyces+Saison"
        )
        .end((error, response) => {
          expect(response.body).to.be.a("array");
          expect(response.body.length).to.equal(2);
          expect(response.body[0].name).to.equal(
            "Guava-ing Through Dimensions"
          );
          expect(response.body[0].description).to.equal("a very good beer");
          expect(response.body[0].abv).to.equal("6.7%");
          expect(response.body[1].name).to.equal(
            "Tangerine-ing Through Dimensions"
          );
          expect(response.body[1].description).to.equal("an ok beer");
          expect(response.body[1].abv).to.equal("6.7%");
          done();
        });
    });
    it("expect error message if request does no include style_name", done => {
      chai
        .request(app)
        .get(
          "/api/v1/cerebral_beers/find_by_style?style_NOname=Brettanomyces+Saison"
        )
        .end((error, response) => {
          expect(response.body.error).to.equal(
            "Request must include 'style_name'. All first letter must be capitalized and spaces replaced by pluses. Example: '/api/v1/cerebral_beers/find_by_style?style_name=India+Pale+Ale'"
          );
          done();
        });
    });
  });
});
