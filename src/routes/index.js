const { Router } = require("express");
const routerUsuarios = require("./routerUsuarios");
const routerProductos = require("./routerProductos");
const routerCarritos = require("./routerCarritos");
const sessionsRouter = require("./routerSession");
const mailRouter = require("./routerMail");
const routerChat = require("./routerChat");
const routerMocking = require("./routerMocking");
const routerError = require("./routerError");
const errorHandler = require("../middlewares/routeErrorMiddleware");
const uploaderMid = require("../middlewares/uploaderMiddleware");

const router = Router();

router.use("/api/products", routerProductos);
router.use("/api/carts", routerCarritos);
router.use("/api/users", routerUsuarios);
router.use("/sessions", sessionsRouter);
router.use("/api/mail", mailRouter);
router.use("/api/chat", routerChat);
router.use("/api/mocking", routerMocking);
router.use("/loggerTest", routerError);

router.post("/upload/:type", uploaderMid, (req, res) => {
  res.status(200).json({
    mensaje: "se a subido con éxito el archivo",
  });
});
module.exports = router;
