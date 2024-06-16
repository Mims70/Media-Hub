const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
      },
      tls: {
        rejectUnauthorized: false // Ignore SSL certificate errors
      }
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);

    // Define email options
    const options = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: subject,
      html: compiledTemplate(payload),
    };

    // Send email
    transporter.sendMail(options, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        // Handle error appropriately, such as returning an error response
        // For now, re-throw the error to be handled by the catch block
        throw error;
      } else {
        // Log success message
        console.log("Email sent:", info.response);
        // You might want to return a success response here if needed
      }
    });
  } catch (error) {
    // Log and handle any errors that occurred during the email sending process
    console.error("Error sending email:", error);
    // You can return an error response or re-throw the error to be handled by the caller
    throw error;
  }
};

module.exports = sendEmail;