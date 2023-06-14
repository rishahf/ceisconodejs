import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport'
import { config } from 'dotenv';
import path from 'path/posix';
config();
const nodemailer_email = process.env.NODEMAILER_MAIL
const nodemailer_password = process.env.NODEMAILER_PASSWORD
// const nodemailer_email = 'manpreet.henceforth@gmail.com'
// const nodemailer_password = 'Manpreet@123'



const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: nodemailer_email,
        pass: nodemailer_password
    }
}));
// const templateOptions={
//     viewEngine:{
//         partialDir: path.resolve('../../email_templates/'),
//         defaultLayout: false
//     },
//     viewPath: path.resolve('../../email_templates/')
// }
// transporter.use('compile',templateOptions)

const send_email = async (to: string, subject: string, body: any) => {
    try {

        let mailOptions = {
            from: nodemailer_email,
            to: to,
            subject: subject,
            html: body,
            // text: 'That was easy!'
        };

        transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) { console.log(error) }
            else { console.log('Email sent: ' + info.response) }
        });

    }
    catch (err) {
        throw err;
    }
}


export default send_email
