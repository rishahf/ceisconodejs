import FCM from 'fcm-push';
import { config } from 'dotenv';
import { handle_catch } from './handler';
import { handle_success } from './handler';
config();
const server_key = process.env.NOTIFICATION_KEY

const send_notification = async (data: any, fcm_token: string) => {
    try {

        const fcm = new FCM(server_key)

        let message = {
            to: fcm_token,
            data: data,
            notification: {
                title: data.title,
                body: data.message,
                push_type: data.type,
                sound: 'default',
                badge: 0
            }
        }

        fcm.send(message, function (err: any, result: any) {
            if (err) { 
              console.log("---- Notification ERROR From Admin----");
              console.log(handle_catch) 
            }
            else { 
              console.log('---- Notification Sent From Admin----');
              
              console.log(handle_success) 
            }
        });

    }
    catch (err) {
        throw err;
    }
}

const send_notification_to_all = async (data: any, fcm_ids: string) => {
  try {
    const fcm = new FCM(server_key);

    console.log("---- NOTIFICATION FCM IDS -----");

    let message = {
      registration_ids: fcm_ids,
      data: data,
      notification: {
        title: data.title,
        body: data.message,
        push_type: data.type,
        sound: "default",
        badge: 0,
      },
    };

    fcm.send(message, function (err: any, result: any) {
      if (err) {
        console.log("---- NOTIFICATION ERR -----");
        console.log(handle_catch);
      } else {
        console.log('---- NOTIFICATION SENT -----');
        console.log(handle_success);
      }
    });
  } catch (err) {
    throw err;
  }
};


export { send_notification, send_notification_to_all }