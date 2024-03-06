import express, { response } from "express";
import * as DAO from "../../DAO/index";
import * as Models from "../../models/index";
const fastcsv = require('fast-csv');
const fs = require('fs');
import * as admin_helper from './admin_helper';
import * as admin_services from "./admin_service";
import * as admin_validator from "./admin_validator";
import moment from 'moment';
import { send_email, backup_using_cron } from "../../middlewares";
import { options } from "joi";
import * as email_seller from "./email_sellers";
import retrive_user_graph from './user_graph';
import retrive_seller_graph from './seller_graph';
import retrive_product_graph from './product_graph';
import retrive_order_graph from './order_graph';
import * as fetch_products from './fetch_products'
const shippo = require('shippo')(process.env.SHIPPO_TOKEN);
import { handle_success, handle_return, handle_catch, handle_custom_error, helpers } from "../../middlewares/index";
import { data_already_exists } from "../../config/error_msgs";
import { keyValuesList } from "../../../key-value";
import { mainKeysList } from "../../../main-keys";


const login = async (req: express.Request, res: express.Response) => {
    try {
        let { email, password: input_password, language } = req.body;

        let query = { email: email, is_deleted: false };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data: any = await DAO.get_data(Models.Admin, query, projection, options);

        if (fetch_data.length) {
            let { _id, password, is_blocked } = fetch_data[0];
            if (is_blocked == true) {
                throw await handle_custom_error("ACCOUNT_BLOCKED", language);
            } else {
                let decrypt = await helpers.decrypt_password(input_password, password);
                if (decrypt != true) {
                    throw await handle_custom_error("INCORRECT_PASSWORD", language);
                } else {
                    // generate token
                    let generate_token = await admin_services.generate_admin_token(_id, req.body);
                    let response = await admin_services.make_admin_response(generate_token, language);

                    // return response
                    handle_success(res, response);
                }
            }
        } else {
            throw await handle_custom_error("NO_DATA_FOUND", language);
        }
    } catch (err) {
        handle_catch(res, err);
    }
};

const access_token_login = async (req: any, res: express.Response) => {
    try {
        // return response
        handle_success(res, req.user_data);
    } catch (err) {
        handle_catch(res, err);
    }
};

const view_profile = async (req: any, res: express.Response) => {
    try {
        let { _id: admin_id } = req.user_data;

        let query = { _id: admin_id };
        // console.log(query);

        let options = { lean: true };
        let projection = { name: 1, image: 1, email: 1, phone_number: 1, city: 1, country: 1, state: 1, full_address: 1, company: 1 };

        let response: any = await DAO.get_data(Models.Admin, query, projection, options);

        handle_success(res, response[0]);
    } catch (err) {
        handle_catch(res, err);
    }
};

