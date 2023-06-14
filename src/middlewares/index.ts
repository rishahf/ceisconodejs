import * as authenticator from "./authenticator";
import {
  handle_return,
  handle_success,
  handle_catch,
  handle_custom_error,
  handle_joi_error,
} from "./handler";
import { generate_token, decode_token, verify_token } from "./gen_token";
import * as helpers from "./helpers";
import send_email from "./send_email";
import { send_notification,send_notification_to_all } from "./send_notifictaion";
import  { backup_using_cron} from "./backup";
import socket_authenticator from "./socket_middleware"

export {
  authenticator,
  handle_success,
  handle_return,
  handle_catch,
  handle_custom_error,
  handle_joi_error,
  generate_token,
  decode_token,
  verify_token,
  helpers,
  send_email,
  send_notification,
  send_notification_to_all,
  backup_using_cron,
  socket_authenticator
//   delete_backup,
};
