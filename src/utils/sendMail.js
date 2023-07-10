const { createTransport } = require("nodemailer");
const { mailing } = require("../config/config");

const transport = createTransport({
  service: "gmail",
  port: 578,
  auth: {
    user: mailing.testUser,
    pass: mailing.testPassword,
  },
});

let from = `Servicio de reset pass de <${mailing.testUser}>`;

const sendMail = async ({
  promotor,
  userMail,
  subject,
  html,
  atachments = [],
}) => {
  return await transport.sendMail({
    from: promotor,
    to: userMail,
    subject,
    html,
    atachments,
  });
};

module.exports = sendMail;
