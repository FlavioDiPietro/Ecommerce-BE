const { Router } = require("express");
const { createTransport } = require("nodemailer");
const twilio = require("twilio");
const { mailing } = require("../config/config");

const mailRouter = Router();

const transport = createTransport({
  service: "gmail",
  port: 578,
  auth: {
    user: mailing.testUser,
    pass: mailing.testPassword,
  },
});
mailRouter.get("/", async (req, res) => {
  try {
    let result = await transport.sendMail({
      from: mailing.testUser,
      to: "marian.caro2@gmail.com",
      subject: "hola, querido",
      html: "<div><p>Hola, este es un mail de prueba enviado desde la app en la que estoy trabajando</p> <p>El tema de la clase 30 es 'mailing' y use tu mail para probar</p> <img src='cid:michi'/> </div>",
      attachments: [
        {
          path: "https://http2.mlstatic.com/D_NQ_NP_701432-MLM53233840358_012023-V.jpg",
          cid: "michi",
        },
      ],
    });
    res.status(200).send({ message: "mensaje enviado" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

const client = twilio(mailing.twilioSid, mailing.twilioToken);
mailRouter.get("/twilio", async (req, res) => {
  try {
    await client.messages.create({
      body: "Este es un mensaje para michiburona",
      from: mailing.twilioPhone,
      to: mailing.ownPhone,
    });
    res.status(200).send({ message: "Mensaje enviado" });
  } catch (err) {
    req.logger.error(err.message);
  }
});

module.exports = mailRouter;
