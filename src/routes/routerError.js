const { Router } = require("express");
const routerError = Router();
const program = require("../../process");
const { mode } = program.opts();

const isDevelop = mode === "DEVELOPMENT";

routerError.get("/:level", (req, res) => {
  const { level } = req.params;
  switch (level) {
    case "fatal": {
      req.logger.fatal("FatalLog originado en ruta de prueba");
      break;
    }
    case "error": {
      req.logger.error("ErrorLog originado en ruta de prueba");
      break;
    }
    case "warning": {
      req.logger.warning("WarningLog originado en ruta de prueba");
      break;
    }
    case "info": {
      req.logger.info("InfoLog originado en ruta de prueba");
      break;
    }
    case "http": {
      isDevelop && req.logger.http("HttpLog originado en ruta de prueba");
      break;
    }
    case "debug": {
      isDevelop && req.logger.debug("DebugLog originado en ruta de prueba");
      break;
    }
  }
  res.send("Error de prueba resuelto");
});

module.exports = routerError;
