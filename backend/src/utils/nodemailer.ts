import nodemailer from "nodemailer";

export async function sendOtp(email: string, otp: String): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "Gmail",

    auth: {
      user: process.env.NODE_MAILER_EMAIL,
      pass: process.env.NODE_MAILER_PASS,
    },
  });
  const mailOptions = {
    from: process.env.NODE_MAILER_EMAIL,
    to: email,
    subject: "Otp Created For your Image Manger",
    text: `Your otp is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}


export async function SendToMail(email: string, context: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "Gmail",

    auth: {
      user: process.env.NODE_MAILER_EMAIL,
      pass: process.env.NODE_MAILER_PASS,
    },
  });
  const mailOptions = {
    from: process.env.NODE_MAILER_EMAIL,
    to: email,
    subject: "Reset Password link is here",
    text: context,
  };

  await transporter.sendMail(mailOptions);
}