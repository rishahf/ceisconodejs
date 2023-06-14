
import * as DAO from "../DAO";
import * as Models from '../models';
import jwt from 'jsonwebtoken'
import { error, app_constant } from '../config/index';
import { handle_custom_error } from './index';


const { seckret_keys } = app_constant
const options = { algorithm: "HS256" };
const admin_seckret_key = seckret_keys.admin_seckret_key;
const user_seckret_key = seckret_keys.user_seckret_key;
const seller_seckret_key = seckret_keys.seller_seckret_key;


// STEP 1 : GENERATE TOKEN
const generate_token = (token_data: any) => {

    return new Promise((resolve, reject) => {
        try {

            let seckret_key = null;
            if (token_data.scope == "admin") { seckret_key = admin_seckret_key }
            if (token_data.scope == "user") { seckret_key = user_seckret_key }
            if (token_data.scope == "seller") { seckret_key = seller_seckret_key }

            const token = jwt.sign(token_data, seckret_key)
            return resolve(token);

        }
        catch (err) {
            throw reject(err);
        }
    })

}


const decode_token = (token: string, type: string, language: string) => {

    return new Promise(async (resolve, reject) => {
        try {

            let set_seckret_key = null;
            if (type == "admin") { set_seckret_key = admin_seckret_key }
            else if (type == "user") { set_seckret_key = user_seckret_key }
            else if (type == "seller") { set_seckret_key = seller_seckret_key }

            let fetch_error = await handle_custom_error('UNAUTHORIZED', language)
            jwt.verify(token, set_seckret_key, (err: any, decoded: any) => {
                if (decoded == undefined) {
                    return reject(fetch_error);
                } else {
                    return resolve(decoded)
                }
            });

        }
        catch (err) {
            let fetch_error = await handle_custom_error('UNAUTHORIZED', language)
            throw reject(fetch_error);
        }
    })

}


// STEP 2 : VERIFY TOKEN
const verify_token = async (token: string, type: string, language: string) => {
    try {

        let decoded: any = await decode_token(token, type, language)
        let fetch_data: any;

        if (decoded.scope == "admin") {
            let query: any = {
                admin_id: decoded._id,
                access_token: { $ne: null },
                token_gen_at: decoded.token_gen_at
            }
            let projection = { __v: 0 }
            let options = { lean: true }
            fetch_data = await DAO.get_data(Models.Sessions, query, projection, options)
        }
        if (decoded.scope == "user") {
            let query: any = {
                user_id: decoded._id,
                access_token: { $ne: null },
                token_gen_at: decoded.token_gen_at
            }
            let projection = { __v: 0 }
            let options = { lean: true }
            fetch_data = await DAO.get_data(Models.Sessions, query, projection, options)
        }
        if (decoded.scope == "seller") {
            let query: any = {
                seller_id: decoded._id,
                access_token: { $ne: null },
                token_gen_at: decoded.token_gen_at
            }
            let projection = { __v: 0 }
            let options = { lean: true }
            fetch_data = await DAO.get_data(Models.Sessions, query, projection, options)
        }

        if (fetch_data.length) {
            return fetch_data[0]

        }
        else {
            let fetch_error = await handle_custom_error('UNAUTHORIZED', language)
            throw fetch_error
        }

    }
    catch (err) {
        let fetch_error = await handle_custom_error('UNAUTHORIZED', language)
        throw fetch_error
    }

}






export {
    generate_token,
    decode_token,
    verify_token
}