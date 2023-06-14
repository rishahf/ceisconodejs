import path from "path";
import * as email_services from "../../middlewares/common_email";
import fs from 'fs';
import moment from "moment";
import * as DAO from "../../DAO";
import * as Models from "../../models";
import { handlebars } from "hbs";
import send_email from "../../middlewares/send_email";

// import resend from '../../email_templates/email_welcome_seller.html'

const send_welcome_mail = async (data: any, seller_password:any) => {
    try {
        let { email, name, email_otp } = data;
        let admin_address:any = await DAO.get_data(Models.Admin,{super_admin:true},{full_address:1},{lean:true})

        let subject = 'Welcome to HenceForth!';
        // USING HANDLEBARS
        let file_path = path.join(__dirname, '../../public/views/welcomeVerifyEmail.hbs');
        let template = await fs.readFileSync(file_path, { encoding: "utf-8" });
        await email_services.send_welcome_mail(email, name, email_otp, subject, template,admin_address[0].full_address);

        //SIMPL RENDERING
        // let file_path = path.join(__dirname, '../../email_templates/welcomeVerifyEmail.html');
        // let html = await fs.readFileSync(file_path, { encoding: 'utf-8' })
        // html = html.replace('%USER_NAME%', name)
        // html = html.replace("%OTP%", email_otp);
        // html = html.replace('%ADMIN_ADDRESS%',admin_address[0].full_address)
        // await send_email(email,subject,html)
    
    }
    catch (err) {
        throw err;
    }
}

const send_pending_shipped_mail = async (data: any, order_detail:any) => {
    try {
        let { email, name, email_otp } = data
        let { order_id } = order_detail;
        let subject = 'Pending Shipment!';
        let file_path = path.join(__dirname, '../../email_templates/pending_shipped_order.html');
        let html = await fs.readFileSync(file_path, { encoding: 'utf-8' })
        html = html.replace('%SELLER_NAME%', name)
        html = html.replace('%ORDER_ID%', order_id)

        // html = html.replace('%PASSWORD%', seller_password)
        // html = html.replace("%OTP%", email_otp);
        // await send_email(email, subject, html)
    }
    catch (err) {
        throw err;
    }
}

const send_shipped_mail = async (user_data:any, order_detail:any, product_detail:any,seller_data:any) => {
    try {
      let { email, name } = user_data;
      let { company } = seller_data;
      let { address_data: { full_address }, created_at, orders_id, coupon_code, tracking_link, discount_price,delivery_price,coupon_discount,total_price,shipped_at,quantity, updated_at} = order_detail[0];
      let { name: product_name, images, } = product_detail[0];

      let admin_address: any = await DAO.get_data(Models.Admin,{ super_admin: true },{ full_address: 1 },{ lean: true });

      let order_date: any = moment(parseInt(created_at)).utc().format("DD/MM/YYYY");
      let shipped_date: any = moment(parseInt(shipped_at)).utc().format("dddd DD/MM/YYYY");
      let shipped_time: any = moment(parseInt(shipped_at)).utc().format("HH:mm");
    //   let delivery_by: any = moment(parseInt(delivery_date)).utc().format("ddd, MMM DD, YYYY");
      let image = `${process.env.IMAGE_PATH}${images[0]}`;

      let subject = "Order shipped successfully";
      let file_path = path.join(__dirname,"../../public/views/orderShipped.hbs");
      let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
      const template = handlebars.compile(html);
      const htmlToSend = template({
        subject: subject,
        name: name,
        admin_address: admin_address[0].full_address,
        order_id: orders_id,
        order_date: order_date,
        user_address: full_address,
        user_email: email,
        coupon_code: coupon_code,
        discount_price: discount_price,
        product_name: product_name,
        image: image,
        tracking_link: tracking_link,
        shipped_date: shipped_date,
        shipped_time: shipped_time,
        delivery_price: delivery_price,
        coupon_discount: coupon_discount,
        paid_price: total_price,
        qty: quantity,
        seller_company:company
      });
      await email_services.send_order_mail(email,subject,htmlToSend);
    }
    catch (err) {
        throw err;
    }
}

