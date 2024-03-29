const userModel = require("../../models/userModel");
const { Types } = require("mongoose");

class UserManager {
  constructor() {
    this.model = userModel;
  }
  async getAllUsers() {
    try {
      //const { page = 1 } = req.query;
      //const usuarios = await this.model.paginate({}, { limit: 1, page, lean: true }); // variante con paginado
      const usuarios = await this.model.find({}).lean();
      return usuarios;
    } catch (err) {
      throw new Error("Error buscar usuarios", err);
    }
  }
  async getUser(email) {
    try {
      const usuario = await this.model.findOne({ email }).lean();
      return usuario;
    } catch (err) {
      throw new Error("Error al buscar usuario", err);
    }
  }

  async getUserById(uid) {
    try {
      const usuario = await this.model
        .findOne({ _id: new Types.ObjectId(uid) })
        .lean();
      return usuario;
    } catch (err) {
      throw new Error("Error al buscar usuario", err);
    }
  }
  async createUser(user) {
    try {
      await this.model.create(user);
    } catch (err) {
      throw new Error("Error al crear usuario", err);
    }
  }
  async updateUser(email, password) {
    try {
      const updated = await this.model.findOneAndUpdate(
        { email },
        { password }
      );
      return updated;
    } catch (err) {
      throw new Error("Error al actualizar credenciales de usuario", err);
    }
  }
  async deleteteUser(uid) {
    try {
      const deleted = await this.model.findByIdAndDelete(uid);
      return deleted;
    } catch (err) {
      throw new Error("Error al actualizar credenciales de usuario", err);
    }
  }
  async updateLastConection(email, lastConection) {
    try {
      const updated = await this.model.findOneAndUpdate(
        { email },
        { ultimaConexion: lastConection },
        { new: true }
      );
      return updated;
    } catch (err) {
      throw new Error("Error al actualizar ultima conexión del usuario", err);
    }
  }
  async updateUserRole(uid, role) {
    try {
      const updated = await this.model.findOneAndUpdate(
        { _id: new Types.ObjectId(uid) },
        { role },
        { new: true }
      );
      return updated;
    } catch (err) {
      throw new Error("Error al actualizar role de usuario", err);
    }
  }

  async updateUserCart(id, cid) {
    try {
      return await this.model.findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        { carrito: new Types.ObjectId(cid) },
        { new: true }
      );
    } catch (err) {
      throw new Error("Error al actualizar carrito de usuario", err);
    }
  }

  async deleteUser(id) {
    try {
      await this.model.findByIdAndDelete(new Types.ObjectId(id));
    } catch (err) {
      throw new Error("Error al eliminar usuario", err);
    }
  }

  async updateUserTicket(uid, tid) {
    try {
      await this.model.findOneAndUpdate(
        { _id: new Types.ObjectId(uid) },
        { ticket: new Types.ObjectId(tid) }
      );
    } catch (err) {
      throw new Error("Error al actualizar el ticked del usuario", err);
    }
  }

  async updateUserDocuments(uid, documents) {
    try {
      const result = await this.model.findOneAndUpdate(
        { _id: new Types.ObjectId(uid) },
        { documents },
        { new: true }
      );
      return result;
    } catch (err) {
      console.log(err.message);
      throw new Error("Error actualizar documentos del usuario", err);
    }
  }
}

module.exports = UserManager;
