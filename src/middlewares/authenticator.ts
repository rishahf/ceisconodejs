
import { verify_token, handle_catch, handle_custom_error } from './index';
import * as DAO from "../DAO";
import * as Models from '../models';
import { error, app_constant } from '../config/index';
import e from 'cors';
const { scope } = app_constant
const admin_scope = scope.admin
const user_scope = scope.user
const seller_scope = scope.seller


const authenticator = async (req: any, res: any, next: any) => {
    try {

        let { token } = req.headers, api_path = req.originalUrl
        let set_language = 'ENGLISH';

        let { language: body_language } = req.body, { language: query_language } = req.query
        if (body_language != undefined) { set_language = body_language }
        if (query_language != undefined) { set_language = query_language }

        let admin_path = api_path.includes("Admin")
        let user_path = api_path.includes("User")
        let seller_path = api_path.includes("Seller")
        let product_path = api_path.includes("Products")
        let chat_path = api_path.includes("Chat")
        let stripe_path = api_path.includes("Stripe")
        let homepage_path = api_path.includes("Homepage")
        let order_path = api_path.includes("Order")

        if (admin_path || homepage_path) {

            let fetch_token_data: any = await verify_token(token, admin_scope, set_language)
            if (fetch_token_data) {

                let { admin_id, access_token, token_gen_at } = fetch_token_data

                let query: any = { _id: admin_id }
                let projection = { __v: 0 }
                let options = { lean: true }
                let fetch_data: any = await DAO.get_data(Models.Admin, query, projection, options)
                if (fetch_data.length > 0) {
                    let { roles, super_admin } = fetch_data[0]
                    let split_api_path = api_path.split('/').join(',').split('?').join(',').split(',')
                    // console.log("<--split_api_path-->", split_api_path)
                    // console.log("<--homepage_path-->", homepage_path)
                    let new_path: any
                    if (homepage_path){
                        new_path = split_api_path[1] || split_api_path[2]
                    }
                    else{
                        new_path = split_api_path[2] || split_api_path[1]
                    }
                    let type = new_path.toUpperCase()
                    console.log("<--split_api_path-->", type)
                    console.log("<--All roles-->", roles)
                    console.log('super_admin ',super_admin != true )
                    console.log("<-->",type != "NOTIFICATIONS");
                    if (super_admin != true && type != "NOTIFICATIONS") {
                        let check_roles = roles.includes(type)
                        if (check_roles != true) {
                            throw await handle_custom_error('INSUFFICIENT_PERMISSIONS', set_language)
                        }
                    }
                    fetch_data[0].access_token = access_token
                    fetch_data[0].token_gen_at = token_gen_at
                    req.user_data = fetch_data[0]
                    req.session_data = fetch_token_data
                    next();
                }
                else {
                    throw await handle_custom_error('UNAUTHORIZED', set_language)
                }

            } else {
                throw await handle_custom_error('UNAUTHORIZED', set_language)
            }

        }
        else if (user_path || product_path || chat_path || stripe_path || order_path) {
            let fetch_token_data: any = await verify_token(token, user_scope, set_language)
            if (fetch_token_data) {
                let { user_id, access_token, device_type, fcm_token, token_gen_at } = fetch_token_data
                let query: any = { _id: user_id }
                let projection = { __v: 0, password: 0 }
                let options = { lean: true }
                let fetch_data: any = await DAO.get_data(Models.Users, query, projection, options)
                if (fetch_data.length > 0) {
                    fetch_data[0].access_token = access_token
                    fetch_data[0].device_type = device_type
                    fetch_data[0].fcm_token = fcm_token
                    fetch_data[0].token_gen_at = token_gen_at
                    req.user_data = fetch_data[0]
                    req.session_data = fetch_token_data
                    next();
                }
                else {
                    throw await handle_custom_error('UNAUTHORIZED', set_language)
                }
            } 
            else {
                throw await handle_custom_error('UNAUTHORIZED', set_language)
            }
        }
        else if (seller_path) {
            let fetch_token_data: any = await verify_token(token, seller_scope, set_language)
            if (fetch_token_data) {

                let { seller_id, access_token, device_type, fcm_token, token_gen_at } = fetch_token_data

                let query: any = { _id: seller_id }
                let projection = { __v: 0, password: 0 }
                let options = { lean: true }
                let fetch_data: any = await DAO.get_data(Models.Sellers, query, projection, options)

                if (fetch_data.length > 0) {

                    fetch_data[0].access_token = access_token
                    fetch_data[0].device_type = device_type
                    fetch_data[0].fcm_token = fcm_token
                    fetch_data[0].token_gen_at = token_gen_at
                    req.user_data = fetch_data[0]
                    req.session_data = fetch_token_data
                    next();

                }


                else {
                    throw await handle_custom_error('UNAUTHORIZED', set_language)
                }

            } else {
                throw await handle_custom_error('UNAUTHORIZED', set_language)
            }

        }
        else {
            throw await handle_custom_error('UNAUTHORIZED', set_language)
        }

    }
    catch (err) {
        handle_catch(res, err)
    }
}

export default authenticator