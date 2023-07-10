const autorization = (roles) => async (req, res, next) => {
  if (!req.user)
    return res.status(403).send({ message: "Usuario no autorizado" });
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .send({ message: "No tiene permisos para esta acción" });
  }
  next();
};

module.exports = autorization;
