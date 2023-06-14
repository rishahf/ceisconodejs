import * as express from 'express';
import * as DAO from '../../DAO';
import * as Models from '../../models';
import * as ag_chat_users from './chat_helper';
import { error, app_constant } from '../../config/index';
const default_limit = app_constant.default_limit;
import { handle_success, handle_catch, handle_custom_error, helpers, } from "../../middlewares/index";
import moment from 'moment'


const check_connection = async (sent_by: string, sent_to: string) => {
    try {

        //    console.log(`check_connection >>...  sent_by: string, sent_to: string >>.. `, sent_by , sent_to ); 

        let query = {
            $or: [
                {
                    $and: [
                        { sent_by: sent_by },
                        { sent_to: sent_to }
                    ]
                },
                {
                    $and: [
                        { sent_by: sent_to },
                        { sent_to: sent_by }
                    ]
                }
            ]
        }

        let projection = { _id: 1 }
        let options = { lean: true }
        let fetch_data = await DAO.get_data(Models.Connections, query, projection, options)
        return fetch_data

    }
    catch (err) {
        throw err;
    }
}

const make_connection = async (sent_by: string, sent_to: string) => {
    try {

        //   console.log(` make_connection>>..... sent_by ` , sent_by , ` sent_to ` , sent_to ); 

        let data_to_save = {
            sent_by: sent_by,
            sent_to: sent_to,
            created_at: +new Date()
        }
        let create_connection = await DAO.save_data(Models.Connections, data_to_save)
        return create_connection

    }
    catch (err) {
        throw err;
    }
}

const delete_video_message = async (payload_data: any) => {
    try {
        // console.log(`delete_video_message  `, payload_data );

        let { sent_to, sender_id, message, type, message_type, media_url, front_img, message_id, local_identifier, token } = payload_data;

        let query = {
            local_identifier: { $in: local_identifier },
            $and: [
                { sent_by: sender_id }
            ]
        }
        let data: any = await DAO.remove_data(Models.Messages, query)
        return data
    }
    catch (err) {
        // console.log(`err in delete-VIDEO_MESSGAE `, err);
        throw err;
    }
}


const save_message = async (payload_data: any, user_data: any, connection_id: string) => {
    try {

        let { sent_to, message, type, message_type, media_url, front_img, message_id, local_identifier, token } = payload_data;

        let data_to_save: any = {
            connection_id: connection_id,
            sent_by: user_data, //_id,
            sent_to: sent_to,
            type: type,
            message_type: message_type,
            message: message,
            media_url: media_url,
            front_img: front_img,
            is_read: 0,
            created_at: +new Date()
        }

        // console.log(`data_to_save >>. ` , data_to_save ); 

        if (message_id != null || message_id != undefined) {
            data_to_save.message_id = message_id
        }
        if (local_identifier != null || local_identifier != undefined) {
            data_to_save.local_identifier = local_identifier
        }
        if (token != null || token != undefined) {
            data_to_save.token = token
        }

        let save_message: any = await DAO.save_data(Models.Messages, data_to_save)

        let { _id: new_msg_id } = save_message
        //  console.log(`_id  save_data  >>.  ` , new_msg_id);
        // fetch message response
        let response = await make_msg_response(new_msg_id)

        // console.log(` response ` , response);


        let last_message = null;

        // console.log("<--type-->", type)
        // console.log("<--message_type-->", message_type)

        if (type == 'NORMAL' && message_type == 'TEXT') {
            // console.log("<--case_1-->")
            last_message = message
        }
        else if (type == 'REPLY' && message_type == 'TEXT') {
            // console.log("<--case_2-->")
            last_message = message
        }
        else if (type == 'FORWARDED' && message_type == 'TEXT') {
            // console.log("<--case_3-->")
            last_message = "forwarded message"
        }
        else if (type == 'NORMAL' && message_type == 'IMAGE') {
            // console.log("<--case_4-->")
            last_message = 'image'
        }
        else if (type == 'NORMAL' && message_type == 'VIDEO') {
            // console.log("<--case_5-->")
            last_message = 'video'
        }
        else if (type == 'NORMAL' && message_type == 'AUDIO') {
            // console.log("<--case_6-->")
            last_message = 'audio'
        }
        else if (type == 'NORMAL' && message_type == 'DOCUMENT') {
            // console.log("<--case_7-->")
            last_message = 'document'
        }

        // console.log("<--last_message-->", last_message)

        // update last message
        await update_last_msg(connection_id, last_message, local_identifier, token)

        return response

    }
    catch (err) {
        throw err;
    }
}

