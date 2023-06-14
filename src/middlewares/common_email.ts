import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import { config } from "dotenv";
import path from "path";
config();
import hbs from "hbs";
import handlebars from "handlebars";
const nodemailer_email = process.env.NODEMAILER_MAIL;
const nodemailer_password = process.env.NODEMAILER_PASSWORD;
// const nodemailer_email = 'manpreet.henceforth@gmail.com'
// const nodemailer_password = 'Manpreet@123'

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: nodemailer_email,
      pass: nodemailer_password,
    },
  })
);

const send_welcome_mail = async (email: any,name: any,otp: any,subject: any,source: any,admin_address: any) => {
  try {
    const template = handlebars.compile(source);
    const htmlToSend = template({
      // Data to be sent to template engine.
      subject: subject,
      name: name,
      admin_address: admin_address,
      otp: otp,
    });

    var mailOptions = {
      from: nodemailer_email,
      to: email,
      subject: subject,
      html: htmlToSend,  
    };
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (err) {
    console.log(err);
    // throw err;
  }
  return "success";
};

const send_order_mail = async (email:any,subject:any, template:any) => {
  try {
    // const template = handlebars.compile(source);
    // const htmlToSend = template({
    //   subject: subject,
    //   name: name,
    //   admin_address: admin_address,
    //   // otp: otp,
    // });

    var mailOptions = {
      from: nodemailer_email,
      to: email,
      subject: subject,
      html: template,
    };
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (err) {
    console.log(err);
    // throw err;
  }
  return "success";
};

// export default send_email
export { send_welcome_mail, send_order_mail };
