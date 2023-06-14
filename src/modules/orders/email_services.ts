import path from "path";
import send_email from "../../middlewares/send_email";
import fs from "fs";
import * as DAO from '../../DAO';
import * as Models from '../../models';
import { handlebars } from "hbs";
import moment from "moment";
import * as email_services from "../../middlewares/common_email";
// import resend from '../../email_templates/email_verification.html'


const create_order_mail_to_customer = async (user_data: any,order_detail:any) => {
  try {
    let subject = "Your order placed successfully!";
    let { email, name } = user_data;
    let admin_address:any = await DAO.get_data(Models.Admin,{super_admin:true},{__v:0},{lean:true})

    let { orders_id, total_paid_amount, user_address,coupon_code, coupon_discount, sub_total, delivery_price, orders, created_at} = order_detail;

    let order_date: any = moment(parseInt(created_at)).utc().format("DD/MM/YYYY");

    let file_path = path.join(__dirname,"../../public/views/orderConfirmed.hbs");
    let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
    const template = handlebars.compile(html);
    const htmlToSend = template({
      // image_path:image_path,
      user_name: name,
      user_email: email,
      admin_address: admin_address[0].full_address,
      order_id: orders_id,
      order_date:order_date,
      total_paid_amount: total_paid_amount,
      coupon_code:coupon_code,
      coupon_discount:coupon_discount,
      delivery_price:delivery_price,
      sub_total:sub_total,
      user_address: user_address,
      orders:orders
    });
   
    await send_email(email, subject, htmlToSend);
  } catch (err) {
    throw err;
  }
};

const create_order_mail_to_seller = async (user_data: any,order_detail:any) => {
  try {
    let { email, otp, name } = user_data;
    let subject = "Your have a new Order";
    let file_path = path.join(__dirname,"../../email_templates/order_placed.html");
    let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
    html = html.replace("%USER_NAME%", name);
    html = html.replace("%OTP%", order_detail);
    await send_email(email, subject, html);
  } catch (err) {
    throw err;
  }
};

const cancel_requested_to_customer = async (user_data: any,order_detail:any,product_detail:any,html_template:any) => {
  try {
     let subject = "You requested for order cancellation";
     let admin_address: any = await DAO.get_data(Models.Admin,{ super_admin: true },{ full_address: 1 },{ lean: true });
    let { email, name } = user_data;
    let { name: product_name,images } = product_detail;
    let { orders_id, coupon_code, discount_price,delivery_price,coupon_discount,total_price,shipped_at,quantity, created_at } = order_detail;

    let order_date: any = moment(parseInt(created_at)).utc().format("DD/MM/YYYY");
    let image = `${process.env.IMAGE_PATH}${images[0]}`;

    
    let file_path = path.join(__dirname,html_template);
    let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
    const template = handlebars.compile(html);
    const htmlToSend = template({
      user_name: name,
      product_name: product_name,
      order_id: orders_id,
      subject: subject,
      name: name,
      admin_address: admin_address[0].full_address,
      order_date: order_date,
      user_email: email,
      coupon_code: coupon_code,
      discount_price: discount_price,
      image: image,
      delivery_price: delivery_price,
      coupon_discount: coupon_discount,
      paid_price: total_price,
      qty: quantity,
      
    });
    await email_services.send_order_mail(email, subject, htmlToSend);
  } catch (err) {
    throw err;
  }
};

const cancel_requested_to_seller = async (seller_data: any,order_detail:any,customer_detail:any,product_detail:any) => {
  try {
    let { email, otp, name:seller_name } = seller_data;
    let { email:user_email, name:user_name } = customer_detail;
    let { name:product_name } = product_detail;
    let { product_order_id } = order_detail;
    let subject = "Your have Order Cancalled Request";
    let file_path = path.join(__dirname,"../../email_templates/cancel_request_to_seller.html");
    let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
    html = html.replace("%SELLER_NAME%", seller_name);
    html = html.replace("%USER_NAME%", user_name);
    html = html.replace("%PRODUCT_NAME%", product_name);
    html = html.replace("%ORDPRODUCT_ID%", product_order_id);
    html = html.replace("%OTP%", order_detail);
    await send_email(email, subject, html);
  } catch (err) {
    throw err;
  }
};

const cancel_requested_to_customer_simple = async (user_data: any,order_detail:any,product_detail:any) => {
  try {
    let { email, otp, name } = user_data;
    let { name: product_name } = product_detail;
     let { product_order_id } = order_detail;
    let subject = "You requested for order cancellation";
    let file_path = path.join(__dirname,"../../email_templates/order_placed.html");
    let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
    html = html.replace("%USER_NAME%", name);
    html = html.replace("%PRODUCT_NAME%", product_name);
    html = html.replace("%ORDPRODUCT_ID%", product_order_id);
    html = html.replace("%OTP%", order_detail);
    await send_email(email, subject, html);
  } catch (err) {
    throw err;
  }
};
const create_order_mail_to_customer1 = async (user_data: any,order_detail:any) => {
  try {
    let { email, name } = user_data;
    let admin_address:any = await DAO.get_data(Models.Admin,{super_admin:true},{full_address:1},{lean:true})

    let subject = "Your order placed successfully!";
    let file_path = path.join(__dirname,"../../email_templates/orderconfirmed.html");
    
    let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
    html = html.replace("%USER_NAME%", name);
    html = html.replace("%OTP%", order_detail);
    html = html.replace("%ADMIN_ADDRESS%", admin_address[0].full_address);
    await send_email(email, subject, html);
  } catch (err) {
    throw err;
  }
};


export {
  create_order_mail_to_customer,
  create_order_mail_to_seller,
  cancel_requested_to_customer,
  cancel_requested_to_seller
};
