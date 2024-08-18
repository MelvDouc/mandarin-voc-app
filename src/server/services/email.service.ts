import { createTransport } from "nodemailer";

const adminEmail = process.env.NODEMAILER_APP_USER;

const transport = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: adminEmail,
    pass: process.env.NODEMAILER_APP_PASSWORD,
  }
});

const sendEmail = ({ to, subject, content }: {
  to: string;
  subject: string;
  content: string;
}) => {
  return transport.sendMail({
    from: adminEmail,
    to,
    subject,
    html: content
  });
};

export default {
  sendEmail
};