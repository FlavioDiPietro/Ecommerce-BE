const chai = require("chai");
const supertest = require("supertest");
const { port, adminEmail, adminPassword } = require("../config/config");

const expect = chai.expect;
const requester = supertest(`http://localhost:${port}`);

describe("Testing productos", () => {
  let adminToken;
  let createdProdId;
  const mockProd = {
    title: "Producto-Test",
    category: "Delanteros",
    price: 100,
    stock: 1,
    description: "description-test",
    code: "abc-test",
    thumbnail: "img-test",
    status: "true",
  };
  before(async function () {
    const { _body } = await requester
      .post("/sessions/login")
      .send({ email: adminEmail, password: adminPassword });
    adminToken = _body.token;
  });
  it("get all products should return an array", async () => {
    const { _body } = await requester.get("/api/products");
    expect(Array.isArray(_body.docs)).to.be.true;
  });
  it("Should create a single product as Admin profile", async () => {
    const { _body } = await requester
      .post("/api/products")
      .send(mockProd)
      .set("Cookie", [`JWT = ${adminToken}`]);
    expect(_body.payload).to.have.property("_id");
    expect(_body.payload.title).to.be.equal(mockProd.title);
    createdProdId = _body.payload._id;
  });

  it("Should find a single product by Id", async () => {
    const { _body } = await requester
      .get(`/api/products/${createdProdId}`)
      .set("Cookie", [`JWT = ${adminToken}`]);
    expect(_body.payload).to.have.property("_id");
    expect(_body.payload.title).to.be.equal(mockProd.title);
    expect(_body.payload._id).to.be.equal(createdProdId);
  });

  it("Should upadate a product product by Id", async () => {
    const { _body } = await requester
      .put(`/api/products/${createdProdId}`)
      .send({ ...mockProd, title: "Prod Actualizado" })
      .set("Cookie", [`JWT = ${adminToken}`]);
    expect(_body).to.have.property("actualizado").to.be.equal("success");
  });

  it("Should delete a product product by Id", async () => {
    const { _body } = await requester
      .delete(`/api/products/${createdProdId}`)
      .set("Cookie", [`JWT = ${adminToken}`]);
    expect(_body).to.have.property("status").to.be.equal("success");
  });
});
