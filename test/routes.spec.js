const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require ('../server.js')
const expect = chai.expect
chai.use(chaiHttp)

describe('Server file', () => {
  describe('/api/v1/cerebral_beers/styles', () => {
    it('should have a 200 status', (done) => {
      chai.request(app)
        .get('/api/v1/cerebral_beers/styles')
        .end((error, response) => {
          expect(response).to.have.status(200)
          done()
        })
    })
    it('should return the data as JSON', (done) => {
      chai.request(app)
        .get('/api/v1/cerebral_beers/styles')
        .end((error, response) => {
          expect(response).to.be.json
          done()
        })
    })
  })

})