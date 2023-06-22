
import * as chat_controller from './chat_controller'
import { Server, Socket } from "socket.io";
import { send_notification } from '../../middlewares/index';

var socket_error: any = {
    type: "ERROR",
    status_code: 401,
    message_type: "UNAUTHORIZED",
    error_message: `You are not authorized to perform this action.`
}

const connect_socket = async (server: any) => {
    try {

        const io = new Server(server, {
            cors: {
                origin: "*"
            }
        });

        io.on("connection", async (socket: any | Socket) => {

            var user_data = await chat_controller.get_user_data(socket.handshake.headers.token);

            if (Object.keys(user_data).length == 0
                || user_data && user_data.user_id && user_data.user_id.is_blocked == true
                || user_data && user_data.user_id && user_data.user_id.is_deleted == true
                || user_data && user_data.user_id && user_data.user_id.account_status == false) {

                // console.log(`unauthorised socket connection chk`);

                //   socket.emit("create_connection", response);
                io.to(socket.id).emit("unauthorised connection chk", socket_error)
                return
            }

            socket.user_data = user_data
            socket = socket.setMaxListeners(0);

            // send message || receive message
            socket.on("send_message", async (payload: any) => {
                try {

                    var user_data = await chat_controller.get_user_data(socket.handshake.headers.token);

                    if (Object.keys(user_data).length == 0
                        || user_data && user_data.user_id && user_data.user_id.is_blocked == true
                        || user_data && user_data.user_id && user_data.user_id.is_deleted == true
                        || user_data && user_data.user_id && user_data.user_id.account_status == false) {

                        // console.log(`unauthorised socket send msg chk `);

                        io.to(socket.id).emit("unauthorised", socket_error)
                        return
                    }
                    else {

                        let { sent_to, local_identifier, token, sender_id } = payload
                        // console.log("PAYLOAD --> ", payload)

                        let check_connection: any = await chat_controller.check_connection(sender_id, sent_to)

                        let connection_id: any;

                        if (check_connection.length) {
                            connection_id = check_connection[0]._id;
                            socket.broadcast.emit(connection_id);
                        } else {
                            let create_con: any = await chat_controller.make_connection(sender_id, sent_to)
                            connection_id = create_con._id;
                            socket.broadcast.emit(connection_id);
                        }

                        let { message, message_type, media_url } = payload
                        socket.broadcast.emit(connection_id);

                        // save chat data
                        let chat_data = await chat_controller.save_message(payload, sender_id, connection_id);
                        // console.log("chat_data --> ", chat_data[0])

                        if ((message_type == 'VIDEO' || message_type == 'IMAGE' || message_type == 'AUDIO' || message_type == 'DOCUMENT')
                            && media_url == ``) {
                            // io.to(socket.id).emit('receive_message', chat_data[0]);
                            socket.broadcast.to(connection_id).emit('receive_message', chat_data[0])
                        } else {

                            // io.to(connection_id).emit('receive_message', chat_data[0]);
                            socket.broadcast.to(connection_id).emit('receive_message', chat_data[0])

                            chat_data[0].local_identifier = local_identifier
                            chat_data[0].token = token

                            let { sent_to, sent_by } = chat_data[0]

                            let chat_users = await chat_controller.new_message_response(connection_id, sent_to._id)
                            // console.log("CHAT USER --> ", chat_users)

                            chat_users.sent_by = sent_by
                            chat_users.sent_to = sent_to

                            socket.broadcast.emit('list_chat_users', chat_users);

                            let receiver_data = await chat_controller.get_receiver_data(sent_to._id)
                            // console.log("Receiver_Data --> ", receiver_data)

                            let data: any = {
                                title: user_data.user_id.name,
                                message: (message_type == "TEXT") ? message : message_type,
                                sender_id: sender_id,
                                notif_type: 2,
                                type: 'NEW_MESSAGE',
                                connection_id: connection_id,
                                profile_pic: user_data.user_id.profile_pic ? user_data.user_id.profile_pic : ``,
                                name: user_data.user_id.name
                            }
                            // console.log("data --> ", data)

                            if (receiver_data && receiver_data.length && receiver_data[receiver_data.length - 1].user_id.push_notification == 1) {
                                send_notification(data, receiver_data[receiver_data.length - 1].fcm_token)
                            }

                        }
                        // here till  
                    }
                } catch (err) {
                    // console.log(`error in send message and receive_message event `, err);
                }

            })
        });

    }
    catch (err) {
        throw err;
    }
}

export default connect_socket

