const { User } = require("../service/index");
const LoginUserDto = require("../dtos/currentUserDto");
const { generateToken } = require("../utils/token");

class UsuarioController {
  async getUsers(req, res) {
    const usuarios = await User.getUser();
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
  async updateUserTicket(req, res) {
    const { uid, tid } = req.params;
    const updated = await User.updateUserTicket(uid, tid);
    return res.status(200).send({ message: "succesfull", user: updated });
  }

  async toogleUserRole(req, res) {
    try {
      const { uid } = req.params;
      const role = req.user.role;
      const newRole = role === "User" ? "Premium" : "User";
      const user = await User.updateUserRole(uid, newRole);
      if (user) {
        const token = generateToken({ ...new LoginUserDto(user) });

        res.cookie("token", token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        });
        return res.status(200).send({ message: "succesfull", user, token });
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