const edit_profile = async (req: any, res: express.Response) => {
    try {
        let { name, image, phone_number, country_code, company, country, state, city, full_address } = req.body;
        let { _id: admin_id } = req.user_data;

        console.log('req -bodyr ', req.body)

        let query = { _id: admin_id };

        let set_data: any = {};
        if (name != undefined) {
            set_data.name = name;
        }
        if (image != undefined) {
            set_data.image = image;
        }
        if (country_code != undefined) {
            set_data.country_code = country_code;
        }
        console.log('update ------ ', set_data)
        if (company != undefined) {
            set_data.company = company;
        }
        if (phone_number != undefined) {
            set_data.phone_number = phone_number;
        }

        if (country != undefined) {
            set_data.country = country;
        }

        if (state != undefined) {
            set_data.state = state;
        }

        if (city != undefined) {
            set_data.city = city;
        }
        if (full_address != undefined) {
            set_data.full_address = full_address;
        }

        let options = { new: true };
        let response = await DAO.find_and_update(Models.Admin, query, set_data, options);
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const change_password = async (req: any, res: express.Response) => {
    try {
        let { old_password, new_password, language } = req.body,
            { _id: admin_id } = req.user_data;

        let query = { _id: admin_id, super_admin: false };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data: any = await DAO.get_data(Models.Admin, query, projection, options);

        if (fetch_data.length) {
            let { _id, password } = fetch_data[0];
            let decrypt = await helpers.decrypt_password(old_password, password);
            if (decrypt != true) {
                throw await handle_custom_error("OLD_PASSWORD_MISMATCH", language);
            } else {
                // bycryt password
                let bycryt_password = await helpers.bcrypt_password(new_password);

                let query = { _id: _id };
                let update = { password: bycryt_password };
                let options = { new: true };
                let response: any = await DAO.find_and_update(Models.Admin, query, update, options);

                // return password
                handle_success(res, response);
            }
        } else {
            // throw await handle_custom_error("UNAUTHORIZED", language);
            throw await handle_custom_error("CANNOT_CHANGE_PASSWORD", language);
        }
    } catch (err) {
        handle_catch(res, err);
    }
};

const logout = async (req: any, res: express.Response) => {
    try {
        let { _id: admin_id } = req.user_data;
        // console.log("REq USer_data-- >", req.user_data);

        let query = { admin_id: admin_id };

        // console.log("Query-- > ", query);

        var resp = await DAO.remove_data(Models.Sessions, query);
        // console.log(resp);
        // return response
        let response = { message: "Logout Successful" };
        handle_success(res, response);

    } catch (err) {
        handle_catch(res, err);
    }
};

const dashboard = async (req: any, res: express.Response) => {
    try {

        let query = { is_deleted: false };
        let total_users = await admin_services.fetch_total_count(Models.Users, query);
        let total_sellers = await admin_services.fetch_total_count(Models.Sellers, query);
        let total_categories = await admin_services.fetch_total_count(Models.Category, query);
        let total_brands = await admin_services.fetch_total_count(Models.Brands, query);
        let total_products = await admin_services.fetch_total_count(Models.Products, query);
        let total_orders = await admin_services.fetch_total_count(Models.OrderProducts, {});
        let recent_users = await admin_services.fetch_recent_users();
        let recent_products = await admin_services.fetch_recent_products();
        let total_earnings = await admin_services.total_earnings(req);
        let total_reviews = await admin_services.total_reviews(req);
        let total_ratings = await admin_services.total_ratings(req);

        let response = {
            total_users: total_users,
            total_sellers: total_sellers,
            total_categories: total_categories,
            total_brands: total_brands,
            total_products: total_products,
            total_orders: total_orders,
            total_earnings: total_earnings,
            total_reviews: total_reviews,
            total_ratings: total_ratings,
            recent_users: recent_users,
            recent_products: recent_products
        };
        handle_success(res, response);

    }
    catch (err) {
        handle_catch(res, err);
    }
};

const user_graph = async (req: any, res: express.Response) => {
    try {

        let response = await retrive_user_graph.retrive_graph(req)
        handle_success(res, response);

    }
    catch (err) {
        handle_catch(res, err);
    }
}

const seller_graph = async (req: any, res: express.Response) => {
    try {

        let response = await retrive_seller_graph.retrive_graph(req)
        handle_success(res, response);

    }
    catch (err) {
        handle_catch(res, err);
    }
}

const product_graph = async (req: any, res: express.Response) => {
    try {

        let response = await retrive_product_graph.retrive_graph(req)
        handle_success(res, response);

    }
    catch (err) {
        handle_catch(res, err);
    }
}

const sales_graph = async (req: any, res: express.Response) => {
    try {

        let response = await retrive_order_graph.retrive_graph(req)
        handle_success(res, response);

    }
    catch (err) {
        handle_catch(res, err);
    }
}

const add_staff_members = async (req: any, res: express.Response) => {
    try {

        let { email, language } = req.body;
        let query_email = { email: email.toLowerCase() };
        let fetch_data: any = await admin_services.verify_admin_info(query_email);
        if (fetch_data.length) {
            throw await handle_custom_error("EMAIL_ALREADY_EXISTS", language);
        }
        else {
            let response = await admin_services.save_staff_data(req.body)
            handle_success(res, response)
        }
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const edit_staff_members = async (req: any, res: express.Response) => {
    try {
        let { _id, name, image, phone_number, country_code, roles } = req.body;
        // let { _id: _id } = req.user_data;

        let query = { _id: _id };

        let set_data: any = {};
        if (name != undefined) {
            set_data.name = name;
        }
        if (image != undefined) {
            set_data.image = image;
        }
        if (country_code != undefined) {
            set_data.country_code = country_code;
        }
        if (phone_number != undefined) {
            set_data.phone_number = phone_number;
        }
        if (roles != undefined) {
            set_data.roles = roles;
        }


        let options = { new: true };
        let response = await DAO.find_and_update(Models.Admin, query, set_data, options);

        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};


const list_staff_members = async (req: any, res: express.Response) => {
    try {

        let { search, start_date, end_date, pagination, limit } = req.query;
        let query: any = { email: { $ne: "admin@gmail.com" }, is_deleted: false };
        if (search != undefined) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        if (start_date != undefined && end_date != undefined) {
            let set_start_date = moment.utc(start_date, "x").startOf('day').format('x')
            let set_end_date = moment.utc(end_date, "x").endOf('day').format('x')
            query.$and = [
                { created_at: { $gte: set_start_date } },
                { created_at: { $lte: set_end_date } }
            ]
        }

        let projection = { __v: 0, password: 0 };
        let options = await helpers.set_options(pagination, limit);
        let fetch_data: any = await DAO.get_data(Models.Admin, query, projection, options);
        let total_count = await admin_services.fetch_total_count(Models.Admin, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        handle_success(res, response);

    }
    catch (err) {
        handle_catch(res, err);
    }
};

const staff_members_details = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.query;
        let query: any = { _id: _id };
        let options = { lean: true };
        let projection = { __v: 0 };
        let response: any = await DAO.get_data(Models.Admin, query, projection, options);

        // return response
        handle_success(res, response[0]);
    } catch (err) {
        handle_catch(res, err);
    }
};

const mamage_staff_members = async (req: any, res: express.Response) => {
    try {
        let collection = Models.Admin;
        let update_data: any = await admin_services.block_delete_data(req.body, collection);

        // return response
        handle_success(res, update_data);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_users = async (req: any, res: express.Response) => {
    try {

        let { search, start_date, end_date, filter, pagination, limit } = req.query;
        let query: any = { is_deleted: false };
        if (search != undefined) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                // { phone_no : parseInt(search) }
            ];
        }
        if (!!filter) {
            if (filter == "ACTIVE_USERS") {
                query.account_status = "ACTIVATED",
                    query.is_blocked = false,
                    query.is_deleted = false
            }
            else if (filter == "DEACTIVE_USERS") {
                query.account_status = "DEACTIVATED",
                    query.is_blocked = false
                query.is_deleted = false
            }
            else if (filter == "BLOCKED_USERS") {
                query.is_blocked = true
            }
        }
        if (start_date != undefined && end_date != undefined) {
            let set_start_date = moment.utc(start_date, "x").startOf('day').format('x')
            let set_end_date = moment.utc(end_date, "x").endOf('day').format('x')
            query.$and = [
                { created_at: { $gte: set_start_date } },
                { created_at: { $lte: set_end_date } }
            ]
        }
        if (filter === undefined || filter === null || filter === "") {
            query.account_status = "ACTIVATED",
                query.is_blocked = false,
                query.is_deleted = false
        }
        let options = await helpers.set_options(pagination, limit);
        let fetch_data: any = await admin_services.fetch_user_data(query, options);
        let total_count = await admin_services.fetch_total_count(Models.Users, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        handle_return(res, response);

    }
    catch (err) {
        handle_catch(res, err);
    }
};


const list_user_details = async (req: any, res: express.Response) => {
    try {

        let { _id } = req.query;

        let query = { _id: _id };
        let options = { lean: true };
        let response: any = await admin_services.fetch_user_data(query, options);
        if (response.length) {

            let query = { user_id: _id }
            let projection = { __v: 0 }
            let options = { lean: true };
            let address: any = await DAO.get_data(Models.Address, query, projection, options)

            response[0].address = address
            handle_return(res, response[0]);

        }
        else {
            throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH")
        }

    }
    catch (err) {
        handle_catch(res, err);
    }
};

const export_csv_users = async (req: any, res: express.Response) => {
    try {

        let { search, timezone, start_date, end_date, pagination, limit } = req.query;
        let time_zone = "Asia/Kolkata";
        if (timezone) { time_zone = timezone }

        if (start_date) {
            start_date = moment.utc(start_date, "DD/MM/YYYY").startOf("day").format("x");
        }
        if (end_date) {
            end_date = moment.utc(end_date, "DD/MM/YYYY").endOf("day").format("x");
        }

        let query: any = { is_deleted: false };
        if (search != undefined) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        if (start_date != null && end_date != null) {
            query.$and = [
                { created_at: { $gte: start_date } },
                { created_at: { $lte: end_date } },
            ];
        }

        let options = await helpers.set_options(pagination, limit);
        let fetch_data: any = await admin_services.fetch_user_data(query, options);

        const ws = fs.createWriteStream("src/CSV/users.csv");
        fastcsv
            .write(fetch_data, { headers: true })
            .pipe(ws);

        // fetch total count
        let total_count = await admin_services.fetch_total_count(Models.Users, query);

        let response = {
            total_count: total_count,
            data: fetch_data,
        };

        // return response
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const manage_users = async (req: any, res: express.Response) => {
    try {
        let { type, language } = req.body,
            fetch_data: any;

        if (type == "BLOCK/DELETE") {
            fetch_data = await admin_services.block_delete_data(req.body, Models.Users);
        } else if (type == "VERIFY/UNVERIFY") {
            fetch_data = await admin_services.verify_unverify(req.body, Models.Users);
        } else if (type == "ACTIVATE/DEACTIVATE") {
            fetch_data = await admin_services.activate_deactivate(req.body, Models.Users);
        } else {
            throw await handle_custom_error("INVALID_OBJECT_ID", language);
        }
        console.log('fe ', fetch_data);

        // if (fetch_data) {
        //     let { _id } = fetch_data;
        //     let query: any = { _id: _id };
        //     let options = { lean: true };
        //     let response:any = await admin_services.fetch_user_data(query, options);

        // return response
        handle_success(res, fetch_data);
        // } else {
        //     throw await handle_custom_error("INVALID_OBJECT_ID", language);
        // }
    } catch (err) {
        handle_catch(res, err);
    }
};

const login_as_user = async (req: any, res: express.Response) => {
    try {

        let { _id, language } = req.body;
        let device_type: any = req.headers['user-agent']
        let query = { _id: _id, is_deleted: false };
        let projection = {};
        let options = { lean: true };
        let fetch_data: any = await DAO.get_data(Models.Users, query, projection, options);
        if (fetch_data.length) {
            let query_ss = { user_id: _id, device_type: device_type }
            await DAO.remove_many(Models.Sessions, query_ss)
            let generate_token: any = await admin_services.generate_user_token(_id, req.body, device_type);
            let response = await admin_services.make_user_response(generate_token);
            handle_success(res, response);
        }
        else {
            throw await handle_custom_error("INVALID_OBJECT_ID", language);
        }
    }
    catch (err) {
        handle_catch(res, err);
    }
}


const delete_a_user = async (req: any, res: express.Response) => {
    try {

        let { _id } = req.params;
        let query = { _id: _id }
        let update = { is_deleted: true }
        let options = { new: true }
        let response: any = await DAO.find_and_update(Models.Users, query, update, options)
        if (response.is_deleted == true) {
            let data = { message: `User Deleted Successfully` };
            let query = { user_id: _id }
            await DAO.remove_many(Models.Sessions, query)
            handle_success(res, data);
        }
        else {
            throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH")
        }
    }
    catch (err) {
        handle_catch(res, err);
    }
}


const add_edit_res_msgs = async (req: any, res: express.Response) => {
    try {
        let { _id, type, status_code, message_type, msg_in_english, msg_in_arabic } = req.body, response: any;

        let set_data: any = {
            type: type,
            status_code: status_code,
            message_type: message_type.toUpperCase(),
            msg_in_english: msg_in_english,
            msg_in_arabic: msg_in_arabic,
        };

        if (_id != undefined) {
            let query = { _id: _id };
            let options = { new: true };
            response = await DAO.find_and_update(Models.ResMessages, query, set_data, options);
        } else {
            set_data.created_at = +new Date();
            response = await DAO.save_data(Models.ResMessages, set_data);
        }

        // return response
        handle_success(res, response);
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const list_res_messages = async (req: any, res: express.Response) => {
    try {
        let { search, pagination, limit } = req.query;

        let query: any = {};
        if (search != undefined) {
            query.$or = [
                { type: { $regex: search, $options: "i" } },
                { message_type: { $regex: search, $options: "i" } },
                { msg_in_english: { $regex: search, $options: "i" } },
                { msg_in_arabic: { $regex: search, $options: "i" } },
            ];
        }
        let projection = { __v: 0 };
        let options = await helpers.set_options(pagination, limit);
        let fetch_data: any = await DAO.get_data(Models.ResMessages, query, projection, options);

        // fetch total count
        let total_count = await admin_services.fetch_total_count(Models.ResMessages, query);

        let response = {
            total_count: total_count,
            data: fetch_data,
        };

        // return response
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const delete_res_messages = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let response: any = await DAO.remove_many(Models.ResMessages, query);

        if (response.deletedCount > 0) {
            let data = { message: `Response message deleted successfully...` };
            handle_success(res, data);
        }
    } catch (err) {
        handle_catch(res, err);
    }
};

const add_edit_content = async (req: express.Request, res: express.Response) => {
    try {
        console.log('add_edit_content =---- ')
        console.log('add_edit_content =---- ', req.body)
        let { type, description, image_url, language } = req.body,
            response: any;

        let set_data: any = {
            type: type,
            description: description,
        };
        if (!!image_url) {
            set_data.image_url = image_url
        }
        if (!!language) {
            set_data.language = language;
        }

        // check already added or not
        let fetch_content: any = await admin_services.check_content(type);
        console.log('fetch_content -- ', fetch_content)
        // console.log('fetch_content -- ',fetch_content)

        if (fetch_content.length) {
            let { _id } = fetch_content[0];
            console.log('[fetch_content[0].id -- ', _id)

            let query = { _id: _id };
            let options = { new: true };
            response = await DAO.find_and_update(Models.Content, query, set_data, options);
        } else {
            set_data.created_at = +new Date();
            response = await DAO.save_data(Models.Content, set_data);
        }

        // return response
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_content = async (req: express.Request, res: express.Response) => {
    try {
        let { type, language } = req.query,
            query: any = { language: language };
        let response: any;
        if (type != undefined) {
            query.type = type;
        }

        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = await DAO.get_data(Models.Content, query, projection, options);
        if (type != undefined) {
            response = fetch_data[0];
        } else {
            response = fetch_data
        }
        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const content_detail = async (req: express.Request, res: express.Response) => {
    try {
        let { _id } = req.params;
        if (_id != undefined) {
            let query: any = { _id: _id }
            let projection = { __v: 0 };
            let options = { lean: true };
            let fetch_data: any = await DAO.get_data(Models.Content, query, projection, options);
            // return data
            handle_success(res, fetch_data[0]);
        }
    } catch (err) {
        handle_catch(res, err)
    }
}

const add_edit_faqs = async (req: express.Request, res: express.Response) => {
    try {
        let { _id, question, answer, language } = req.body,
            response: any;

        let set_data: any = {
            question: question,
            answer: answer,
            language: language
        };

        if (_id != undefined) {
            let query = { _id: _id, language: language };
            let options = { new: true };
            let setData = await admin_services.edit_faqs(req.body)
            response = await DAO.find_and_update(Models.Faqs, query, setData, options);
        } else {
            set_data.created_at = +new Date();
            response = await DAO.save_data(Models.Faqs, set_data);
        }

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_faqs = async (req: express.Request, res: express.Response) => {
    try {
        let { language } = req.query;
        let query: any = { is_deleted: false, language: language };
        let projection = { __v: 0 };
        let options = { lean: true }
        let fetch_data: any = await DAO.get_data(Models.Faqs, query, projection, options);

        // fetch total orders
        let total_count = fetch_data.length

        let response = {
            total_count: total_count,
            data: fetch_data,
        };

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const delete_faqs = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let response: any = await DAO.remove_many(Models.Faqs, query);

        if (response.deletedCount > 0) {
            let data = { message: `Faq deleted successfully...` };
            handle_success(res, data);
        }
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_product_faqs = async (req: express.Request, res: express.Response) => {
    try {
        let { _id: product_id, pagination, limit } = req.query,
            query: any = { product_id: product_id };

        let projection = { __v: 0 };
        let options = await helpers.set_options(pagination, limit);
        let fetch_data: any = await DAO.get_data(Models.FaqsProducts, query, projection, options);

        // fetch total count
        let total_count = fetch_data.length;

        let response = {
            total_count: total_count,
            data: fetch_data,
        };

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_contact_us = async (req: express.Request, res: express.Response) => {
    try {
        let { search, pagination, limit } = req.query;

        let query: any = { is_deleted: false };
        if (search != null || search != undefined) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        let projection = { __v: 0 };
        let options = await helpers.set_options(pagination, limit);
        let fetch_data = await DAO.get_data(Models.ContactUs, query, projection, options)
        // fetch total orders
        let total_count = await admin_services.fetch_total_count(Models.ContactUs, query);

        let response = {
            total_count: total_count,
            data: fetch_data,
        };

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const manage_contact_us = async (req: any, res: express.Response) => {
    try {
        let { _id, type } = req.body,
            response: any;

        let update = {};
        if (type == "RESOLVE") {
            update = { resolved: true };
        } else if (type == "DELETE") {
            update = { is_deleted: true };
        }

        let query = { _id: _id };
        let options = { new: true };
        response = await DAO.find_and_update(Models.ContactUs, query, update, options);

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const add_edit_variables = async (req: any, res: express.Response) => {
    try {
        let { _id, name } = req.body,
            response: any;

        let set_data: any = { name: name };

        if (_id != undefined) {
            let query = { _id: _id };
            let options = { new: true };
            response = await DAO.find_and_update(Models.Variables, query, set_data, options);
        } else {
            set_data.created_at = +new Date();
            response = await DAO.save_data(Models.Variables, set_data);
        }

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_variables = async (req: express.Request, res: express.Response) => {
    try {
        let { _id, search, pagination, limit } = req.query,
            query: any = {};
        if (_id != undefined) {
            query._id = _id;
        }
        if (search != undefined) {
            query.name = { $regex: search, $options: "i" };
        }

        let projection = { __v: 0 };
        let options = await helpers.set_options(pagination, limit);
        let fetch_data = await DAO.get_data(
            Models.Variables, query, projection, options);

        // fetch total count
        let total_count = await admin_services.fetch_total_count(
            Models.Variables,
            query
        );

        let response = {
            total_count: total_count,
            data: fetch_data,
        };

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const delete_variables = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let response: any = await DAO.remove_many(Models.Variables, query);

        if (response.deletedCount > 0) {
            let data = { message: `Variable deleted successfully...` };
            handle_success(res, data);
        }
    } catch (err) {
        handle_catch(res, err);
    }
};

const add_edit_templates = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        let { _id, title, subject, html, variables } = req.body,
            response: any;

        let set_data: any = {
            title: title,
            type: title.toUpperCase(),
            subject: subject,
            html: html,
            variables: variables,
        };

        if (_id != undefined) {
            let query = { _id: _id };
            let options = { new: true };
            response = await DAO.find_and_update(Models.Templates, query, set_data, options);
        } else {
            set_data.created_at = +new Date();
            response = await DAO.save_data(Models.Templates, set_data);
        }

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_templates = async (req: any, res: express.Response) => {
    try {
        let { _id, search, pagination, limit } = req.query,
            query: any = {};
        if (_id != undefined) {
            query._id = _id;
        }
        if (search != undefined) {
            query.$and = [
                { title: { $regex: search, $options: "i" } },
                { short_content: { $regex: search, $options: "i" } },
                { subject: { $regex: search, $options: "i" } },
            ];
        }

        let projection = { __v: 0 };
        let options = await helpers.set_options(pagination, limit);
        let populate = [{ path: "variables", select: "name" }];
        let fetch_data = await DAO.populate_data(Models.Templates, query, projection, options, populate)
        //fetch total count
        let total_count = await admin_services.fetch_total_count(Models.Templates, query);

        let response = {
            total_count: total_count,
            data: fetch_data,
        };

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const delete_templates = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let response: any = await DAO.remove_many(Models.Templates, query);

        if (response.deletedCount > 0) {
            let data = { message: `Template deleted successfully...` };
            handle_success(res, data);
        }
    } catch (err) {
        handle_catch(res, err);
    }
};

const send_notification = async (req: any, res: express.Response) => {
    try {
        let { type } = req.body;
        console.log('REQ BODY BROADCAST ------- ', req.body)
        if (type == 1) {
            await admin_services.send_broadcast_email(req.body);
        } else {
            await admin_services.send_broadcast_push(req.body);
        }

        let response = "Notification sent sucessfully!!!";

        // return data
        handle_success(res, response);
        // console.log(response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const add_category = async (req: any, res: express.Response) => {
    try {
        let response: any = await admin_services.save_categories(req.body);
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const add_sub_category = async (req: any, res: express.Response) => {
    try {
        let response: any = await admin_services.save_sub_categories(req.body);
        // console.log(response);
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};



const add_sub_subcategories = async (req: any, res: express.Response) => {
    try {
        let response: any = await admin_services.add_sub_subcategories(req.body);
        // console.log(response);
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const add_deals = async (req: any, res: express.Response) => {
    try {
        let response: any = await admin_services.save_deals(req.body);
        // console.log(response);
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};
const delete_deals = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.params;
        let query = { _id: _id };

        let response: any = await DAO.remove_data(Models.Deals_of_the_day, query);
        // console.log(response)

        if (response.deletedCount > 0) {
            let data = { message: ` Deal Deleted Successfully` };
            handle_success(res, data);
        }
    } catch (err) {
        handle_catch(res, err);
    }
};
const add_hot_deals = async (req: any, res: express.Response) => {
    try {
        let response: any = await admin_services.save_hot_deals(req.body);
        // console.log(response);
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};
const delete_hotdeals = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let response: any = await DAO.remove_many(Models.Hot_deals, query);

        if (response.deletedCount > 0) {
            let data = { message: `Hot Deal deleted successfully...` };
            handle_success(res, data);
        }
    } catch (err) {
        handle_catch(res, err);
    }
};
const add_fashion_deals = async (req: any, res: express.Response) => {
    try {
        let response: any = await admin_services.save_fashion_deals(req.body);
        // console.log(response);
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};
const delete_fashiondeals = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let response: any = await DAO.remove_many(Models.FashionDeals, query);

        if (response.deletedCount > 0) {
            let data = { message: `Fashion Deal deleted successfully...` };
            handle_success(res, data);
        }
    } catch (err) {
        handle_catch(res, err);
    }
};

const export_csv_products = async (req: any, res: express.Response) => {
    try {

        let { search } = req.query, { _id: seller_id } = req.user_data;

        let query: any = [
            await admin_helper.redact_data(search),
            await admin_helper.lookup_data("subcategories", "$subcategory_id"),
            await admin_helper.unwind_data("$subcategory_id"),
            await admin_helper.lookup_data("sub_subcategories", "$sub_subcategory_id"),
            await admin_helper.unwind_data("$sub_subcategory_id"),
            await admin_helper.lookup_data("brands", "$brand_id"),
            await admin_helper.unwind_data("$brand_id"),
            await admin_helper.lookup_data("product_types", "$product_type_id"),
            await admin_helper.unwind_data("$product_type_id"),
            await admin_helper.lookup_data("sellers", "$added_by"),
            await admin_helper.unwind_data("$added_by"),
            await admin_helper.sort_data()
        ]
        let fetch_data: any;

        fetch_data = await admin_services.make_products(query, options)


        const ws = fs.createWriteStream("src/CSV/products.xlsx");
        fastcsv
            .write(fetch_data, { headers: true })
            .pipe(ws);
        let response = {
            total_count: await fetch_data.length,
            data: fetch_data
        }

        // return data
        handle_success(res, response)

    }
    catch (err) {
        handle_catch(res, err);
    }
}

const list_deals_of_the_day = async (req: any, res: express.Response) => {
    try {
        let { _id, pagination, limit } = req.query;

        let query: any = {};

        let options = await helpers.set_options(pagination, limit);
        let fetch_data = await admin_services.make_deals_response(query, options);

        // fetch total count
        let total_count = await admin_services.fetch_total_count(Models.Deals_of_the_day, query);

        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // console.log(response);

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const listing_deals_of_the_day_products = async (
    req: any,
    res: express.Response
) => {
    try {
        let { _id } = req.query;
        let query: any = { _id: _id };
        let options = { lean: true };
        let projection = { __v: 0 };
        let response: any = await admin_services.get_deals_detail(query, options);
        let subCategories_id = response[0].subcategory_id._id;
        // console.log("-------check SUB-------", subCategories_id);
        let query_data = { subcategory_id: subCategories_id };
        let fetch_product_data = await DAO.get_data(Models.Products, query_data, projection, options);
        handle_success(res, fetch_product_data);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_hot_deals = async (req: any, res: express.Response) => {
    try {
        let { _id, pagination, limit } = req.query;

        let query: any = {};

        let options = await helpers.set_options(pagination, limit);
        let fetch_data = await admin_services.make_hot_deals_response(query, options);

        // fetch total count
        let total_count = await admin_services.fetch_total_count(Models.Hot_deals, query);

        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // console.log(response);

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const listing_hot_deals_products = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.query;
        let query: any = { _id: _id };
        let options = { lean: true };
        let projection = { __v: 0 };
        let response: any = await admin_services.get_hotdeals_detail(query, options);
        // console.log("response", response)
        let subCategories_id = response[0].subcategory_id._id;
        // console.log("-------check SUB-------", subCategories_id);
        let query_data = { subcategory_id: subCategories_id };
        let fetch_product_data = await DAO.get_data(Models.Products, query_data, projection, options);
        handle_success(res, fetch_product_data);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_fashion_deals = async (req: any, res: express.Response) => {
    try {
        let { _id, pagination, limit } = req.query;

        let query: any = {};

        let options = await helpers.set_options(pagination, limit);
        let fetch_data = await admin_services.make_fashion_deals_response(
            query,
            options
        );

        // fetch total count
        let total_count = await admin_services.fetch_total_count(Models.FashionDeals, query);

        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // console.log(response);

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};
const listing_fashion_deals_products = async (
    req: any,
    res: express.Response
) => {
    try {
        let { _id } = req.query;
        let query: any = { _id: _id };
        let options = { lean: true };
        let projection = { __v: 0 };
        let response: any = await admin_services.get_fashiondeals_detail(query, options);
        let brand_id = response[0].brand_id._id;
        // console.log("-------check SUB-------", brand_id);
        let query_data = { brand_id: brand_id };
        let fetch_product_data = await DAO.get_data(Models.Products, query_data, projection, options);
        handle_success(res, fetch_product_data);
    } catch (err) {
        handle_catch(res, err);
    }
};

const add_brands = async (req: any, res: express.Response) => {
    try {
        let response: any = await admin_services.save_brands(req.body);
        // console.log(response);
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};


const add_banners = async (req: any, res: express.Response) => {
    try {
        let response: any = await admin_services.save_banners(req.body);
        // console.log(response);
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_banners = async (req: any, res: express.Response) => {
    try {
        let { _id, timezone, pagination, limit } = req.query;

        let time_zone = "Asia/Kolkata";
        if (timezone) {
            time_zone = timezone;
        }

        let query: any = {};
        // if (_id != undefined) { query._id = _id }

        let options = await helpers.set_options(pagination, limit);
        let fetch_data = await admin_services.make_banners_response(query, options);

        // fetch total count
        let total_count = await admin_services.fetch_total_count(
            Models.Banners,
            query
        );

        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // console.log(response);

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

// const seller_signup = async (req: express.Request, res: express.Response) => {
//     try {
//         let { email, password, phone_number, language } = req.body;
//         let device_type: any = req.headers["user-agent"] 
//         // verify email address
//         let query_email = { email: email.toLowerCase() };
//         let fetch_data: any = await admin_services.verify_seller_info(query_email);

//         if (fetch_data.length) {
//             throw await handle_custom_error("EMAIL_ALREADY_EXISTS", language);
//         } else {
//             // verify phone_no
//             let query_phone_no = { phone_number: phone_number };
//             let verify_data: any = await admin_services.verify_seller_info(query_phone_no);
//             if (verify_data.length) {
//                 throw await handle_custom_error("PHONE_NO_ALREADY_EXISTS", language);
//             } else {
//                 // create new user
//                 let create_user = await admin_services.set_seller_data(req.body);

//                 let { _id } = create_user;

//                 // generate access token
//                 let generate_token: any = await admin_services.generate_seller_token(_id, req.body, device_type);

//                 // fetch user response
//                 let response = await admin_services.make_seller_response(generate_token, language);
//                 // console.log("seller-response--> ", response);

//                 // send welcome email to user
//                 await email_seller.send_welcome_mail(create_user, password);

//                 // return response
//                 handle_success(res, response);
//             }
//         }
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

//seller_listing
const seller_listing = async (req: any, res: express.Response) => {
    try {

        let { search, start_date, end_date, filter, pagination, limit } = req.query;
        let query: any = { is_deleted: false };
        if (search != undefined) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        if (!!filter) {
            if (filter == "ACTIVE_USERS") {
                query.account_status = "ACTIVATED"
            }
            else if (filter == "DEACTIVE_USERS") {
                query.account_status = "DEACTIVATED"
            }
            else if (filter == "BLOCKED_USERS") {
                query.is_blocked = true
            }
        }
        if (start_date != undefined && end_date != undefined) {
            let set_start_date = moment.utc(start_date, "x").startOf('day').format('x')
            let set_end_date = moment.utc(end_date, "x").endOf('day').format('x')
            query.$and = [
                { created_at: { $gte: set_start_date } },
                { created_at: { $lte: set_end_date } }
            ]
        }

        let options = await helpers.set_options(pagination, limit);
        let fetch_data: any;

        fetch_data = await admin_services.fetch_seller_data(query, options);

        // fetch total count
        let total_count = await admin_services.fetch_total_count(Models.Sellers, query);

        let response = { total_count: total_count, data: fetch_data, };

        // return response
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const seller_details = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.query;

        let response: any;

        if (_id != 'undefined') {
            let query: any = { _id: _id }
            let options = { lean: true }
            response = await admin_services.fetch_seller_data(query, options)
        }

        // return response
        handle_success(res, response[0]);
    } catch (err) {
        handle_catch(res, err);
    }
};

const export_csv_seller = async (req: any, res: express.Response) => {
    try {

        let { search, timezone, start_date, end_date, pagination, limit } = req.query;
        let time_zone = "Asia/Kolkata";
        if (timezone) { time_zone = timezone; }

        if (start_date) {
            start_date = moment.utc(start_date, "DD/MM/YYYY").startOf("day").format("x");
        }
        if (end_date) {
            end_date = moment.utc(end_date, "DD/MM/YYYY").endOf("day").format("x");
        }

        let query: any = { is_deleted: false };
        if (search != undefined) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }
        if (start_date != null && end_date != null) {
            query.$and = [
                { created_at: { $gte: start_date } },
                { created_at: { $lte: end_date } },
            ];
        }
        let options = await helpers.set_options(pagination, limit);
        let fetch_data: any;

        fetch_data = await admin_services.fetch_seller_data(query, options);
        const ws = fs.createWriteStream("src/CSV/sellers.csv");
        fastcsv
            .write(fetch_data, { headers: true })
            .pipe(ws);
        // fetch total count
        let total_count = await admin_services.fetch_total_count(Models.Sellers, query);

        let response = {
            total_count: total_count,
            data: fetch_data,
        };

        // return response
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

//Manage Sellers
const manage_sellers = async (req: any, res: express.Response) => {
    try {

        let { type, language } = req.body, fetch_data: any;

        if (type == "BLOCK/DELETE") {
            fetch_data = await admin_services.block_delete_data(req.body, Models.Sellers);
        }
        else if (type == "VERIFY/UNVERIFY") {
            fetch_data = await admin_services.verify_unverify(req.body, Models.Sellers);
        }
        else if (type == "ACTIVATE/DEACTIVATE") {
            fetch_data = await admin_services.activate_deactivate(req.body, Models.Sellers);
        }
        else {
            throw await handle_custom_error("INVALID_OBJECT_ID", language);
        }

        // if (fetch_data) {
        //     let { _id } = fetch_data;
        //     let query: any = { _id: _id };
        //     let options = { lean: true };
        //     let projection = { password: 0, otp: 0, fp_otp: 0, unique_code: 0, __v: 0, forgot_otp: 0 }
        //     let response:any = await DAO.get_data(Models.Sellers, query, projection, options)
        // return response
        handle_success(res, fetch_data);
        // } 
        // else {
        //     throw await handle_custom_error("INVALID_OBJECT_ID", language);
        // }

    }
    catch (err) {
        handle_catch(res, err);
    }
};

const login_as_seller = async (req: any, res: express.Response) => {
    try {
        let { language } = req.body;
        let { email, image } = req.user_data

        // console.log('req.headers ---', req.headers)
        // console.log("req.headers.[user-agent] ---", req.headers['user-agent']);
        let device_type: any = req.headers["user-agent"];
        let query = { email: email, is_deleted: false };
        let projection = {
            is_deleted: 0,
            unique_code: 0,
            fp_otp: 0,
            fp_otp_verified: 0,
            password: 0,
            is_blocked: 0
        };
        let options = { lean: true };
        let fetch_data: any = await DAO.get_data(Models.Sellers, query, projection, options);
        let _id = fetch_data[0]._id

        if (fetch_data.length) {
            let query_ss: any = { seller_id: _id, device_type: device_type };
            await DAO.remove_many(Models.Sessions, query_ss)

            let generate_token: any = await admin_services.generate_seller_token(_id, req.body, device_type);
            let response = await admin_services.make_seller_response(generate_token, language);
            response.image = image
            handle_success(res, response);
        }
        else {
            throw await handle_custom_error("INVALID_OBJECT_ID", language);
        }
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const delete_a_seller = async (req: any, res: express.Response) => {
    try {

        let { _id } = req.params;
        let query = { _id: _id }
        let update = { is_deleted: true }
        let options = { new: true }
        let response: any = await DAO.find_and_update(Models.Sellers, query, update, options)
        if (response.is_deleted == true) {
            let data = { message: `Seller Deleted Successfully` };
            let query = { seller_id: _id }
            await DAO.remove_many(Models.Sellers, query)
            handle_success(res, data);
        }
        else {
            throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH")
        }
    }
    catch (err) {
        handle_catch(res, err);
    }
}

const add_edit_coupons = async (req: express.Request, res: express.Response) => {
    try {
        let { _id, name, start_date, end_date, price, max_discount, coupon_type } = req.body,
            response: any;
        let code = await helpers.genrate_coupon_code()

        let set_data: any = {
            name: name,
            code: code,
            start_date: start_date,
            end_date: end_date,
            price: price,
            max_discount: max_discount,
            coupon_type: coupon_type,
            is_deleted: false
        };

        if (_id != undefined) {
            let query = { _id: _id };
            let options = { new: true };
            let data = await admin_services.edit_coupon(req.body)
            response = await DAO.find_and_update(Models.Coupons, query, data, options);
        } else {
            set_data.created_at = +new Date();
            response = await DAO.save_data(Models.Coupons, set_data);
        }

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const get_coupons = async (req: any, res: express.Response) => {
    try {
        let { search } = req.query;

        let query: any = { is_deleted: false };
        if (search != undefined) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { code: { $regex: search, $options: "i" } },
            ];
        }
        let projection = { __v: 0 };
        let options = { lean: true }
        let fetch_data: any = await DAO.get_data(Models.Coupons, query, projection, options);

        let total_count = fetch_data.length;

        let response = {
            total_count: total_count,
            data: fetch_data,
        };

        // return response
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const delete_coupons = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let response: any = await DAO.remove_many(Models.Coupons, query);

        if (response.deletedCount > 0) {
            let data = { message: `Coupon deleted successfully...` };
            handle_success(res, data);
        }
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_products = async (req: any, res: express.Response) => {
    try {

        let query = [
            await fetch_products.match_data(),
            await fetch_products.lookup_brands(),
            await fetch_products.unwind_brands(),
            await fetch_products.lookup_categories(),
            await fetch_products.unwind_categories(),
            await fetch_products.lookup_subcategories(),
            await fetch_products.unwind_subcategories(),
            await fetch_products.lookup_sub_subcategories(),
            await fetch_products.unwind_sub_subcategories(),
            await fetch_products.lookup_seller(),
            await fetch_products.unwind_seller(),
            await fetch_products.ratings(),
            await fetch_products.product_highlights(),
            await fetch_products.group_data(),
            await fetch_products.filter_data(req.query),
            await fetch_products.sort_data(req.query),
            await fetch_products.skip_data(req.query),
            await fetch_products.limit_data(req.query),
        ];
        let { min_price, max_price } = req.query;

        let options = { lean: true }
        let products = await DAO.aggregate_data(Models.Products, query, options)

        let query_count = [
            await fetch_products.match_data(),
            await fetch_products.lookup_brands(),
            await fetch_products.unwind_brands(),
            await fetch_products.lookup_categories(),
            await fetch_products.unwind_categories(),
            await fetch_products.lookup_subcategories(),
            await fetch_products.unwind_subcategories(),
            await fetch_products.lookup_sub_subcategories(),
            await fetch_products.unwind_sub_subcategories(),
            await fetch_products.lookup_seller(),
            await fetch_products.unwind_seller(),
            await fetch_products.ratings(),
            await fetch_products.product_highlights(),
            await fetch_products.group_data(),
            await fetch_products.filter_data(req.query),
            await fetch_products.sort_data(req.query),
        ];
        let count_products: any = await DAO.aggregate_data(Models.Products, query_count, options)
        let response = {
            total_count: count_products.length,
            data: products
        }
        handle_success(res, response)
    }
    catch (err) {
        handle_catch(res, err);
    }
};




const list_product_variants = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.query;
        let query: any = { product_id: _id };
        let options = { lean: true };
        let response = await admin_services.get_variants_detail(query, options);
        // console.log(response);
        // return response
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_orders = async (req: any, res: express.Response) => {
    try {
        let { _id, pagination, limit } = req.query, fetch_data: any, total_count: any;
        let query = {}, options: any;

        if (_id != undefined) {

            query = { _id: _id }
            options = { lean: true }

            let get_data = await admin_services.fetch_Orders_data(query, options);

            let query_dta = { user_id: get_data[0].user_id._id, product_id: get_data[0].product._id }

            let response_reviews = await admin_services.fetch_reviews_data(query_dta, options)

            get_data[0]['reviews'] = response_reviews
            fetch_data = get_data[0]

        } else {
            options = await helpers.set_options(pagination, limit)

            fetch_data = await admin_services.fetch_Orders_data(query, options);
            total_count = fetch_data.length;
        }

        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const product_details = async (req: any, res: express.Response) => {
    try {

        let { _id } = req.query;
        let query: any = { _id: _id, is_deleted: false };
        let options = { lean: true };
        let response_product: any = await admin_services.get_product_detail(query, options);
        console.log(response_product[0], 'response_product');

        let query_data = { product_id: _id }, projection = { __v: 0 }
        let populate_data = [
            { path: 'user_id', select: "name profile_pic " }
        ]
        let response_reviews: any = await DAO.populate_data(Models.Reviews, query_data, projection, options, populate_data)
        let count_reviews = response_reviews.length
        let response = {
            product: response_product[0],
            reviews: response_reviews,
            total_review_count: count_reviews
        };
        // return response
        handle_success(res, response);
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const backup_db = async (req: any, res: express.Response) => {
    try {

        let { language } = req.body

        let create_backup = await backup_using_cron(language)
        // console.log("create backup ", create_backup)
        let { file_url } = create_backup

        let response = {
            base_url: 'https://sharedecommerce.nyc3.digitaloceanspaces.com/sharedecommerce/',
            folders: ['backup'],
            file_url: file_url
        }

        // return data
        handle_success(res, response)

    }
    catch (err) {
        handle_catch(res, err);
    }
}

const add_edit_languagekeys = async (req: express.Request, res: express.Response) => {
    try {

        let { _id, key, english, arabic } = req.body, response: any;

        let set_data = {
            key: key,
            english: english,
            arabic: arabic
        }
        if (_id != undefined) {
            let query = { _id: _id };
            let options = { new: true };
            let data = await admin_services.edit_language(req.body)
            response = await DAO.find_and_update(Models.LanguageKeys, query, data, options);
        } else {
            response = await DAO.save_data(Models.LanguageKeys, set_data);
        }
        // return data
        handle_success(res, response)

    }
    catch (err) {
        handle_catch(res, err);
    }
}
const list_languagekeys = async (req: express.Request, res: express.Response) => {
    try {

        let { pagination, limit, language, search, _id } = req.query;

        let query: any = { "is_deleted": false }

        if (search != undefined) {
            query.$or = [
                { english: { $regex: search, $options: 'i' } }
            ]
        }

        if (_id) {
            query = { "is_deleted": false, _id: _id }
            let count: any = await admin_services.fetch_total_count(Models.LanguageKeys, query)

            let fetch_content: any = await DAO.get_data(Models.LanguageKeys, query, {}, {})

            let data = fetch_content
            let response: any = {
                data,
                count: count
            }

            if (fetch_content.length) {
                handle_success(res, response)
            }
        } else {


            // console.log(` query >>.  `, query ); 

            let projection = { __v: 0 }
            let options = await helpers.set_options(pagination, limit)


            // check already added or not
            let count: any = await admin_services.fetch_total_count(Models.LanguageKeys, query)

            let fetch_content: any = await DAO.get_data(Models.LanguageKeys, query, projection, options)

            let data = fetch_content
            let response: any = {
                data,
                count: count
            }

            if (fetch_content.length) {
                handle_success(res, response)
            }
        }
        // return response

    }
    catch (err) {
        // console.log(`err ^^^^^^^^^^^^^^^^^^^   `, err);

        handle_catch(res, err);
    }
}


const add_a_parcel = async (req: express.Request, res: express.Response) => {
    try {

        let { name, description, length, width, height, distance_unit, weight, mass_unit } = req.body
        let parcel_data = {
            "length": length,
            "width": width,
            "height": height,
            "distance_unit": distance_unit,
            "weight": weight,
            "mass_unit": mass_unit
        }
        let parcel = await shippo.parcel.create(parcel_data)

        let set_parcel_data: any = {
            name: name,
            description: description,
            length: length,
            width: width,
            height: height,
            distance_unit: distance_unit,
            weight: weight,
            mass_unit: mass_unit,
            shippo_parcel_id: parcel.object_id,
            created_at: +new Date()
        }
        let save_parcel = await DAO.save_data(Models.Parcel, set_parcel_data)
        handle_return(res, save_parcel)

    }
    catch (err) {
        handle_catch(res, err)
    }
}


const retrive_parcels = async (req: express.Request, res: express.Response) => {
    try {

        let { _id, pagination, limit } = req.query;

        let query: any = {}
        if (!!_id) { query._id = _id }

        let projection = { __v: 0 }
        let options = await helpers.set_options(pagination, limit)
        let Parcels = await DAO.get_data(Models.Parcel, query, projection, options)
        let total_count = await DAO.count_data(Models.Parcel, query)
        let response = {
            total_count: total_count,
            data: Parcels
        }
        handle_return(res, response)

    }
    catch (err) {
        handle_catch(res, err);
    }
}

const delete_a_parcel = async (req: express.Request, res: express.Response) => {
    try {

        let { _id } = req.params;
        let query = { _id: _id }
        let response: any = await DAO.remove_many(Models.Parcel, query)
        if (response.deletedCount > 0) {
            let data = { message: `Parcel deleted successfully...` };
            handle_return(res, data);
        }

    }
    catch (err) {
        handle_catch(res, err);
    }
}

const get_notifications = async (req: any, res: express.Response) => {
    try {
        let { _id: admin_id } = req.user_data;
        let response: any = await admin_services.getNotifications(admin_id, req.query);

        handle_return(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const marked_all_read_notifications = async (req: any, res: express.Response) => {
    try {
        let { _id: admin_id } = req.user_data;
        let response: any = await admin_services.markReadNotifications(req);

        handle_return(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const clear_all_notifications = async (req: any, res: express.Response) => {
    try {
        let { _id: admin_id } = req.user_data;
        let response: any = await admin_services.clearNotifications(req);

        handle_return(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const read_notification = async (req: any, res: express.Response) => {
    try {
        console.log(' ====== ')
        let { _id: admin_id } = req.user_data;
        let response: any = await admin_services.ReadNotification(req);

        handle_return(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_users_sellers = async (req: any, res: express.Response) => {
    try {
        console.log(" ====== ");
        let { _id: admin_id } = req.user_data;
        let response: any = await admin_services.listing_users_sellers(req);

        handle_return(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const mainKeys = async (req: any, res: express.Response) => {
    try {
        console.log("req.body", req.body);

        let response: any = await admin_services.saveMainKey(req);

        handle_return(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const getMainKeys = async (req: any, res: express.Response) => {
    try {
        console.log("req.body", req.body);

        let response: any = await admin_services.getMainKeys(req);

        handle_return(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const keyValues = async (req: any, res: express.Response) => {
    try {
        console.log("req.body", req.body);

        let response: any = await admin_services.saveKeyValue(req);

        handle_return(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const editKeyValue = async (req: any, res: express.Response) => {
    try {
        console.log("edit req.param", req.params);
        console.log("req.query", req.params);
        console.log("req.body", req.body);

        let response: any = await admin_services.editKeyValue(req);

        console.log("rRESP", response);

        handle_return(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};


const getAllKeys = async (req: any, res: express.Response) => {
    try {
        console.log("req.param", req.params);
        console.log("req.query", req.params);
        console.log("req.body", req.body);

        let response: any = await admin_services.getAllKeys(req);

        handle_return(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};


const add_product_size = async (req: any, res: express.Response) => {
    try {
        let { category_id, size } = req.body
        let data: any = {
            category_id: category_id,
            size: size
        }
        let response: any = await DAO.save_data(Models.Size, data)
        handle_return(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const get_product_size = async (req: any, res: express.Response) => {
    try {
        let { category_id, size_id } = req.query
        let query: any = {}
        if (!!size_id) {
            query._id = size_id
        }
        if (!!category_id) {
            query = { category_id: category_id }
        }
        let options: any = {
            lean: true,
            sort: { _id: -1 }
        }
        let response: any = await DAO.get_data(Models.Size, query, {}, options)
        handle_return(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const get_single_product_size = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.params
        let query: any = {
            _id: _id
        }
        let response: any = await DAO.get_single_data(Models.Size, query, {}, { lean: true })
        handle_return(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const delete_product_size = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.params
        let query: any = {
            _id: _id
        }
        let response: any = await DAO.remove_data(Models.Size, query)
        handle_return(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const edit_product_size = async (req: any, res: express.Response) => {
    try {
        let { _id, category_id, size } = req.body
        let query: any = {
            _id: _id
        }
        let update_data: any = {
            size: size
        }
        if (!!category_id) {
            update_data.category_id = category_id
        }
        let response: any = await DAO.find_and_update(Models.Size, query, update_data, { new: true })
        handle_return(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

// const add_keys = async (req: any, res: express.Response) => {
//     try {
//         let collection = Models.KeyValues;
//         console.log("ENTERING DATA")
//         let data = keyValuesList.results;
//         console.log("DATA ", data)

//         let update_data: any = await DAO.insert_many(collection ,data,{ new:true});

//         // return response
//         handle_success(res, update_data);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

// const add_main_keys = async (req: any, res: express.Response) => {
//     try {
//         let collection = Models.MainKeys;
//         console.log("ENTERING DATA")
//         let data = mainKeysList.results;
//         console.log("DATA ", data)

//         let update_data: any = await DAO.insert_many(collection ,data,{ new:true});

//         // return response
//         handle_success(res, update_data);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

export {
    login,
    access_token_login,
    view_profile,
    edit_profile,
    change_password,
    logout,
    dashboard,
    user_graph,
    seller_graph,
    product_graph,
    sales_graph,
    add_staff_members,
    edit_staff_members,
    list_staff_members,
    staff_members_details,
    mamage_staff_members,
    list_users,
    list_user_details,
    manage_users,
    login_as_user,
    delete_a_user,
    add_edit_res_msgs,
    list_res_messages,
    delete_res_messages,
    add_edit_content,
    content_detail,
    list_content,
    add_edit_faqs,
    list_faqs,
    delete_faqs,
    list_product_faqs,
    list_contact_us,
    manage_contact_us,
    add_edit_variables,
    list_variables,
    delete_variables,
    add_edit_templates,
    list_templates,
    delete_templates,
    send_notification,
    add_category,
    add_sub_category,
    add_sub_subcategories,
    add_brands,
    add_banners,
    list_banners,
    // seller_signup,
    seller_listing,
    seller_details,
    manage_sellers,
    login_as_seller,
    delete_a_seller,
    export_csv_users,
    export_csv_seller,
    export_csv_products,
    add_deals,
    add_hot_deals,
    add_fashion_deals,
    list_deals_of_the_day,
    listing_deals_of_the_day_products,
    list_hot_deals,
    listing_hot_deals_products,
    list_fashion_deals,
    listing_fashion_deals_products,
    delete_deals,
    delete_hotdeals,
    delete_fashiondeals,
    add_edit_coupons,
    get_coupons,
    delete_coupons,
    list_products,
    product_details,
    list_product_variants,
    list_orders,
    backup_db,
    add_edit_languagekeys,
    list_languagekeys,
    add_a_parcel,
    retrive_parcels,
    delete_a_parcel,
    get_notifications,
    marked_all_read_notifications,
    read_notification,
    clear_all_notifications,
    list_users_sellers,
    mainKeys,
    getMainKeys,
    keyValues,
    getAllKeys,
    editKeyValue,
    add_product_size,
    get_product_size,
    delete_product_size,
    edit_product_size,
    get_single_product_size
};
