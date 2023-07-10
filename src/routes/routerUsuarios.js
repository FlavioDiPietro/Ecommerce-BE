const { Router } = require("express");
const usersController = require("../controller/usersController");
const passportAutenticate = require("../middlewares/passportAutenticate");
const passportAuthorize = require("../middlewares/passportAuthorize");

const routerUsuarios = Router();

routerUsuarios.get(
  "/current",
  passportAutenticate("current"),
  usersController.getUsers
);
routerUsuarios.put(
  "/premium/:uid",
  passportAutenticate("current"),
  passportAuthorize(["User", "Premium"]),
  usersController.toogleUserRole
);

routerUsuarios.put(
  "/:uid/documents",
  passportAutenticate("current"),
  passportAuthorize(["User", "Premium"]),
  usersController.toogleUserRole
);

routerUsuarios.put(
  "/:uid/:cid",
  passportAutenticate("current"),
  usersController.updateUserCart
);

module.exports = routerUsuarios;
