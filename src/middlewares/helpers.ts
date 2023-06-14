import bcrypt from 'bcrypt';
import * as DAO from '../DAO';
import * as Models from '../models/index';
import random_string from "randomstring";
import { app_constant } from '../config/index';
import { Collection } from 'mongoose';
const default_limit = app_constant.default_limit
const salt_rounds = app_constant.salt_rounds

const set_options = async (pagination: any, limit: any) => {
    try {

        let options: any = {
            lean: true,
            sort: { _id: -1 }
        }

        if (pagination == undefined && typeof limit != undefined) {
            options = {
                lean: true,
                limit: parseInt(limit),
                sort: { _id: -1 }
            }
        }
        else if (typeof pagination != undefined && limit == undefined) {
            options = {
                lean: true,
                skip: parseInt(pagination) * default_limit,
                limit: default_limit,
                sort: { _id: -1 }
            }
        }

        else if (typeof pagination != undefined && typeof limit != undefined) {
            options = {
                lean: true,
                skip: parseInt(pagination) * parseInt(limit),
                limit: parseInt(limit),
                sort: { _id: -1 }
            }
        }

        return options

    }
    catch (err) {
        throw err;
    }
}

const generate_otp = async () => {
    try {

        let options = {
            length: 4,
            charset: '123456789'
        }
        let code = random_string.generate(options)
        return code

    }
    catch (err) {
        throw err;
    }
}

const generate_phone_otp = async () => {
    try {

        let options = {
            length: 4,
            charset: '123456789'
        }
        let code = random_string.generate(options)
        return 1234

    }
    catch (err) {
        throw err;
    }
}

const gen_unique_code = async (collection: any) => {
    try {

        let options = {
            length: 7,
            charset: 'alphanumeric'
        }
        let random_value = random_string.generate(options)

        // fetch users count
        let total_users = await DAO.count_data(collection, {})
        let inc_value = Number(total_users) + 1

        // unique code
        let unique_code = `${random_value}${inc_value}`
        return unique_code

    }
    catch (err) {
        throw err;
    }
}



const bcrypt_password = async (password: string) => {
    try {

        const hash = await bcrypt.hashSync(password, salt_rounds);
        return hash

    }
    catch (err) {
        throw err;
    }
}

const decrypt_password = async (password: string, hash: string) => {
    try {

        const decryt = await bcrypt.compareSync(password, hash);
        return decryt

    }
    catch (err) {
        throw err;
    }
}

const genrate_order_id = async () => {
    try {
        let static_value = 'ORDER';
        let options = {
            length: 4,
            charset: 'alphanumeric',
            capitalization: 'uppercase'
        }
        let random_value = random_string.generate(options)
        // fetch ORDERS count
        let count_orders = await DAO.count_data(Models.Orders, {})
        let unique_id = Number(count_orders) + 1
        let order_id = `${static_value}${random_value}${unique_id}`
        return order_id
    }
    catch (err) {
        throw err;
    }
}


const genrate_product_order_id = async () => {
    try {
        let static_value = 'ORDPROD';
        let options = {
            length: 4,
            charset: 'alphanumeric',
            capitalization: 'uppercase'
        }
        let random_value = random_string.generate(options)
        // fetch ORDERS count
        let count_orders = await DAO.count_data(Models.OrderProducts, {});
        let unique_id = Number(count_orders) + 1
        let order_id = `${static_value}${random_value}${unique_id}`
        return order_id
    }
    catch (err) {
        throw err;
    }
}

const genrate_product_id = async () => {
  try {
    let static_value = "PRODU";
    let options = {
      length: 4,
      charset: "alphanumeric",
      capitalization: "uppercase",
    };
    let random_value = random_string.generate(options);
    // fetch ORDERS count
    let count_orders = await DAO.count_data(Models.Products, {});
    let unique_id = Number(count_orders) + 1;
    let order_id = `${static_value}${random_value}${unique_id}`;
    return order_id;
  } catch (err) {
    throw err;
  }
};

const genrate_coupon_code = async () => {
    try {
        let static_value = 'COUP';
        let options = {
            length: 4,
            charset: 'alphanumeric',
            capitalization: 'uppercase'
        }
        let random_value = random_string.generate(options)
        let count = await DAO.count_data(Models.Coupons, {})
        let unique_id = Number(count) + 1
        let coupon_code = `${static_value}${random_value}${unique_id}`
        return coupon_code
    }
    catch (err) {
        throw err;
    }
}

const generate_tax_no = async () => {
  try {
    let static_value = "2022";
    let options = {
      length: 5,
      charset: "123456789",
    };
    let random_value = random_string.generate(options);
    // fetch ORDERS count
    let count_orders = await DAO.count_data(Models.OrderProducts, {});
    let unique_id = Number(count_orders) + 1;
    let order_id = `${static_value}${random_value}${unique_id}`;
    return order_id;
  } catch (err) {
    throw err;
  }
};

const generate_invoice_id = async () => {
  try {
    // let static_value = "INV";
    let count_orders = await DAO.count_data(Models.OrderInvoices, {});
    let unique_id:any = Number(count_orders) + 1;
    console.log('uniq ',unique_id);

    let random_value:any="INV";
    let count_zeros = await zeros_count(unique_id);
    for (let i = 0; i < (10-count_zeros); i++) {
      random_value += "0";
    }
    
    let order_id = `${random_value}${unique_id}`;
    console.log('invoice _id ', order_id)
    return order_id;
  } catch (err) {
    throw err;
  }
};

const zeros_count = async(num:any)=>{
    try{
        let count = 0;
        if(num>=1){
            ++count;
        }
        while(num/10 >=1){
            num=num/=10
            ++count;
        }
        return count
    }catch(err){
        throw err
    }
}

export {
  set_options,
  generate_otp,
  gen_unique_code,
  bcrypt_password,
  decrypt_password,
  genrate_order_id,
  genrate_coupon_code,
  generate_phone_otp,
  genrate_product_order_id,
  genrate_product_id,
  generate_tax_no,
  generate_invoice_id,
};