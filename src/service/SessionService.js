class SessionService {
  constructor(dao) {
    this.dao = dao;
  }
  async getAllUsers() {
    const response = await this.dao.getAllUsers();
    return response;
  }
  //works with email
  async getUser(email) {
    const response = await this.dao.getUser(email);
    return response;
  }
  async createUser(user) {
    const response = await this.dao.createUser(user);
    return response;
  }
  async updateUser(email, password) {
    const response = await this.dao.updateUser(email, password);
    return response;
  }
  async updateLastConection(email, lastConection) {
    const response = await this.dao.updateLastConection(email, lastConection);
    return response;
  }
}

module.exports = SessionService;
