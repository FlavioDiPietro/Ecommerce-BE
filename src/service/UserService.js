class UserService {
  constructor(dao) {
    this.dao = dao;
  }
  async getAllUsers() {
    const usuario = await this.dao.getAllUsers();
    return usuario;
  }
  //works with id
  async getUser(id) {
    const usuario = await this.dao.getUserById(id);
    return usuario;
  }
  async createUser(user) {
    const usuario = await this.dao.createUser(user);
    return usuario;
  }
  async updateUser(email, password) {
    const usuario = await this.dao.updateUser(email, password);
    return usuario;
  }
  async updateUserCart(id, cid) {
    const usuario = await this.dao.updateUserCart(id, cid);
    return usuario;
  }
  async deleteUser(uid) {
    const usuario = await this.dao.deleteUser(uid);
    return usuario;
  }
  async updateUserTicket(uid, tid) {
    const usuario = await this.dao.updateUserTicket(uid, tid);
    return usuario;
  }
  async updateUserRole(uid, role) {
    const usuario = await this.dao.updateUserRole(uid, role);
    return usuario;
  }
  async updateUserDocuments(uid, documents) {
    const usuario = await this.dao.updateUserDocuments(uid, documents);
    return usuario;
  }
}

module.exports = UserService;
