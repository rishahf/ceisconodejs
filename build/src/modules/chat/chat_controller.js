"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_message = exports.update_last_seen = exports.read_message = exports.new_message_response = exports.list_chat_details = exports.list_chat_users = exports.list_users = exports.read_all_messages = exports.update_last_msg = exports.make_msg_response = exports.save_message = exports.make_connection = exports.check_connection = exports.get_receiver_data = exports.get_user_data = void 0;
const DAO = __importStar(require("../../DAO"));
const Models = __importStar(require("../../models"));
const ag_chat_users = __importStar(require("./chat_helper"));
const index_1 = require("../../config/index");
const default_limit = index_1.app_constant.default_limit;
const index_2 = require("../../middlewares/index");
const check_connection = (sent_by, sent_to) => __awaiter(void 0, void 0, void 0, function* () {
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
        };
        let projection = { _id: 1 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Connections, query, projection, options);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.check_connection = check_connection;
const make_connection = (sent_by, sent_to) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //   console.log(` make_connection>>..... sent_by ` , sent_by , ` sent_to ` , sent_to ); 
        let data_to_save = {
            sent_by: sent_by,
            sent_to: sent_to,
            created_at: +new Date()
        };
        let create_connection = yield DAO.save_data(Models.Connections, data_to_save);
        return create_connection;
    }
    catch (err) {
        throw err;
    }
});
exports.make_connection = make_connection;
const delete_video_message = (payload_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(`delete_video_message  `, payload_data );
        let { sent_to, sender_id, message, type, message_type, media_url, front_img, message_id, local_identifier, token } = payload_data;
        let query = {
            local_identifier: { $in: local_identifier },
            $and: [
                { sent_by: sender_id }
            ]
        };
        let data = yield DAO.remove_data(Models.Messages, query);
        return data;
    }
    catch (err) {
        // console.log(`err in delete-VIDEO_MESSGAE `, err);
        throw err;
    }
});
const save_message = (payload_data, user_data, connection_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { sent_to, message, type, message_type, media_url, front_img, message_id, local_identifier, token } = payload_data;
        let data_to_save = {
            connection_id: connection_id,
            sent_by: user_data,
            sent_to: sent_to,
            type: type,
            message_type: message_type,
            message: message,
            media_url: media_url,
            front_img: front_img,
            is_read: 0,
            created_at: +new Date()
        };
        // console.log(`data_to_save >>. ` , data_to_save ); 
        if (message_id != null || message_id != undefined) {
            data_to_save.message_id = message_id;
        }
        if (local_identifier != null || local_identifier != undefined) {
            data_to_save.local_identifier = local_identifier;
        }
        if (token != null || token != undefined) {
            data_to_save.token = token;
        }
        let save_message = yield DAO.save_data(Models.Messages, data_to_save);
        let { _id: new_msg_id } = save_message;
        //  console.log(`_id  save_data  >>.  ` , new_msg_id);
        // fetch message response
        let response = yield make_msg_response(new_msg_id);
        // console.log(` response ` , response);
        let last_message = null;
        // console.log("<--type-->", type)
        // console.log("<--message_type-->", message_type)
        if (type == 'NORMAL' && message_type == 'TEXT') {
            // console.log("<--case_1-->")
            last_message = message;
        }
        else if (type == 'REPLY' && message_type == 'TEXT') {
            // console.log("<--case_2-->")
            last_message = message;
        }
        else if (type == 'FORWARDED' && message_type == 'TEXT') {
            // console.log("<--case_3-->")
            last_message = "forwarded message";
        }
        else if (type == 'NORMAL' && message_type == 'IMAGE') {
            // console.log("<--case_4-->")
            last_message = 'image';
        }
        else if (type == 'NORMAL' && message_type == 'VIDEO') {
            // console.log("<--case_5-->")
            last_message = 'video';
        }
        else if (type == 'NORMAL' && message_type == 'AUDIO') {
            // console.log("<--case_6-->")
            last_message = 'audio';
        }
        else if (type == 'NORMAL' && message_type == 'DOCUMENT') {
            // console.log("<--case_7-->")
            last_message = 'document';
        }
        // console.log("<--last_message-->", last_message)
        // update last message
        yield update_last_msg(connection_id, last_message, local_identifier, token);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.save_message = save_message;
const make_msg_response = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: _id };
        let projection = { __v: 0 };
        let options = { lean: true };
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
        ];
        let response = yield DAO.populate_data(Models.Messages, query, projection, options, populate);
        return response;
    }
    catch (err) {
        // console.log(` err in make_msg_response >>... `, err);
        throw err;
    }
});
exports.make_msg_response = make_msg_response;
const update_last_msg = (connection_id, message, local_identifier, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: connection_id };
        let update = {
            last_message: message,
            local_identifier: local_identifier,
            token: token,
            updated_at: +new Date()
        };
        let options = { new: true };
        yield DAO.find_and_update(Models.Connections, query, update, options);
    }
    catch (err) {
        throw err;
    }
});
exports.update_last_msg = update_last_msg;
const list_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { pagination, limit, search } = req.query, { _id } = req.user_data;
        limit = parseInt(limit);
        let query = { _id: { $ne: _id }, is_deleted: false };
        if (search && search != undefined) {
            query = { _id: { $ne: _id }, is_deleted: false, name: { $regex: search, $options: 'i' } };
        }
        let skipped_data = parseInt(pagination) > 1 ? (parseInt(pagination) - 1) * 10 : 10;
        let projection = { profile_pic: 1, name: 1, email: 1 };
        let options = yield index_2.helpers.set_options(pagination, limit);
        let response = yield DAO.get_data(Models.Users, query, projection, options);
        // check connection id
        if (response.length) {
            for (let value of response) {
                let { _id: other_user_id } = value;
                let fetch_data = yield check_connection(other_user_id, _id);
                let connection_id = null;
                if (fetch_data.length) {
                    connection_id = fetch_data[0]._id;
                }
                value.connection_id = connection_id;
            }
        }
        // return data
        (0, index_2.handle_success)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.list_users = list_users;
