const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_KEY,
  },
});

const initiateMail = async (payload) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: payload.email,
      subject: "Login info for Testify",
      html: `
            <p>Hello ${payload.name},</p>
            <p>Your account has been created by the admin.</p>
            <p><strong>Temporary Password:</strong> ${payload.password}
            <hr/>
            <strong>Email : </strong> ${payload.email}
            </p>
            <p>Please log in with this info.</p>
            <a href="http://localhost:5173/sign-in">Login Now</a>
            `,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error while sending mail", err);
  }
};

module.exports = initiateMail;