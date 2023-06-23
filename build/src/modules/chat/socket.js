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
const chat_controller = __importStar(require("./chat_controller"));
const socket_io_1 = require("socket.io");
const index_1 = require("../../middlewares/index");
var socket_error = {
    type: "ERROR",
    status_code: 401,
    message_type: "UNAUTHORIZED",
    error_message: `You are not authorized to perform this action.`
};
const connect_socket = (server) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: "*"
            }
        });
        io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
            var user_data = yield chat_controller.get_user_data(socket.handshake.headers.token);
            if (Object.keys(user_data).length == 0
                || user_data && user_data.user_id && user_data.user_id.is_blocked == true
                || user_data && user_data.user_id && user_data.user_id.is_deleted == true
                || user_data && user_data.user_id && user_data.user_id.account_status == false) {
                // console.log(`unauthorised socket connection chk`);
                //   socket.emit("create_connection", response);
                io.to(socket.id).emit("unauthorised connection chk", socket_error);
                return;
            }
            socket.user_data = user_data;
            socket = socket.setMaxListeners(0);
            // send message || receive message
            socket.on("send_message", (payload) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    var user_data = yield chat_controller.get_user_data(socket.handshake.headers.token);
                    if (Object.keys(user_data).length == 0
                        || user_data && user_data.user_id && user_data.user_id.is_blocked == true
                        || user_data && user_data.user_id && user_data.user_id.is_deleted == true
                        || user_data && user_data.user_id && user_data.user_id.account_status == false) {
                        // console.log(`unauthorised socket send msg chk `);
                        io.to(socket.id).emit("unauthorised", socket_error);
                        return;
                    }
                    else {
                        let { sent_to, local_identifier, token, sender_id } = payload;
                        // console.log("PAYLOAD --> ", payload)
                        let check_connection = yield chat_controller.check_connection(sender_id, sent_to);
                        let connection_id;
                        if (check_connection.length) {
                            connection_id = check_connection[0]._id;
                            socket.broadcast.emit(connection_id);
                        }
                        else {
                            let create_con = yield chat_controller.make_connection(sender_id, sent_to);
                            connection_id = create_con._id;
                            socket.broadcast.emit(connection_id);
                        }
                        let { message, message_type, media_url } = payload;
                        socket.broadcast.emit(connection_id);
                        // save chat data
                        let chat_data = yield chat_controller.save_message(payload, sender_id, connection_id);
                        // console.log("chat_data --> ", chat_data[0])
                        if ((message_type == 'VIDEO' || message_type == 'IMAGE' || message_type == 'AUDIO' || message_type == 'DOCUMENT')
                            && media_url == ``) {
                            // io.to(socket.id).emit('receive_message', chat_data[0]);
                            socket.broadcast.to(connection_id).emit('receive_message', chat_data[0]);
                        }
                        else {
                            // io.to(connection_id).emit('receive_message', chat_data[0]);
                            socket.broadcast.to(connection_id).emit('receive_message', chat_data[0]);
                            chat_data[0].local_identifier = local_identifier;
                            chat_data[0].token = token;
                            let { sent_to, sent_by } = chat_data[0];
                            let chat_users = yield chat_controller.new_message_response(connection_id, sent_to._id);
                            // console.log("CHAT USER --> ", chat_users)
                            chat_users.sent_by = sent_by;
                            chat_users.sent_to = sent_to;
                            socket.broadcast.emit('list_chat_users', chat_users);
                            let receiver_data = yield chat_controller.get_receiver_data(sent_to._id);
                            // console.log("Receiver_Data --> ", receiver_data)
                            let data = {
                                title: user_data.user_id.name,
                                message: (message_type == "TEXT") ? message : message_type,
                                sender_id: sender_id,
                                notif_type: 2,
                                type: 'NEW_MESSAGE',
                                connection_id: connection_id,
                                profile_pic: user_data.user_id.profile_pic ? user_data.user_id.profile_pic : ``,
                                name: user_data.user_id.name
                            };
                            // console.log("data --> ", data)
                            if (receiver_data && receiver_data.length && receiver_data[receiver_data.length - 1].user_id.push_notification == 1) {
                                (0, index_1.send_notification)(data, receiver_data[receiver_data.length - 1].fcm_token);
                            }
                        }
                        // here till  
                    }
                }
                catch (err) {
                    // console.log(`error in send message and receive_message event `, err);
                }
            }));
        }));
    }
    catch (err) {
        throw err;
    }
});
exports.default = connect_socket;
