const { Product } = require("../service/index");
const Error = require("../errors/customError");
const Errors = require("../errors/errorEnum");
const { createProductErrorInfo } = require("../errors/infoLogsError");
const sendMail = require("../utils/sendMail");

class ProductController {
  async getProducts(req, res) {
    const { limit, page, sort, category, status } = req.query;
    try {
      const productsData = await Product.getProducts(
        limit,
        page,
        sort,
        category,
        status
      );
      res.send(productsData);
    } catch (err) {
      req.logger.error(err.message);
      res.status(400).send(err);
    }
  }

  async getProductById(req, res) {
    const { pid } = req.params;
    try {
      const productData = await Product.getProductById(pid);
      res.status(200).send({ status: "succes", payload: productData });
    } catch (err) {
      req.logger.error(err.message);
      res.status(400).send(err);
    }
  }

  async addProduct(req, res) {
    const {
      title,
      category,
      price,
      stock,
      description,
      code,
      thumbnail,
      status,
      owner,
    } = req.body;
    try {
      if (
        !title ||
        !category ||
        !price ||
        !stock ||
        !description ||
        !code ||
        !thumbnail ||
        !status
      )
        Error.createError({
          name: "Error al crear producto",
          message: "Error con los parámetros",
          cause: createProductErrorInfo(req.body),
          code: Errors.INVALID_TYPES,
        });
      const newProd = await Product.addProduct(req.body);
      res.status(200).send({ status: "succes", payload: newProd });
    } catch (err) {
      req.logger.error(err);
      res.status(400).json({
        message: err.message,
      });
    }
  }
  async editProduct(req, res) {
    try {
      const newProd = req.body;
      const { pid } = req.params;
      const { role, email } = req.user;
      const prod = await Product.getProductById(pid);
      if (role === "Premium" && prod.owner !== email) {
        return res.status(400).json({
          message:
            "No tiene permisos para editar este producto, solo productos propios",
        });
      }
      if (Object.keys(newProd).length === 0)
        return res.status(400).send("Enviar producto a actualizar");
      await Product.updateProduct(pid, newProd);
      res.status(200).json({ actualizado: "success" });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
  async deleteProduct(req, res) {
    const { pid } = req.params;
    try {
      const prod = await Product.getProductById(pid);
      const { role, email } = req.user;
      if (role === "Premium" && prod.owner !== email) {
        return res.status(400).json({
          message:
            "No tiene permisos para eliminar este producto, solo productos propios",
        });
      }
      if (role === "Admin" && prod.owner) {
        await sendMail({
          promotor: "futbol@ecommerce.com",
          userMail: prod.owner,
          subject: "Aviso - Producto eliminado",
          html: `<div><p>Si ha recibido este mail es porque el producto ${prod.title} -identificador n° ${prod._id} - ha sido eliminado.</p> 
          <img src='cid:michi'/> </div>`,
          attachments: [
            {
              path: prod.thumbnail,
              cid: "michi",
            },
          ],
        });
      }
      const deleted = await Product.deleteProduct(pid);
      if (deleted !== 0) res.status(200).json({ status: "success" });
      else
        res.status(400).json({
          message: "Error al eliminar producto",
        });
    } catch (err) {
      req.logger.error(err.message);
      res.status(400).json({
        message: "Error al eliminar producto",
      });
    }
  }
}

module.exports = new ProductController();
