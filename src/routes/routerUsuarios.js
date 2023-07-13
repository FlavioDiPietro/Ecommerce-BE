const { Router } = require("express");
const usersController = require("../controller/usersController");
const passportAutenticate = require("../middlewares/passportAutenticate");
const passportAuthorize = require("../middlewares/passportAuthorize");
const { uploader } = require("../utils/uploader");

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
  passportAuthorize(["Admin"]),
  usersController.deleteUser
);
routerUsuarios.delete(
  "/",
  passportAutenticate("current"),
  passportAuthorize(["Admin"]),
  usersController.deleteAllInactiveUsers
);

routerUsuarios.post(
  "/:uid/documents",
  passportAutenticate("current"),
  passportAuthorize(["User"]),
  uploader.fields([
    { name: "id" },
    { name: "comproDom" },
    { name: "comproCuen" },
  ]),
  usersController.uploadDocuments
);

module.exports = routerUsuarios;