const list_chat_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { pagination, limit, search } = req.query, { _id } = req.user_data;
        let find = search;
        let query = [
            yield ag_chat_users.match_data(_id),
            yield ag_chat_users.set_data(_id),
            yield ag_chat_users.lookup_users(),
            yield ag_chat_users.unwind_users(),
            yield ag_chat_users.lookup_unread_chat(_id),
            yield ag_chat_users.count_message_data(),
            yield ag_chat_users.find_other_user_id(_id),
            yield ag_chat_users.fetch_messages(_id),
            yield ag_chat_users.unwind_messages(),
            yield ag_chat_users.set_last_message(),
            yield ag_chat_users.group_data(),
            yield ag_chat_users.filter_users_by_name(find),
            yield ag_chat_users.remove_empty_doc(),
            yield ag_chat_users.sort_data(),
            yield ag_chat_users.skip_data(pagination, limit),
            yield ag_chat_users.limit_data(limit)
        ];
        let options = { lean: true };
        let fetch_data = yield DAO.aggregate_data(Models.Connections, query, options);
        // return data
        let response = {
            total_count: fetch_data.length,
            data: fetch_data
        };
        //  console.log(` response >>..  ` , response);
        (0, index_2.handle_success)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.list_chat_users = list_chat_users;
const list_chat_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit } = req.query, { _id: user_id } = req.user_data;
        let query = {
            connection_id: _id,
            $or: [
                { sent_by: user_id },
                { sent_to: user_id }
            ],
            // deleted_for: { $nin: user_id }
        };
        let projection = { __v: 0 };
        let options = {
            lean: true,
            skip: parseInt(pagination) * parseInt(limit),
            limit: parseInt(limit),
            sort: { _id: -1 }
        };
        let populate = [
            { path: 'sent_by', select: 'profile_pic name' },
            { path: 'sent_to', select: 'profile_pic name' },
            { path: 'message_id', select: '-__v' },
        ];
        let response = yield DAO.populate_data(Models.Messages, query, projection, options, populate);
        yield read_all_messages(_id, user_id);
        let reverse_response = response.reverse();
        // fetch last seen
        let fetch_data = yield fetch_last_seen(_id, user_id);
        // console.log(`fetch_data >>... ` , fetch_data ); 
        let last_seen = '', user_status = 0;
        if (fetch_data && fetch_data.last_seen && fetch_data.last_seen != undefined) {
            //   console.log(`here in last_seen`);    
            last_seen = fetch_data.last_seen;
            // console.log(`last_seen `, last_seen);
        }
        if (fetch_data && fetch_data.user_status && fetch_data.user_status != undefined) {
            //  console.log(`here in user_status`);
            user_status = fetch_data.user_status;
        }
        // last_seen = (last_seen == `` || last_seen == null ) 
        //              ? await last_seened()
        //              : fetch_data.last_seen  ;   
        let obj = {
            success: true,
            last_seen: last_seen,
            data: reverse_response
        };
        res.send(obj);
    }
    catch (err) {
        // console.log(`err in chat details `, err);
        (0, index_2.handle_catch)(res, err);
    }
});
exports.list_chat_details = list_chat_details;
const read_all_messages = (connection_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {
            connection_id: connection_id,
            sent_to: user_id
        };
        let update = { is_read: 1 };
        yield DAO.update_many(Models.Messages, query, update);
    }
    catch (err) {
        throw err;
    }
});
exports.read_all_messages = read_all_messages;
const new_message_response = (connection_id, sent_to) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //   console.log(` new_message_response _________________ connection_id ` , connection_id , ` sent_to    ` , sent_to);
        let query = [
            yield ag_chat_users.match_by_con_id(connection_id),
            yield ag_chat_users.set_data(sent_to),
            yield ag_chat_users.lookup_users(),
            yield ag_chat_users.unwind_users(),
            yield ag_chat_users.lookup_unread_chat(sent_to),
            yield ag_chat_users.find_other_user_id(sent_to),
            yield ag_chat_users.count_message_data(),
            yield ag_chat_users.fetch_messages(sent_to),
            yield ag_chat_users.unwind_messages(),
            yield ag_chat_users.set_last_message(),
            yield ag_chat_users.group_data(),
            yield ag_chat_users.sort_data()
        ];
        let options = { lean: true };
        let response = yield DAO.aggregate_data(Models.Connections, query, options);
        return response[0];
    }
    catch (err) {
        // console.log(`err in new_message_response `, err);
        throw err;
    }
});
exports.new_message_response = new_message_response;
const read_message = (message_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //   console.log(` in >>.. read_message ` ,message_id ,  ` user_id sender_id >>..  `, user_id );
        let query = {
            _id: message_id,
            sent_to: user_id
        };
        //  console.log(`read_message  query ####################################### . .. . . . ` , query);
        let update = { is_read: 1 };
        let options = { new: true };
        let update_data = yield DAO.find_and_update(Models.Messages, query, update, options);
        // make_msg_response
        // console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`)
        //   console.log(` read_message  update_data read_message >>....` , update_data);
        //console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`)
        let response = yield make_msg_response(update_data._id);
        return response;
    }
    catch (err) {
        // console.log(`err in read message >>>>>..... @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ `, err);
        throw err;
    }
});
exports.read_message = read_message;
const update_last_seen = (data, user_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { date, sender_id, connection_id } = data;
        let _id = user_data;
        //  console.log(`_id ` , _id);
        let query = { _id: _id };
        let update = {
            last_seen: date
        };
        let options = { new: true };
        let updatedata = yield DAO.find_and_update(Models.Users, query, update, options);
    }
    catch (err) {
        // console.log(` update_last_seen online offline >>.... `, err);
        throw err;
    }
});
exports.update_last_seen = update_last_seen;
const last_seen_fxn = (created_at) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(` created_at ` , created_at );
        var dd = new Date(parseInt(created_at));
        // console.log(` dd  `, dd);
        // console.log(` dd.toJSON() ` , dd.toJSON() );
        var data = dd.toJSON().replace("T", " ").split(".");
        data = `${data[0]} +0000`;
        // console.log(` data `, data);
        return data;
    }
    catch (error) {
        // console.log(` error in last_seen_fxn `, error);
    }
});
const fetch_last_seen = (connection_id, receiver_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("---------------------receiver_id-------",receiver_id)
        let user_id = yield fetch_receiver_id(connection_id, receiver_id);
        let query = { _id: user_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(Models.Users, query, projection, options);
        if (response.length) {
            let { last_seen, user_status, created_at } = response[0];
            var seen = (last_seen == `` || last_seen == null)
                ? yield last_seen_fxn(created_at)
                : last_seen;
            return {
                last_seen: seen,
                user_status: user_status,
                created_at: created_at
            };
        }
    }
    catch (err) {
        throw err;
    }
});
const fetch_receiver_id = (connection_id, receiver_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: connection_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(Models.Connections, query, projection, options);
        if (response.length) {
            let { sent_by, sent_to } = response[0];
            let user_id = null;
            if (JSON.stringify(sent_by) == JSON.stringify(receiver_id)) {
                user_id = sent_to;
            }
            else {
                user_id = sent_by;
            }
            return user_id;
        }
    }
    catch (err) {
        throw err;
    }
});
const delete_message = (data, user_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { local_identifier, delete_type, connection_id } = data;
        // let { _id : user_id } = user_data
        let user_id = user_data;
        let other_user_id = yield fetch_receiver_id(connection_id, user_id);
        let deleted_for = [];
        if (delete_type == 1) {
            deleted_for.push(user_id);
        }
        if (delete_type == 2) {
            deleted_for.push(user_id, other_user_id);
        }
        let query = {
            local_identifier: { $in: local_identifier },
            $or: [
                { sent_by: user_id },
                { sent_to: user_id }
            ]
        };
        let update = {
            delete_type: delete_type,
            deleted_for: deleted_for
        };
        yield DAO.update_many(Models.Messages, query, update);
    }
    catch (err) {
        // console.log(` err in delete `, err);
        throw err;
    }
});
exports.delete_message = delete_message;
const get_receiver_data = (receiver_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("---------------------receiver_id-------",receiver_id)
        let query = { user_id: receiver_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let populate = [
            { path: 'user_id' }
        ];
        let response = yield DAO.populate_data(Models.Sessions, query, projection, options, populate);
        if (response.length) {
            return response;
        }
    }
    catch (err) {
        // console.log(` eerr get_receiver_data  `, err);
        throw err;
    }
});
exports.get_receiver_data = get_receiver_data;
const get_user_data = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("----------get_user_data-----------get_user_data token socekt -------", token );
        let query = { access_token: token };
        let projection = { __v: 0 };
        let options = { lean: true };
        let populate = [
            { path: 'user_id' }
        ];
        let response = yield DAO.populate_data(Models.Sessions, query, projection, options, populate);
        // console.log(` response in   get_user_data  >>>  ` , response);
        if (response.length > 0) {
            return response[0];
        }
        else {
            return {};
        }
    }
    catch (err) {
        // console.log(` eerr get_receiver_data  `, err);
        throw err;
    }
});
exports.get_user_data = get_user_data;
