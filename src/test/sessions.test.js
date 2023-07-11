const chai = require("chai");
const supertest = require("supertest");
const { port } = require("../config/config");

const expect = chai.expect;
const requester = supertest(`http://localhost:${port}`);

describe("Testing sessions router", () => {
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
  it("Should register an user succesfully", async () => {
    const { _body } = await requester.post("/sessions/register").send(userMock);
    expect(_body)
      .to.have.property("message")
      .to.be.equals(
        `${userMock.nombre} ${userMock.apellido} te has registrado exitosamente`
      );
  });

  it("Should login an registered user succesfully", async () => {
    const { _body } = await requester
      .post("/sessions/login")
      .send({ email: userMock.email, password: userMock.password });
    expect(_body).to.have.property("token");
    expect(_body).to.have.property("user");
    expect(_body.user).to.have.property("email").to.be.equal(userMock.email);
  });

  it("Should return user at 'current' endpoint", async () => {
    const { _body } = await requester
      .post("/sessions/login")
      .send({ email: userMock.email, password: userMock.password });
    expect(_body).to.have.property("token");
    const token = _body.token;

    const { _body: body } = await requester
      .get("/sessions/current")
      .set("Cookie", [`JWT = ${token}`]);
    expect(body)
      .to.have.property("message")
      .to.be.equal("Usuario actual encontrado");
    expect(body.user.email).to.be.equals(userMock.email);
  });
});
