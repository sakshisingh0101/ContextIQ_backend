// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// const sendEmail = async (to, subject, html) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"ContextIQ" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html
//     });

//     return info; // important
//   } catch (error) {
//     console.log("Email Error:", error);
//     throw error;
//     // return null;
//   }
// };

// export default sendEmail;


// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// const sendEmail = async (to, subject, html) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"ContextIQ" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html
//     });

//     console.log("Email sent:", info.messageId);
//     return info;
//   } catch (error) {
//     console.log("Email Error:", error);
//     return null;
//   }
// };

// export default sendEmail;

import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "ContextIQ <onboarding@resend.dev>",
      to,
      subject,
      html
    });

    if (error) {
      console.log("Email Error:", error);
      return null;
    }

    console.log("Email sent:", data.id);
    return data;
  } catch (error) {
    console.log("Email Error:", error);
    return null;
  }
};

export default sendEmail;