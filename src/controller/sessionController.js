const { validatePassword, cryptPass } = require("../utils/bcrypt");
const sendMail = require("../utils/sendMail");
const { generateToken, mailingVerifyToken } = require("../utils/token");
const { Session } = require("../service/index");
const LoginUserDto = require("../dtos/currentUserDto");
const CurrentUserDto = require("../dtos/currentUserDto");
const { jwt, adminEmail, adminPassword, port } = require("../config/config");

class SessionControler {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const dbUser = await Session.getUser(email);
      if (dbUser === null || dbUser === undefined)
        return res.status(400).send({ message: "No existe el usuario" });
      if (!validatePassword(dbUser, password))
        return res.status(400).send({ message: "Password Incorrecta" });
      const user = { ...new LoginUserDto(dbUser) };
      const token = generateToken(user);
      req.logger.info(`tokenEnLogin: ${token}`);
      if (!token) res.status(400).send({ message: "Error al loguearse" });

      const conectionTime = Date.now();
      await Session.updateLastConection(email, conectionTime);
      user.ultimaConexion = conectionTime;
      res
        .cookie("cookieTest", "texto", {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        })
        .send({ message: "Logueado exitosamente", user, token });
    } catch (err) {
      res.status(400).send({ message: "Error al loguear" });
    }
  }

  async register(req, res) {
    const avatar = req.file.path;
    const {
      email,
      password,
      nombre,
      apellido,
      edad,
      fecha,
      isPremium = false,
    } = req.body;
    if (
      !email ||
      !password ||
      !nombre ||
      !avatar ||
      !apellido ||
      !edad ||
      !fecha
    )
      return res.status(400).send({ message: "Campos incompletos" });
    const usr = await Session.getUser(email);

    if (usr) {
      return res.status(400).send({
        message: "Usuario ya registrado",
      });
    }
    const role = isPremium
      ? "Premium"
      : email === adminEmail && password === adminPassword
      ? "Admin"
      : "User";
    const user = {
      nombre,
      apellido,
      email,
      password: cryptPass(password),
      edad,
      avatar,
      role,
      fecha,
    };
    try {
      await Session.createUser(user);
      return res.status(200).send({
        message: `${user.nombre} ${user.apellido} te has registrado exitosamente`,
      });
    } catch (err) {
      return res.status(400).send({
        message: `Error al registrarse, revise los campos`,
      });
    }
  }

  async reloginPetition(req, res) {
    try {
      const { mail } = req.body;
      if (!mail)
        return res.status(400)({
          status: "Error",
          message: "Completar todos los campos",
        });
      const user = await Session.getUser(mail);
      if (!user) {
        req.logger.warning("Fue el caso");
        return res.status(400).send({
          status: "Error",
          message: "Email no registrado",
        });
      }
      const token = generateToken(user, "1h");
      const mailContentConfig = {
        promotor: `Servicio de reset contraseña`,
        userMail: mail,
        subject: "Reinicio de contraseña",
        html: `
          <div>
            <h2>
              ${user.nombre} ${user.apellido} has solicitado cambiar tu contraseña
            </h2>
            <a href= http://localhost:${port}/sessions/reset-password/${token}>
              <button>Generar nueva contraseña</button>
            </a>
            <p>
              Si no has solicitado el cambio de contraseña, desestima este mail
            </p>
          </div>
          `,
      };
      await sendMail(mailContentConfig);

      return res.status(200).send({
        status: "success",
        message: "Se ha enviado un correo con instrucciones a su casilla",
      });
    } catch (err) {
      return res.status(400).send({
        status: "Error",
        message: `Error al solictar actualización de password`,
      });
    }
  }

  async reloginCheck(req, res) {
    try {
      const { token } = req.params;
      if (!token)
        return res.status(200).redirect(`http://localhost:5173/reloginError`);
      const isValid = mailingVerifyToken(token);
      isValid
        ? res.status(200).redirect(`http://localhost:5173/relogin`)
        : res.status(400).redirect(`http://localhost:5173/reloginError`);
    } catch (err) {
      req.logger.error(`Reset-password token error`);
      res.status(200).redirect(`http://localhost:5173/reloginError`);
    }
  }
  async relogin(req, res) {
    try {
      const { mail, password } = req.body;
      if (!mail || !password)
        return res.send({
          status: 404,
          message: "Completar todos los campos",
        });
      const user = await Session.getUser(mail);
      if (!user)
        return res.send({
          status: 404,
          message: "Email no registrado",
        });
      const parsedPass = password.toString();
      if (validatePassword(user, parsedPass))
        return res.status(400).send({
          message:
            "La contraseña introducida coincide con la contraseña actual",
        });
      const result = await Session.updateUser(mail, cryptPass(parsedPass));
      if (result) {
        res.send({
          success: 200,
          message: `${user.nombre} ${user.apellido} has actualizado tu contraseña exitosamente.`,
        });
      } else return res.send({ message: "Error al actualizar contraseña" });
    } catch (err) {
      return res.status(400).send({
        message: `Error al actualizar intente nuevamente`,
      });
    }
  }
  async logout(req, res) {
    const lastConextion = Date.now();
    await Session.updateLastConection(req.user.email, lastConextion);
    req.user = "";
    res.clearCookie(jwt);
    res.status(200).send({ message: "deslogueo exitoso" });
  }
  async current(req, res) {
    try {
      const email = req.user.email;
      const dbUser = await Session.getUser(email);
      if (dbUser === null || dbUser === undefined)
        return res.status(400).send({ message: "No existe el usuario" });
      const user = new CurrentUserDto(dbUser);
      res.status(200).send({ message: "Usuario actual encontrado", user });
    } catch (err) {
      req.logger.error(err.message);
    }
  }
}

module.exports = new SessionControler();
