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

// import { Resend } from "resend";
// import dotenv from "dotenv";
// dotenv.config();

// const resend = new Resend(process.env.RESEND_API_KEY);

// const sendEmail = async (to, subject, html) => {
//   try {
//     const { data, error } = await resend.emails.send({
//       from: "ContextIQ <onboarding@resend.dev>",
//       to,
//       subject,
//       html
//     });

//     if (error) {
//       console.log("Email Error:", error);
//       return null;
//     }

//     console.log("Email sent:", data.id);
//     return data;
//   } catch (error) {
//     console.log("Email Error:", error);
//     return null;
//   }
// };

// export default sendEmail;


// import * as brevo from "@getbrevo/brevo";
// import dotenv from "dotenv";
// dotenv.config();

// let defaultClient = brevo.ApiClient.instance;
// let apiKey = defaultClient.authentications["api-key"];
// apiKey.apiKey = process.env.BREVO_API_KEY;

// const apiInstance = new brevo.TransactionalEmailsApi();

// const sendEmail = async (to, subject, html) => {
//   try {
//     const sendSmtpEmail = new brevo.SendSmtpEmail();
//     sendSmtpEmail.subject = subject;
//     sendSmtpEmail.htmlContent = html;
//     sendSmtpEmail.sender = { name: "ContextIQ", email: process.env.BREVO_SENDER_EMAIL };
//     sendSmtpEmail.to = [{ email: to }];

//     const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
//     console.log("Email sent:", response);
//     return response;
//   } catch (error) {
//     console.log("Email Error:", error);
//     return null;
//   }
// };

// export default sendEmail;

import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (to, subject, html) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "api-key": process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: "ContextIQ", email: process.env.BREVO_SENDER_EMAIL },
        to: [{ email: to }],
        subject,
        htmlContent: html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Email Error:", data);
      return null;
    }

    console.log("Email sent:", data);
    return data;
  } catch (error) {
    console.log("Email Error:", error);
    return null;
  }
};

export default sendEmail;