const { Router } = require("express");
const usersController = require("../controller/usersController");
const passportAutenticate = require("../middlewares/passportAutenticate");
const passportAuthorize = require("../middlewares/passportAuthorize");

const routerUsuarios = Router();

routerUsuarios.get(
  "/",
  passportAutenticate("current"),
  passportAuthorize(["Admin"]),
  usersController.getAllUsers
);
routerUsuarios.put(
  "/premium/:uid",
  passportAutenticate("current"),
  passportAuthorize(["User", "Premium", "Admin"]),
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

routerUsuarios.delete(
  "/:uid",
  passportAutenticate("current"),
  usersController.deleteUser
);

module.exports = routerUsuarios;
