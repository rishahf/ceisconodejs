import path from "path";
import send_email from "../../middlewares/send_email";
import fs from 'fs';

// import resend from '../../email_templates/email_welcome_seller.html'

const send_welcome_mail = async (data: any, seller_password:any) => {
    try {
        let { email, name } = data
        let subject = 'Welcome to HenceForth!';
        let file_path = path.join(__dirname, '../../email_templates/email_welcome_seller.html');
        let html = await fs.readFileSync(file_path, { encoding: 'utf-8' })
        html = html.replace('%SELLER_NAME%', name)
        html = html.replace('%EMAIL%', email)
        html = html.replace('%PASSWORD%', seller_password)
        await send_email(email, subject, html)
    }
    catch (err) {
        throw err;
    }
}


export {
    send_welcome_mail,
  
}