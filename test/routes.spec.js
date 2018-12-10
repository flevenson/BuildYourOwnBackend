process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server.js");
const expect = chai.expect;
const config = require("../knexfile")["test"];
const database = require("knex")(config);
chai.use(chaiHttp);

describe("Server file", () => {
  before(done => {
    database.migrate.latest()
    .then(() => done())
    .catch((error) => {
      throw error
    })
    .done()
  })

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
    it("get request should have a 200 status", done => {
      chai
        .request(app)
        .get("/api/v1/cerebral_beers/styles")
        .end((error, response) => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it("get request should return the data as JSON", done => {
      chai
        .request(app)
        .get("/api/v1/cerebral_beers/styles")
        .end((error, response) => {
          expect(response).to.be.json;
          done();
        });
    });

    it("get request should return an array with all of the beer styles", done => {
      chai
        .request(app)
        .get("/api/v1/cerebral_beers/styles")
        .end((error, response) => {
          expect(response.body).to.be.a("array");
          expect(response.body.length).to.equal(3);
          let styleNames = response.body.map(obj => obj.style_name)
          expect(styleNames.includes('Brettanomyces Saison')).to.equal(true)
          expect(styleNames.includes('Pilsner2')).to.equal(true)
          expect(styleNames.includes('Barrel Aged Biere de Garde')).to.equal(true)
          done();
        });
    });

    it("post request should correctly add a new style", done => {
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

    it("post request should return error message if missing properties", done => {
      const newStyle = {
        style_name: "freddies secret style"
      };

      chai
        .request(app)
        .post("/api/v1/cerebral_beers/styles")
        .send(newStyle)
        .end((error, response) => {
          expect(response).to.have.status(422);
          expect(response.error.text).to.equal(
            `{"error":"Missing Properties description"}`
          );
          done();
        });
    });

    it("delete request should correctly delete style if no beers attached", done => {
      chai
        .request(app)
        .delete("/api/v1/cerebral_beers/styles/Pilsner2")
        .end((error, response) => {
          expect(response).to.have.status(202);
          expect(response.body).to.equal(
            `Style 'Pilsner2' successfully deleted`
          );
          done();
        });
    });

    it("delete request should return error message if style not in db", done => {
      chai
        .request(app)
        .delete("/api/v1/cerebral_beers/styles/Pilsner3")
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body).to.equal(
            `No style 'Pilsner3' found in database`
          );
          done();
        });
    });

    it("delete request should error out if beers are attached", done => {
      chai
        .request(app)
        .delete("/api/v1/cerebral_beers/styles/Brettanomyces Saison")
        .end((error, response) => {
          expect(response).to.have.status(405);
          expect(response.error.text).to.equal(
            `{"error":"You\'re most likely trying to delete a style that has beers attached to it. Please remove those beers first!"}`
          );
          done();
        });
    });
  });

  describe("/api/v1/cerebral_beers/beer", () => {
    it("get request should have a 200 status", done => {
      chai
        .request(app)
        .get("/api/v1/cerebral_beers/beer")
        .end((error, response) => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it("get request should return the data as JSON", done => {
      chai
        .request(app)
        .get("/api/v1/cerebral_beers/beer")
        .end((error, response) => {
          expect(response).to.be.json;
          done();
        });
    });

    it("get request should return an array with all of the beer", done => {
      chai
        .request(app)
        .get("/api/v1/cerebral_beers/beer")
        .end((error, response) => {
          expect(response.body).to.be.a("array");
          expect(response.body.length).to.equal(3);
          let beerNames = response.body.map(beer => beer.name)
          expect(beerNames.includes('TREMBLING GIANT')).to.equal(true)
          expect(beerNames.includes('TANGERINE-ING THROUGH DIMENSIONS')).to.equal(true)
          expect(beerNames.includes('GUAVA-ING THROUGH DIMENSIONS')).to.equal(true)
          done();
        });
    });

    it("post request should correctly add new beer", done => {
      const newBeer = {
        name: "freddies secret beer",
        description: "omg so amazing wow",
        abv: "110%",
        is_available: true,
        style: "Brettanomyces Saison"
      };

      chai
        .request(app)
        .post("/api/v1/cerebral_beers/beer")
        .send(newBeer)
        .end((error, response) => {
          expect(response).to.have.status(201);
          expect(response.body).to.equal("Beer successfully added!");
          done();
        });
    });

    it("post request should return error message if missing properties", done => {
      const newBeer = {
        name: "freddies secret beer",
        description: "omg so amazing wow",
        abv: "110%",
        is_available: true
      };

      chai
        .request(app)
        .post("/api/v1/cerebral_beers/beer")
        .send(newBeer)
        .end((error, response) => {
          expect(response).to.have.status(422);
          expect(response.error.text).to.equal(
            `{"error":"Missing Properties style"}`
          );
          done();
        });
    });

    describe("patch availibility for /api/v1/cerebral_beers/beer", () => {
      it("patch request should update availability of beer", done => {
        chai
          .request(app)
          .patch("/api/v1/cerebral_beers/beer/Trembling+Giant/true")
          .end((error, response) => {
            expect(response).to.have.status(202);
            expect(response.body).to.equal(
              `Availibility of TREMBLING GIANT sucessfully updated!`
            );
            done();
          });
      });

      it("patch request should fail if availibility not boolean", done => {
        chai
          .request(app)
          .patch("/api/v1/cerebral_beers/beer/Trembling+Giant/nottrue")
          .end((error, response) => {
            expect(response).to.have.status(404);
            expect(response.body).to.equal(
              `Availability must be 'true' or 'false'`
            );
            done();
          });
      });

      it("patch request should fail if beer not in database", done => {
        chai
          .request(app)
          .patch("/api/v1/cerebral_beers/beer/Deep+Tought/true")
          .end((error, response) => {
            expect(response).to.have.status(404);
            expect(response.body).to.equal(
              `Beer 'DEEP TOUGHT' does not exist in database.`
            );
            done();
          });
      });
    });

    describe("patch availibility and abv for /api/v1/cerebral_beers/beer", () => {
      it("patch request should update availability and abv of beer", done => {
        chai
          .request(app)
          .patch("/api/v1/cerebral_beers/beer/Trembling+Giant/true/55")
          .end((error, response) => {
            expect(response).to.have.status(202);
            expect(response.body).to.equal(
              `Availibility and ABV of TREMBLING GIANT sucessfully updated!`
            );
            done();
          });
      });

      it("patch request should fail if availibility not boolean", done => {
        chai
          .request(app)
          .patch("/api/v1/cerebral_beers/beer/Trembling+Giant/nottrue/55")
          .end((error, response) => {
            expect(response).to.have.status(404);
            expect(response.body).to.equal(
              `Availability must be 'true' or 'false'`
            );
            done();
          });
      });

      it("patch request should fail if abv not a number", done => {
        chai
          .request(app)
          .patch("/api/v1/cerebral_beers/beer/Trembling+Giant/true/5asdf5")
          .end((error, response) => {
            expect(response).to.have.status(404);
            expect(response.body).to.equal(
              `Abv must be a number`
            );
            done();
          });
      });

      it("patch request should fail if beer not in database", done => {
        chai
          .request(app)
          .patch("/api/v1/cerebral_beers/beer/Deep+Tought/true/55")
          .end((error, response) => {
            expect(response).to.have.status(404);
            expect(response.body).to.equal(
              `Beer 'DEEP TOUGHT' does not exist in database.`
            );
            done();
          });
      });
    });

    it("delete request should correctly delete beer", done => {
      chai
        .request(app)
        .delete("/api/v1/cerebral_beers/beer/Trembling+Giant")
        .end((error, response) => {
          expect(response).to.have.status(202);
          expect(response.body).to.equal(
            `Beer 'TREMBLING GIANT' successfully deleted!`
          );
          done();
        });
    });

    it("delete request should return error message if beer does not exist", done => {
      chai
        .request(app)
        .delete("/api/v1/cerebral_beers/beer/Grembling+Tiant")
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body).to.equal(
            `No beer 'GREMBLING TIANT' found in database`
          );
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
          let beerNames = response.body.map(beer => beer.name)
          expect(beerNames.includes('TREMBLING GIANT')).to.equal(false)
          expect(beerNames.includes('TANGERINE-ING THROUGH DIMENSIONS')).to.equal(true)
          expect(beerNames.includes('GUAVA-ING THROUGH DIMENSIONS')).to.equal(true)
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

    it("expect error message if style does not exist in db", done => {
      chai
        .request(app)
        .get("/api/v1/cerebral_beers/find_by_style?style_name=mystery+style")
        .end((error, response) => {
          expect(response.body.error).to.equal(
            "No beers found of style: mystery style"
          );
          done();
        });
    });

    describe("/api/v1/cerebral_beers/currently_available", () => {
      it("should have a 200 status", done => {
        chai
          .request(app)
          .get("/api/v1/cerebral_beers/currently_available/true")
          .end((error, response) => {
            expect(response).to.have.status(200);
            done();
          });
      });

      it("should return the data as JSON", done => {
        chai
          .request(app)
          .get("/api/v1/cerebral_beers/currently_available/true")
          .end((error, response) => {
            expect(response).to.be.json;
            done();
          });
      });

      it("should return an array with all of the beer currently available", done => {
        chai
          .request(app)
          .get("/api/v1/cerebral_beers/currently_available/true")
          .end((error, response) => {
            expect(response.body).to.be.a("array");
            expect(response.body.length).to.equal(2);
            let beerNames = response.body.map(beer => beer.name)
            expect(beerNames.includes('TREMBLING GIANT')).to.equal(true)
            expect(beerNames.includes('TANGERINE-ING THROUGH DIMENSIONS')).to.equal(false)
            expect(beerNames.includes('GUAVA-ING THROUGH DIMENSIONS')).to.equal(true)
            done();
          });
      });

      it("should return an array with all of the beer not currently available", done => {
        chai
          .request(app)
          .get("/api/v1/cerebral_beers/currently_available/false")
          .end((error, response) => {
            expect(response.body).to.be.a("array");
            expect(response.body.length).to.equal(1);
            let beerNames = response.body.map(beer => beer.name)
            expect(beerNames.includes('TREMBLING GIANT')).to.equal(false)
            expect(beerNames.includes('TANGERINE-ING THROUGH DIMENSIONS')).to.equal(true)
            expect(beerNames.includes('GUAVA-ING THROUGH DIMENSIONS')).to.equal(false)
            done();
          });
      });
    });
  });
});
