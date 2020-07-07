import request from "supertest";
import app from "../src/app";
import { expect } from "chai";

describe("POST /v1/login", () => {
    it("should return 400 err code for unauthorized user", (done) => {
        return request(app).post("/v1/login")
            .set("content-type", "application/json")
            .send({email: "john@apple.com", password: "qwerty"})
            .expect(400)
            .end(function(err, res) {
                console.log(res.text);
                if (err) done(err);
                done();
            });

    });

    it("should return 200 for a valid user login", done => {
        return request(app).post("/v1/login")
            .set("content-type", "application/json")
            .send({ email: "foo@bar.com", password: "foobar"})
            .expect(200)
            .end((err, res) => {
                console.log(res.text);
               if (err) done(err);
               done();
            });
    });
});
