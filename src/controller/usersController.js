const { User, Session } = require("../service/index");
const LoginUserDto = require("../dtos/currentUserDto");
const { generateToken } = require("../utils/token");

class UsuarioController {
  async getUser(req, res) {
    const { id } = req.params;
    if (!id)
      res
        .status(404)
        .send({ status: 404, error: "No existe id para buscar usuario" });
    const usuarios = await User.getUser(id);
    res.status(200).send({
      usuarios,
    });
  }
  catch(err) {
    res.send({ error: err.message });
  }

  async getAllUsers(req, res) {
    const usuarios = await User.getAllUsers();
    res.status(200).send({
      usuarios,
    });
  }
  catch(err) {
    res.send({ error: err.message });
  }

  async updateUserCart(req, res) {
    const { uid, cid } = req.params;
    const updated = await User.updateUserCart(uid, cid);
    return res.status(200).send({ message: "succesfull", user: updated });
  }

  async deleteAllInactiveUsers(req, res) {
    const deleted = [];
    const usuarios = await User.getAllUsers();

    const shouldDeleteForInactivity = (usrLastConextionOnMls) => {
      const twoDaysOnMls = 2 * 24 * 60 * 60 * 1000;
      const twoDaysAgoDateOnMls = new Date().getTime() - twoDaysOnMls;
      return usrLastConextionOnMls <= twoDaysAgoDateOnMls;
    };
    usuarios.forEach(async (usr) => {
      if (usr.ultimaConexion && shouldDeleteForInactivity(usr.ultimaConexion)) {
        deleted.push(usr.email);
        await User.deleteUser(usr._id);
      }
    });

    return res.status(200).send({ message: "succesfull", deleted });
  }

  async deleteUser(req, res) {
    const { uid } = req.params;
    const deleted = await User.deleteUser(uid);
    return res.status(200).send({ message: "succesfull", user: deleted });
  }

  async updateUserTicket(req, res) {
    const { uid, tid } = req.params;
    const updated = await User.updateUserTicket(uid, tid);
    return res.status(200).send({ message: "succesfull", user: updated });
  }

  async toogleUserRole(req, res) {
    try {
      const { uid } = req.params;
      const { role } = await User.getUser(uid);
      const newRole = role === "User" ? "Premium" : "User";
      const newUser = await User.updateUserRole(uid, newRole);

      if (newUser) {
        const token = generateToken({ ...new LoginUserDto(newUser) });
        res.cookie("token", token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        });
        return res.status(200).send({ message: "succesfull", newUser, token });
      } else {
        return res
          .status(400)
          .send({ message: "Error al modificar membresía" });
      }
    } catch (err) {
      return res.status(400).send({ message: "Error al modificar membresía" });
    }
  }
}

module.exports = new UsuarioController();
