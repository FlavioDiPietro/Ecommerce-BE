const chai = require("chai");
const supertest = require("supertest");
const { port } = require("../config/config");

const expect = chai.expect;
const requester = supertest(`http://localhost:${port}`);

describe("Testing cart router", () => {
  let token;
  let cartId;
  //register an login user
  before(async function () {
    const random = Math.floor(Math.random() * 10000);
    const userMock = {
      nombre: "Test",
      apellido: "Prueba",
      email: `test${random}@gmail.com`,
      edad: 20,
      password: "123",
      avatar: "img-test",
      fecha: Date.now(),
    };
    await requester.post("/sessions/register").send(userMock);
    const { _body } = await requester.post("/sessions/login").send(userMock);
    token = _body.token;
  });
  it("should create an empty cart for logged user", async () => {
    const { _body } = await requester
      .post("/api/carts")
      .set("Cookie", [`JWT = ${token}`]);
    expect(_body).to.have.property("id");
    cartId = _body.id;
  });

  it("should get an array of products from a cart", async () => {
    const { _body } = await requester
      .get(`/api/carts/${cartId}`)
      .set("Cookie", [`JWT = ${token}`]);
    expect(_body).to.have.property("cartProducts");
    expect(Array.isArray(_body.cartProducts)).to.be.true;
  });

  it("should delete a cart ", async () => {
    const { _body } = await requester
      .delete(`/api/carts/${cartId}`)
      .set("Cookie", [`JWT = ${token}`]);
    expect(_body).to.have.property("status").to.be.equals("success");
  });
});
