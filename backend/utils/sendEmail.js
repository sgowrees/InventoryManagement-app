const nodemailer = require("nodemailer");

const sendemail = async (subject, message, send_to, sent_from, reply_to) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    const options = {
      from: sent_from,
      to: send_to,
      replyTo: reply_to,
      subject: subject,
      html: message,
    };

    const info = await transporter.sendMail(options);

    console.log("Email sent:", info.response);
    return info;

  } catch (error) {
    console.log("Error sending email:", error);
    throw error;
  }
};

module.exports = sendemail;