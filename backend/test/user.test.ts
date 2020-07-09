import app from '../src/app';
import chaiHttp from 'chai-http';
import chai from 'chai';

chai.should();
chai.use(chaiHttp);

describe('POST /v1/login', () => {
    it('should return 400 err code for unauthorized user', (done) => {
        chai.request(app)
            .post('/v1/login')
            .set('content-type', 'application/json')
            .send({ email: 'john@apple.com', password: 'qwerty' })
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
    });

    it('should return 200 for a valid user login', (done) => {
        chai.request(app)
            .post('/v1/login')
            .set('content-type', 'application/json')
            .send({ email: 'foo@bar.com', password: 'foobar' })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