const make_msg_response = async (_id: string) => {
    try {

        let query = { _id: _id }
        let projection = { __v: 0 }
        let options = { lean: true }
        let populate = [
            { path: 'sent_by', select: 'profile_pic full_name' },
            { path: 'sent_to', select: 'profile_pic full_name' },
            { path: 'reply_of', select: '-__v' },
            {
                path: 'message_id',
                select: '-__v',
                populate: [
                    { path: 'reply_of', select: '-__v' },
                ]
            }
        ]
        let response = await DAO.populate_data(Models.Messages, query, projection, options, populate)
        return response

    }
    catch (err) {
        // console.log(` err in make_msg_response >>... `, err);
        throw err;
    }
}

const update_last_msg = async (connection_id: string, message: string, local_identifier: string, token: string) => {
    try {

        let query = { _id: connection_id }
        let update = {
            last_message: message,
            local_identifier: local_identifier,
            token: token,
            updated_at: +new Date()
        }
        let options = { new: true }
        await DAO.find_and_update(Models.Connections, query, update, options)

    }
    catch (err) {
        throw err;
    }
}


const list_users = async (req: any, res: express.Response) => {
    try {

        let { pagination, limit, search } = req.query, { _id } = req.user_data

        limit = parseInt(limit)
        let query: any = { _id: { $ne: _id }, is_deleted: false }

        if (search && search != undefined) {
            query = { _id: { $ne: _id }, is_deleted: false, name: { $regex: search, $options: 'i' } }

        }
        let skipped_data = parseInt(pagination) > 1 ? (parseInt(pagination) - 1) * 10 : 10;

        let projection = { profile_pic: 1, name: 1, email: 1 }
        let options = await helpers.set_options(pagination, limit)

        let response: any = await DAO.get_data(Models.Users, query, projection, options)

        // check connection id
        if (response.length) {
            for (let value of response) {
                let { _id: other_user_id } = value
                let fetch_data: any = await check_connection(other_user_id, _id)
                let connection_id = null;

                if (fetch_data.length) {
                    connection_id = fetch_data[0]._id
                }
                value.connection_id = connection_id
            }
        }

        // return data
        handle_success(res, response)

    }
    catch (err) {
        handle_catch(res, err);
    }
}

const list_chat_users = async (req: any, res: express.Response) => {
    try {

        let { pagination, limit, search } = req.query, { _id } = req.user_data;
        let find: any = search

        let query = [
            await ag_chat_users.match_data(_id),
            await ag_chat_users.set_data(_id),
            await ag_chat_users.lookup_users(),

            await ag_chat_users.unwind_users(),
            await ag_chat_users.lookup_unread_chat(_id),
            await ag_chat_users.count_message_data(),
            await ag_chat_users.find_other_user_id(_id),
            await ag_chat_users.fetch_messages(_id),
            await ag_chat_users.unwind_messages(),
            await ag_chat_users.set_last_message(),
            await ag_chat_users.group_data(),
            await ag_chat_users.filter_users_by_name(find),
            await ag_chat_users.remove_empty_doc(),

            await ag_chat_users.sort_data(),
            await ag_chat_users.skip_data(pagination, limit),
            await ag_chat_users.limit_data(limit)
        ]
        let options = { lean: true }
        let fetch_data: any = await DAO.aggregate_data(Models.Connections, query, options)

        // return data
        let response = {
            total_count: fetch_data.length,
            data: fetch_data
        }
        //  console.log(` response >>..  ` , response);


        handle_success(res, response)

    }
    catch (err) {
        handle_catch(res, err);
    }
}

