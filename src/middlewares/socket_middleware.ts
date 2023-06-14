import { Socket } from "socket.io";
import { verify_token } from "./gen_token";
import {  app_constant } from '../config/index';
import e from "express";
import * as DAO from "../DAO";
import * as Models from '../models';
const { scope } = app_constant
const admin_scope = scope.admin
const user_scope = scope.user

const socket_authenticator = async (socket: any, next: any) => {
    try {
        console.log('  in   ^^^^^^^^^^^^^^^^^^^^     socket >>>>>....socket_authenticator')
        let token: string = socket.handshake.headers.token;

        console.log(` token >>...>>>>>>>......  ` , token); 
        let fetch_token_data: any = await verify_token(token, user_scope, 'ENGLISH')
        if (fetch_token_data) {

            let { _id, user_id, access_token, device_type, fcm_token, token_gen_at } = fetch_token_data
 
            console.log(`user_id >>. in socket middle token  >>..=== `, user_id , `_id >....` , _id);
             
            let query: any = { _id: user_id }
            let projection = { __v: 0 }
            let options = { lean: true }
            let fetch_data: any = await DAO.get_data(Models.Users, query, projection, options)

            if (fetch_data.length > 0) {

                fetch_data[0].access_token = access_token
                fetch_data[0].device_type = device_type
                fetch_data[0].fcm_token = fcm_token
                fetch_data[0].token_gen_at = token_gen_at

                socket.user_data = fetch_data[0]
                // console.log(` fetch_data[0] ` , fetch_data[0]);
                next();
            }
            else {
                socket.emit("invalid_token", {
                    success: false,
                    error: "invalid_token",
                    error_description: "Invalid access token"
                })
            }

        } else {
            socket.emit("invalid_token", {
                success: false,
                error: "invalid_token",
                error_description: "Invalid access token"
            })
        }

    }
    catch (err) {
        console.log(` err in socket authenticaor  >>.. `, err  );
        throw err;
    }
}

export default socket_authenticator;