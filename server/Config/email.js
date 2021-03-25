const nodemailer = require('nodemailer');
let email = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.email,
    pass: process.env.email_Password,
  },
});




module.exports = email;
