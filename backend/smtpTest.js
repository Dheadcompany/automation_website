const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com", // or smtp.zoho.eu if you use Zoho Europe
  port: 465, // or 587 for TLS
  secure: true, // true for 465, false for 587
  auth: {
    user: "nelson@vdltechnologies.com",
    pass: "Chinnels120596", // replace with the actual password or app password
  },
});

const mailOptions = {
  from: "nelson@vdltechnologies.com",
  to: "dheadmediacompany1@gmail.com",
  subject: "SMTP Test from Node.js",
  text: "This is a test email sent directly via Zoho SMTP.",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log("Error:", error);
  }
  console.log("Email sent:", info.response);
});
