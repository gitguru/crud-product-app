const Product = require("../models/product.model");
const request = require("supertest");
const chai = require("chai");
const app = require("../app");

const expect = chai.expect;

describe("products", () => {
    beforeEach(async () => {
        await Product.deleteMany({});
    });

    describe("GET /", () => {
        it("should return all products", async () => {
            const products = [
                {name: "test", price: 11.22},
                {name: "test1", price: 22.33}
            ];
            await Product.insertMany(products);

            const res = await request(app).get("/products");
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(2);
        });
    });

    describe("GET/:id", () => {
        it("should return a product if valid id is passed", async () => {
            const product = new Product({
                name: "test",
                price: 22.33
            });
            await product.save();
            const res = await request(app).get("/products/" + product._id);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property("name", product.name);
        });

        it("should return 400 error when invalid object id is passed", async () => {
            const res = await request(app).get("/products/1");
            expect(res.status).to.equal(500);
        });

        it("should return 404 error when valid object id is passed but does not exist", async () => {
            const res = await request(app).get("/products/111111111111");
            expect(res.status).to.equal(404);
        });
    });

    describe("POST /", () => {
        it("should return product when the all request body is valid", async () => {
            const res = await request(app)
                .post("/products/create")
                .send({
                    name: "test",
                    price: 22.44
                });
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property("_id");
            expect(res.body).to.have.property("name", "test");
            expect(res.body).to.have.property("price", 22.44);
        });

        // add more tests to validate request body accordingly eg, make sure name is more than 3 characters etc
    });

    describe("PUT /:id", () => {
        it("should update the existing product and return 200", async () => {
            const product = new Product({
                name: "test",
                price: 33.44
            });
            await product.save();

            const res = await request(app)
                .put("/products/" + product._id + "/update")
                .send({
                    name: "newTest",
                    price: 11.22
                });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property("name", "newTest");
            expect(res.body).to.have.property("price", 11.22);
        });
    });

    describe("DELETE /:id", () => {
        it("should delete requested id and return response 200", async () => {
            const product = new Product({
                name: "test",
                price: 44.55
            });
            await product.save();

            const res = await request(app).delete("/products/" + product._id + "/delete");
            expect(res.status).to.be.equal(200);
        });

        it("should return 404 when deleted product is requested", async () => {
            const product = new Product({
                name: "test",
                price: 44.55
            });
            await product.save();

            let res = await request(app).delete("/products/" + product._id + "/delete");
            expect(res.status).to.be.equal(200);

            res = await request(app).get("/products/" + product._id);
            expect(res.status).to.be.equal(404);
        });
    });
});