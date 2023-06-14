
import express from 'express';
import * as do_spaces_controller from './do_spaces_controller';
import * as do_spaces_controller_multi from './do_spaces_controller_multi';
const router = express.Router();

router.post("/do_spaces_file_upload", do_spaces_controller.upload_file)
router.post("/do_spaces_file_upload_multiple", do_spaces_controller_multi.upload_file)


export default router;