const send_delivery_mail = async (user_data:any, order_detail:any, product_detail:any, seller_data:any) => {
    try {
       let subject = "Order delivered successfully";
       let admin_address: any = await DAO.get_data(Models.Admin,{ super_admin: true },{ full_address: 1 },{ lean: true });
      let { email, name } = user_data;
      let { company } = seller_data;
      let { _id,address_data: { full_address }, created_at, orders_id, order_id:orderId,tracking_link,discount_price,delivery_price,delivery_date,coupon_discount,total_price,updated_at,quantity} = order_detail[0];
      let { name: product_name, images, } = product_detail[0];

      let order_date: any = moment(parseInt(created_at)).utc().format("DD/MM/YYYY");
      let delivered_date: any = moment(parseInt(delivery_date)).utc().format("dddd DD/MM/YYYY");
      let delivery_by: any = moment(parseInt(delivery_date)).utc().format("ddd, MMM DD, YYYY");
    
      let delivered_time: any = moment(parseInt(delivery_date)).utc().format("HH:mm");
      let image = `${process.env.IMAGE_PATH}${images[0]}`;
      let return_link = `https://sharedecommerce.henceforthsolutions.com/account/order/cancel/${orderId}/${_id}`;

      let file_path = path.join(__dirname,"../../public/views/orderDelivered.hbs");
      let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
      const template = handlebars.compile(html);
      const htmlToSend = template({
        subject: subject,
        user_name: name,
        admin_address: admin_address[0].full_address,
        order_id: orders_id,
        order_date: order_date,
        user_address: full_address,
        user_email: email,
        product_name: product_name,
        image: image,
        return_link: return_link,
        delivery_by: delivery_by,
        delivered_date: delivered_date,
        delivered_time: delivered_time,
        coupon_discount: coupon_discount,
        discount_price: discount_price,
        delivery_price: delivery_price,
        paid_price: total_price,
        qty: quantity,
        seller_company:company
      });
      await email_services.send_order_mail(email,subject,htmlToSend);
    }
    catch (err) {
        throw err;
    }
}

const send_cancel_mail = async (user_data:any, order_detail:any, product_detail:any, seller_data:any) => {
    try {
        let subject = "Order cancelled successfully";
        let admin_address: any = await DAO.get_data(Models.Admin,{ super_admin: true },{  __v: 0  },{ lean: true });
      
        let { email, name } = user_data;
        let { company } = seller_data;
        let { name: product_name, images } = product_detail[0];
        let { _id,coupon_code, created_at, orders_id,discount_price,delivery_price,coupon_discount,total_price,cancelled_at,quantity} = order_detail[0];


        let image = `${process.env.IMAGE_PATH}${images[0]}`;
        let order_date: any = moment(parseInt(created_at)).utc().format("DD/MM/YYYY");
        let cancelled_date: any = moment(parseInt(cancelled_at)).utc().format("dddd DD/MM/YYYY");
        
         console.log("order-detail  ", order_detail);
         console.log("total -price ", total_price, ' order-date ', order_date);

        let file_path = path.join(__dirname,"../../public/views/orderCancel.hbs");
        let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
        const template = handlebars.compile(html);

      const htmlToSend = template({
        subject: subject,
        user_name: name,
        admin_address: admin_address[0].full_address,
        order_id: orders_id,
        order_date: order_date,
        // user_address: full_address,
        user_email: email,
        product_name: product_name,
        image: image,
        cancelled_date: cancelled_date,
        coupon_code: coupon_code,
        coupon_discount: coupon_discount,
        discount_price: discount_price,
        delivery_price: delivery_price,
        paid_price: total_price,
        qty: quantity,
        seller_company: company,
      });
      await email_services.send_order_mail(email,subject,htmlToSend);
    }
    catch (err) {
        throw err;
    }
}

const send_refund_mail = async (user_data:any, order_detail:any, product_detail:any, seller_data:any) => {
    try {
        let subject = "Refund processed successfully";
         let admin_address: any = await DAO.get_data(Models.Admin,{ super_admin: true },{ __v: 0 },{ lean: true });

        let { email, name } = user_data;
        let { company } = seller_data;
        let { name: product_name, images } = product_detail[0];
        let { _id,coupon_code, created_at, orders_id,discount_price,delivery_price,coupon_discount,total_price,cancelled_at,quantity} = order_detail[0];

        let image = `${process.env.IMAGE_PATH}${images[0]}`;
        let order_date: any = moment(parseInt(created_at)).utc().format("DD/MM/YYYY");
        let cancelled_date: any = moment(parseInt(cancelled_at)).utc().format("dddd DD/MM/YYYY");
        
        let file_path = path.join(__dirname,"../../public/views/refundOnWay.hbs");
        let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
        const template = handlebars.compile(html);

      const htmlToSend = template({
        subject: subject,
        user_name: name,
        admin_address: admin_address[0].full_address,
        order_id: orders_id,
        order_date: order_date,
        // user_address: full_address,
        user_email: email,
        product_name: product_name,
        image: image,
        cancelled_date: cancelled_date,
        coupon_code: coupon_code,
        coupon_discount: coupon_discount,
        discount_price: discount_price,
        delivery_price: delivery_price,
        paid_price: total_price,
        qty: quantity,
        // seller_company: company,
      });
      await email_services.send_order_mail(email,subject,htmlToSend);
    }
    catch (err) {
        throw err;
    }
}


export {
  send_welcome_mail,
  send_pending_shipped_mail,
  send_shipped_mail,
  send_delivery_mail,
  send_cancel_mail,
  send_refund_mail,
};