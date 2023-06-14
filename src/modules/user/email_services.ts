import path from "path";
import send_email from "../../middlewares/send_email";
import fs from 'fs';
import * as DAO from '../../DAO';
import * as Models from '../../models';


// import resend from '../../email_templates/email_verification.html'

const send_welcome_mail = async (data: any) => {
    try {
        let { email, otp, name } = data;

        let admin_address:any = await DAO.get_data(Models.Admin,{super_admin:true},{full_address:1},{lean:true})

        let subject = 'Welcome to HenceForth!';
        let file_path = path.join(__dirname, '../../email_templates/welcomeVerifyEmail.html');
        let html = await fs.readFileSync(file_path, { encoding: 'utf-8' })
        html = html.replace('%USER_NAME%', name)
        html = html.replace('%OTP%', otp)
        html = html.replace('%ADMIN_ADDRESS%',admin_address[0].full_address)
        await send_email(email, subject, html)
    }
    catch (err) {
    }
}

const resend_otp_mail = async (data: any) => {
    try {
        let { email, otp, name } = data;

        let admin_address:any = await DAO.get_data(Models.Admin,{super_admin:true},{full_address:1},{lean:true})

        let subject = 'Resend OTP';
        let file_path = path.join(__dirname, '../../email_templates/resend_otp.html');
        let html = await fs.readFileSync(file_path, { encoding: 'utf-8' })
        html = html.replace('%USER_NAME%', name)
        html = html.replace('%OTP%', otp)
        html = html.replace("%ADMIN_ADDRESS%", admin_address[0].full_address);
        await send_email(email, subject, html)
    }
    catch (err) {
        throw err;
    }
}

const phone_verification_success_mail = async (data: any) => {
    try {
        let { email, otp, name } = data
        let subject = 'Resend OTP';
        let file_path = path.join(__dirname, '../../email_templates/phone_veri_success.html');
        let html = await fs.readFileSync(file_path, { encoding: 'utf-8' })
        html = html.replace('%USER_NAME%', name)
        html = html.replace('%OTP%', otp)
        await send_email(email, subject, html)
    }
    catch (err) {
        throw err;
    }
}

const edit_profile_mail = async (email: string, otp : any, name : string) => {
    try {

        let subject = 'Resend OTP';
        let file_path = path.join(__dirname, '../../email_templates/resend_otp.html');
        let html = await fs.readFileSync(file_path, { encoding: 'utf-8' })
        html = html.replace('%USER_NAME%', name)
        html = html.replace('%OTP%', otp)
        await send_email(email, subject, html)
    }
    catch (err) {
        throw err;
    }
}

// const forgot_password_mail = async (data: any) => {
//     try {
//         let { email, fp_otp, name } = data
//         let subject = 'Forgot Password OTP';
//         let file_path = path.join(__dirname, '../../email_templates/reset_password_otp.html');
//         let html = await fs.readFileSync(file_path, { encoding: 'utf-8' })
//         html = html.replace('%USER_NAME%', name)
//         html = html.replace('%UNIQUE_CODE%', fp_otp)
//         // console.log("FORGOTOTP: ", forgot_otp)
//         await send_email(email, subject, html)
//     }
//     catch (err) {
//         throw err;
//     }
// }

const forgot_password_mail = async (data: any) => {
    try {
        let { email, fp_otp, name, unique_code } = data;
        let admin_address:any = await DAO.get_data(Models.Admin,{super_admin:true},{full_address:1},{lean:true});
        let forgot_link = `https://sharedecommerce.henceforthsolutions.com/password/reset-password?unique_code=${unique_code}&email=${email}`;

        let subject = 'Forgot Password mail';
        let file_path = path.join(__dirname, '../../email_templates/forgottpsw.html');
        let html = await fs.readFileSync(file_path, { encoding: 'utf-8' })
        html = html.replace('%USER_NAME%', name)
        html = html.replace('%OTP%', fp_otp)
        html = html.replace("%ADMIN_ADDRESS%", admin_address[0].full_address);
        html = html.replace("%FORGOT_LINK%", forgot_link);

        await send_email(email, subject, html)
    }
    catch (err) {
        throw err;
    }
}

export {
  send_welcome_mail,
  resend_otp_mail,
  forgot_password_mail,
  edit_profile_mail,
  phone_verification_success_mail,
};