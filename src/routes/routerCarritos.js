const { Router } = require("express");
const cartController = require("../controller/cartController");
const passportAutenticate = require("../middlewares/passportAutenticate");
const passportAuthorize = require("../middlewares/passportAuthorize");

const carritoRouter = Router();

carritoRouter.post(
  "/",
  passportAutenticate("current"),
  passportAuthorize(["User", "Premium"]),
  cartController.crearCarrito
);

carritoRouter.get(
  "/:cid",
  passportAutenticate("current"),
  passportAuthorize(["User", "Premium"]),
  cartController.getProductsFromCart
);

carritoRouter.post(
  "/update",
  passportAutenticate("current"),
  passportAuthorize(["User", "Premium"]),
  cartController.updateProductQuantityFromCart
);
carritoRouter.delete(
  "/:cid",
  passportAutenticate("current"),
  passportAuthorize(["User", "Premium"]),
  cartController.deleteCart
);

carritoRouter.post(
  "/:cid/purchase",
  passportAutenticate("current"),
  passportAuthorize(["User", "Premium"]),
  cartController.purchase
);
carritoRouter.delete(
  "/:cid/:pid",
  passportAutenticate("current"),
  passportAuthorize(["User", "Premium"]),
  cartController.deleteSingleProduct
);

module.exports = carritoRouter;
