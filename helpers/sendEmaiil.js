const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const msg = { ...data, from: "olexandr_tym@meta.ua" };
  await sgMail.send(msg);
  return true;
};

module.exports = { sendEmail };