const list_chat_details = async (req: any, res: express.Response) => {
    try {

        let { _id, pagination, limit } = req.query, { _id: user_id } = req.user_data;

        let query = {
            connection_id: _id,
            $or: [
                { sent_by: user_id },
                { sent_to: user_id }
            ],
            // deleted_for: { $nin: user_id }
        }

        let projection = { __v: 0 }
        let options = {
            lean: true,
            skip: parseInt(pagination) * parseInt(limit),
            limit: parseInt(limit),
            sort: { _id: -1 }
        }
        let populate = [
            { path: 'sent_by', select: 'profile_pic name' },
            { path: 'sent_to', select: 'profile_pic name' },
            { path: 'message_id', select: '-__v' },
        ]
        let response: any = await DAO.populate_data(Models.Messages, query, projection, options, populate)

        await read_all_messages(_id, user_id)
        let reverse_response = response.reverse();

        // fetch last seen
        let fetch_data: any = await fetch_last_seen(_id, user_id);

        // console.log(`fetch_data >>... ` , fetch_data ); 

        let last_seen = '', user_status = 0;
        if (fetch_data && fetch_data.last_seen && fetch_data.last_seen != undefined) {
            //   console.log(`here in last_seen`);    
            last_seen = fetch_data.last_seen

            // console.log(`last_seen `, last_seen);

        }
        if (fetch_data && fetch_data.user_status && fetch_data.user_status != undefined) {
            //  console.log(`here in user_status`);
            user_status = fetch_data.user_status
        }



        // last_seen = (last_seen == `` || last_seen == null ) 
        //              ? await last_seened()
        //              : fetch_data.last_seen  ;   



        let obj: any = {
            success: true,
            last_seen: last_seen,
            data: reverse_response
        }

        res.send(obj);

    }
    catch (err) {
        // console.log(`err in chat details `, err);

        handle_catch(res, err);
    }
}

const read_all_messages = async (connection_id: string, user_id: string) => {
    try {

        let query = {
            connection_id: connection_id,
            sent_to: user_id
        }
        let update = { is_read: 1 }
        await DAO.update_many(Models.Messages, query, update)

    }
    catch (err) {
        throw err;
    }

}

const new_message_response = async (connection_id: string, sent_to: string) => {
    try {
        //   console.log(` new_message_response _________________ connection_id ` , connection_id , ` sent_to    ` , sent_to);

        let query = [
            await ag_chat_users.match_by_con_id(connection_id),
            await ag_chat_users.set_data(sent_to),
            await ag_chat_users.lookup_users(),
            await ag_chat_users.unwind_users(),
            await ag_chat_users.lookup_unread_chat(sent_to),
            await ag_chat_users.find_other_user_id(sent_to),
            await ag_chat_users.count_message_data(),
            await ag_chat_users.fetch_messages(sent_to),
            await ag_chat_users.unwind_messages(),
            await ag_chat_users.set_last_message(),
            await ag_chat_users.group_data(),
            await ag_chat_users.sort_data()
        ]
        let options = { lean: true }
        let response: any = await DAO.aggregate_data(Models.Connections, query, options)

        return response[0]

    }
    catch (err) {
        // console.log(`err in new_message_response `, err);

        throw err;
    }
}

const read_message = async (message_id: string, user_id: string) => {
    try {
        //   console.log(` in >>.. read_message ` ,message_id ,  ` user_id sender_id >>..  `, user_id );

        let query = {
            _id: message_id,
            sent_to: user_id
        }

        //  console.log(`read_message  query ####################################### . .. . . . ` , query);

        let update = { is_read: 1 }
        let options = { new: true }
        let update_data: any = await DAO.find_and_update(Models.Messages, query, update, options)

        // make_msg_response
        // console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`)

        //   console.log(` read_message  update_data read_message >>....` , update_data);

        //console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`)

        let response = await make_msg_response(update_data._id)
        return response

    }
    catch (err) {
        // console.log(`err in read message >>>>>..... @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ `, err);

        throw err;
    }


}

const update_last_seen = async (data: any, user_data: any) => {
    try {

        let { date,  sender_id, connection_id } = data
     
        let _id = user_data

        //  console.log(`_id ` , _id);

        let query = { _id: _id }
        let update = {
            last_seen: date
        }
        let options = { new: true }

        let updatedata = await DAO.find_and_update(Models.Users, query, update, options)


    }
    catch (err) {
        // console.log(` update_last_seen online offline >>.... `, err);

        throw err;
    }
}


