const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require ('../server.js')
const expect = chai.expect
chai.use(chaiHttp)

describe('Server file', () => {
  describe('/api/v1/cerebral_beers', () => {
    it('should have a 200 status', (done) => {
      chai.request(app)
        .get('/api/v1/cerebral_beers')
        .end((error, response) => {
          expect(response).to.have.status(200)
          done()
        })
    })
  })
})