
import express from 'express';
import * as chat_controller from './chat_controller';
import authenticator from '../../middlewares/authenticator'
const router = express.Router();

router.get("/list_users", authenticator, chat_controller.list_users)
router.get("/list_chat_users", authenticator, chat_controller.list_chat_users)
router.get("/list_chat_details", authenticator, chat_controller.list_chat_details)
// router.put("/delete_message", authenticator, chat_controller.delete_message)

export default router;