const last_seen_fxn = async (created_at: any) => {
    try {
        // console.log(` created_at ` , created_at );

        var dd = new Date(parseInt(created_at))

        // console.log(` dd  `, dd);
        // console.log(` dd.toJSON() ` , dd.toJSON() );

        var data: any = dd.toJSON().replace("T", " ").split(".");
        data = `${data[0]} +0000`
        // console.log(` data `, data);

        return data

    } catch (error) {
        // console.log(` error in last_seen_fxn `, error);

    }
}

const fetch_last_seen = async (connection_id: string, receiver_id: string) => {
    try {

        // console.log("---------------------receiver_id-------",receiver_id)

        let user_id = await fetch_receiver_id(connection_id, receiver_id)


        let query = { _id: user_id }
        let projection = { __v: 0 }
        let options = { lean: true }
        let response: any = await DAO.get_data(Models.Users, query, projection, options)


        if (response.length) {
            let { last_seen, user_status, created_at } = response[0]

            var seen = (last_seen == `` || last_seen == null)
                ? await last_seen_fxn(created_at)
                : last_seen

            return {
                last_seen: seen,
                user_status: user_status,
                created_at: created_at
            }
        }

    }
    catch (err) {
        throw err;
    }
}

const fetch_receiver_id = async (connection_id: string, receiver_id: string) => {
    try {

        let query = { _id: connection_id }
        let projection = { __v: 0 }
        let options = { lean: true }
        let response: any = await DAO.get_data(Models.Connections, query, projection, options)

        if (response.length) {
            let { sent_by, sent_to } = response[0]

            let user_id = null;
            if (JSON.stringify(sent_by) == JSON.stringify(receiver_id)) {
                user_id = sent_to
            } else {
                user_id = sent_by
            }
            return user_id

        }

    }
    catch (err) {
        throw err;
    }
}

const delete_message = async (data: any, user_data: any) => {
    try {

        let { local_identifier, delete_type, connection_id } = data
        // let { _id : user_id } = user_data

        let user_id = user_data
        let other_user_id = await fetch_receiver_id(connection_id, user_id)

        let deleted_for: any = []
        if (delete_type == 1) { deleted_for.push(user_id) }
        if (delete_type == 2) { deleted_for.push(user_id, other_user_id) }

        let query = {
            local_identifier: { $in: local_identifier },
            $or: [
                { sent_by: user_id },
                { sent_to: user_id }
            ]
        }

        let update = {
            delete_type: delete_type,
            deleted_for: deleted_for
        }
        await DAO.update_many(Models.Messages, query, update)

    }
    catch (err) {
        // console.log(` err in delete `, err);
        throw err;
    }
}


const get_receiver_data = async (receiver_id: string) => {
    try {
        // console.log("---------------------receiver_id-------",receiver_id)

        let query = { user_id: receiver_id }
        let projection = { __v: 0 }
        let options = { lean: true }

        let populate = [
            { path: 'user_id' }
        ]
        let response: any = await DAO.populate_data(Models.Sessions, query, projection, options, populate);

        if (response.length) {
            return response
        }

    }
    catch (err) {
        // console.log(` eerr get_receiver_data  `, err);

        throw err;
    }
}

const get_user_data = async (token: string) => {
    try {
        // console.log("----------get_user_data-----------get_user_data token socekt -------", token );

        let query = { access_token: token }
        let projection = { __v: 0 }
        let options = { lean: true }

        let populate = [
            { path: 'user_id' }
        ]
        let response: any = await DAO.populate_data(Models.Sessions, query, projection, options, populate);

        // console.log(` response in   get_user_data  >>>  ` , response);
        if (response.length > 0) {
            return response[0]
        }
        else {
            return {}
        }



    }
    catch (err) {
        // console.log(` eerr get_receiver_data  `, err);

        throw err;
    }
}






export {
    get_user_data,
    get_receiver_data,
    check_connection,
    make_connection,
    save_message,
    make_msg_response,
    update_last_msg,
    read_all_messages,
    list_users,
    list_chat_users,
    list_chat_details,
    // delete_message,
    new_message_response,
    read_message,
    update_last_seen,
    delete_message
}