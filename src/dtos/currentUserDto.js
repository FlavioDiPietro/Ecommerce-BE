const fs = require("fs");
const { Blob } = require("buffer");

class CurrentUserDto {
  constructor(user) {
    this.nombre = user.nombre;
    this.apellido = user.apellido;
    this.email = user.email;
    this.edad = user.edad;
    this._id = user._id;
    this.avatar = new Blob([fs.readFileSync(user.avatar)]);
    this.role = user.role;
    this.fecha = user.fecha;
    this.carrito = user.carrito;
    this.ultimaConexion = user.ultimaConexion;
  }
}

module.exports = CurrentUserDto;
