"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list_all_files = exports.upload_file = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const moment_1 = __importDefault(require("moment"));
const resize_img_1 = __importDefault(require("resize-img"));
const handler_1 = require("../../middlewares/handler");
// BUCKET_NAME=sharedecommerce
// DO_ACCESS_KEY=FPR3OQAVBJTMD4TZMJNJ
// DO_SECRET_ACCESS_KEY=GgjLr+5C7//4JVJD4/Qaffepp32iCCUeL2vsgY461Tk
// DO_ENDPOINT=nyc3.digitaloceanspaces.com
// Url=https://sharedecommerce.nyc3.digitaloceanspaces.com
// DO_REGION=nyc3
// const do_spaces_endpoint = process.env.DO_SPACES_ENDPOINT
// let do_spaces_key = process.env.DO_SPACES_KEY
// let do_spaces_secret = process.env.DO_SPACES_SECRET
// let do_spaces_bucket_name = process.env.DO_SPACES_NAME
const do_spaces_endpoint = "nyc3.digitaloceanspaces.com";
let do_spaces_key = "FPR3OQAVBJTMD4TZMJNJ";
let do_spaces_secret = "GgjLr+5C7//4JVJD4/Qaffepp32iCCUeL2vsgY461Tk";
let do_spaces_bucket_name = "sharedecommerce";
// console.log("--------------------do_spaces_endpoint-----", do_spaces_endpoint)
// console.log("--------------------do_spaces_key-----", do_spaces_key)
// console.log("--------------------do_spaces_secret-----", do_spaces_secret)
// console.log("--------------------do_spaces_bucket_name-----", do_spaces_bucket_name)
const spacesEndpoint = new aws_sdk_1.default.Endpoint(do_spaces_endpoint);
const s3 = new aws_sdk_1.default.S3({
    endpoint: spacesEndpoint,
    accessKeyId: do_spaces_key,
    secretAccessKey: do_spaces_secret
});
const upload_file = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { file: { name, data, mimetype } } = req.files;
        console.log("--------------req.files-->", req.files);
        // check file type
        let split_mime_type = mimetype.split('/');
        // console.log("--------------split_mime_type---", split_mime_type)
        if (split_mime_type[0] == 'image') {
            let response = yield upload_images(name, data, mimetype);
            (0, handler_1.handle_success)(res, response);
        }
        else if (split_mime_type[0] == 'audio') {
            let response = yield upload_audio(name, data, mimetype);
            (0, handler_1.handle_success)(res, response);
        }
        else if (split_mime_type[0] == 'video') {
            let response = yield upload_video(name, data, mimetype);
            (0, handler_1.handle_success)(res, response);
        }
        else if (split_mime_type[0] == 'pdf') {
            let response = yield upload_doc(name, data, mimetype);
            (0, handler_1.handle_success)(res, response);
        }
        else {
            let message = 'Sorry we currently do not support this format';
            (0, handler_1.handle_catch)(res, message);
        }
    }
    catch (err) {
        (0, handler_1.handle_catch)(res, err);
    }
});
exports.upload_file = upload_file;
const upload_images = (name, data, mime_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let split_mime_type = mime_type.split("/");
        // gen file name
        let file_name = yield generate_file_name(name);
        yield create_original_file(file_name, data, mime_type);
        console.log('split - mime type ', split_mime_type);
        if (split_mime_type[1] != 'webp') {
            yield create_medium_file(file_name, data, mime_type);
            yield create_small_file(file_name, data, mime_type);
        }
        let response = {
            base_url: 'https://sharedecommerce.nyc3.digitaloceanspaces.com',
            type: 'IMAGE',
            folders: ['original', 'medium', 'small'],
            file_name: file_name
        };
        return response;
    }
    catch (err) {
        throw err;
    }
});
const create_original_file = (name, data, mime_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = {
            Bucket: do_spaces_bucket_name,
            Key: `sharedecommerce/original/${name}`,
            ACL: 'public-read',
            Body: data,
            ContentType: mime_type
        };
        // create original file
        let response = yield upload_file_to_spaces(params);
        return response;
    }
    catch (err) {
        throw err;
    }
});
const create_medium_file = (name, data, mime_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('---resize --- ');
        let options = { width: 250, height: 250 };
        let after_resize = yield (0, resize_img_1.default)(data, options);
        let params = {
            Bucket: do_spaces_bucket_name,
            Key: `sharedecommerce/medium/${name}`,
            ACL: 'public-read',
            Body: after_resize,
            ContentType: mime_type
        };
        // create original file
        let response = yield upload_file_to_spaces(params);
        return response;
    }
    catch (err) {
        throw err;
    }
});
const create_small_file = (name, data, mime_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let options = { width: 100, height: 100 };
        let after_resize = yield (0, resize_img_1.default)(data, options);
        let params = {
            Bucket: do_spaces_bucket_name,
            Key: `sharedecommerce/small/${name}`,
            ACL: 'public-read',
            Body: after_resize,
            ContentType: mime_type
        };
        // create original file
        let response = yield upload_file_to_spaces(params);
        return response;
    }
    catch (err) {
        throw err;
    }
});
const upload_audio = (name, data, mime_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // gen file name
        let file_name = yield generate_file_name(name);
        let params = {
            Bucket: do_spaces_bucket_name,
            Key: `sharedecommerce/audio/${file_name}`,
            ACL: 'public-read',
            Body: data,
            ContentType: mime_type
        };
        // create original file
        yield upload_file_to_spaces(params);
        let response = {
            base_url: 'https://sharedecommerce.nyc3.digitaloceanspaces.com',
            type: 'AUDIO',
            folders: ['audio'],
            file_name: file_name
        };
        return response;
    }
    catch (err) {
        throw err;
    }
});
const upload_video = (name, data, mime_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // gen file name
        let file_name = yield generate_file_name(name);
        let params = {
            Bucket: do_spaces_bucket_name,
            Key: `sharedecommerce/video/${file_name}`,
            ACL: 'public-read',
            Body: data,
            ContentType: mime_type
        };
        // create original file
        yield upload_file_to_spaces(params);
        let response = {
            base_url: 'https://sharedecommerce.nyc3.digitaloceanspaces.com',
            type: 'VIDEO',
            folders: ['video'],
            file_name: file_name
        };
        return response;
    }
    catch (err) {
        throw err;
    }
});
const upload_doc = (name, data, mime_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // gen file name
        let file_name = yield generate_file_name(name);
        let params = {
            Bucket: do_spaces_bucket_name,
            Key: `sharedecommerce/documents/${file_name}`,
            ACL: 'public-read',
            Body: data,
            ContentType: mime_type
        };
        // create original file
        yield upload_file_to_spaces(params);
        let response = {
            base_url: 'https://sharedecommerce.nyc3.digitaloceanspaces.com',
            type: 'DOCUMENT',
            folders: ['documents'],
            file_name: file_name
        };
        return response;
    }
    catch (err) {
        throw err;
    }
});
const generate_file_name = (file_name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("<--file_name-->", file_name)
        let current_millis = (0, moment_1.default)().format('x');
        let raw_file_name = file_name.split(/\s/).join('');
        let split_file = raw_file_name.split('.');
        // spiting by all special charcters
        let split_all = split_file[0].split(/[^a-zA-Z0-9]/g).join('_');
        let name = split_all.toLowerCase();
        let ext = split_file[1];
        // console.log("<--name-->", name)
        // console.log("<--ext-->", ext)
        let gen_file_name = `${name}_${current_millis}.${ext}`;
        // console.log("<--gen_file_name-->", gen_file_name)
        return gen_file_name.toLowerCase();
    }
    catch (err) {
        throw err;
    }
});
const upload_file_to_spaces = (params) => {
    return new Promise((resolve, reject) => {
        try {
            s3.upload(params, (err, data) => {
                if (err) {
                    console.error("uploading error", err);
                }
                else {
                    console.error("uploading sucessfull", data);
                    return resolve(data);
                }
            });
        }
        catch (err) {
            return reject(err);
        }
    });
};
const list_all_files = () => {
    return new Promise((resolve, reject) => {
        try {
            let params = { Bucket: do_spaces_bucket_name };
            s3.listObjects(params, (err, data) => {
                if (err) {
                    console.error("error", err);
                }
                else {
                    return resolve(data);
                    // return resolve(data.Contents);
                }
            });
        }
        catch (err) {
            return reject(err);
        }
    });
};
exports.list_all_files = list_all_files;
