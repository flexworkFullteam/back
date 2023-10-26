// emailConfig.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' }); // Establece la ubicación de tu archivo .env
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});/*
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  }
});*/

module.exports = transporter;
