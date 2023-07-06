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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_backup = exports.backup_using_cron = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const moment_1 = __importDefault(require("moment"));
const mime_types_1 = __importDefault(require("mime-types"));
const DAO = __importStar(require("../DAO"));
const Models = __importStar(require("../models"));
const config_1 = require("../config");
const child_process_1 = require("child_process");
const handler_1 = require("./handler");
const do_spaces_endpoint = process.env.DO_SPACES_ENDPOINT;
let do_spaces_key = process.env.DO_SPACES_KEY;
let do_spaces_secret = process.env.DO_SPACES_SECRET;
let do_spaces_bucket_name = process.env.DO_SPACES_NAME;
const spacesEndpoint = new aws_sdk_1.default.Endpoint(do_spaces_endpoint);
const s3 = new aws_sdk_1.default.S3({
    endpoint: spacesEndpoint,
    accessKeyId: do_spaces_key,
    secretAccessKey: do_spaces_secret,
});
const create_backup = (backup_name, gzip) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { URI } = config_1.db_config;
        // change path
        let dump_path;
        if (process.env.ENVIRONMENT == "LOCAL") {
            dump_path = path_1.default.resolve(__dirname, `../../db_backups/${backup_name}`);
        }
        else {
            dump_path = path_1.default.resolve(__dirname, `../../../db_backups/${backup_name}`);
        }
        // let dump_path = path.resolve(__dirname, `../../db_backups/${backup_name}`);
        let command = `mongodump --uri="${URI}" ${gzip ? " --gzip" : ""} --archive="${dump_path}"`;
        let gen_backup_file = yield exexute_backup_command(command);
        return gen_backup_file;
    }
    catch (err) {
        throw err;
    }
});
const exexute_backup_command = (command) => {
    return new Promise((resolve, reject) => {
        try {
            (0, child_process_1.exec)(command, (err) => {
                if (err) {
                    console.error("uploading error", err);
                }
                else {
                    console.log("-----backup_file_created--");
                    let message = "BACKUP_CREATED";
                    return resolve(message);
                }
            });
        }
        catch (err) {
            return reject(err);
        }
    });
};
// if backup count is less than 10
const backup_case_1 = (language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let fetch_data = yield gen_backup_name();
        let { name } = fetch_data;
        console.log("__dirname....", __dirname);
        let file_name = `${name}.gz`;
        let gen_backup = yield create_backup(file_name, true);
        if (gen_backup == "BACKUP_CREATED") {
            // fetch file from folder
            console.log("__dirname....", __dirname);
            let fetch_file;
            if (process.env.ENVIRONMENT == "LOCAL") {
                fetch_file = path_1.default.resolve(__dirname, `../../db_backups/${file_name}`);
            }
            else {
                fetch_file = path_1.default.resolve(__dirname, `../../../db_backups/${file_name}`);
            }
            console.log("fetch_file....", fetch_file);
            // check file type
            let mime_type = yield mime_types_1.default.lookup(fetch_file);
            // read file
            let read_file = fs_1.default.readFileSync(fetch_file);
            let params = {
                Bucket: do_spaces_bucket_name,
                Key: `sharedecommerce/backup/${file_name}`,
                ACL: "public-read",
                Body: read_file,
                ContentType: mime_type,
            };
            console.log('params ----- ', params);
            let upload_file = yield upload_file_to_spaces(params);
            let { Location } = upload_file;
            // console.log('location ---- ', location)
            if (Location != undefined) {
                // remove file from local
                fs_1.default.unlinkSync(fetch_file);
                console.log("inside ---- location ---- ");
                let response = yield save_backup_logs(fetch_data, file_name);
                console.log('response ----- ', response);
                return response;
            }
            else {
                throw yield (0, handler_1.handle_custom_error)("BACKUP_UPLOAD_FAILED", language);
            }
        }
        else {
            throw yield (0, handler_1.handle_custom_error)("BACKUP_UPLOAD_FAILED", language);
        }
    }
    catch (err) {
        throw err;
    }
});
// if backup count is greater than 10
const backup_case_2 = (data, language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, name } = data;
        let file_name = `${name}.gz`;
        let gen_backup = yield create_backup(file_name, true);
        console.log("__dirname....", __dirname);
        if (gen_backup == "BACKUP_CREATED") {
            // fetch file from folder
            console.log("__dirname....", __dirname);
            let fetch_file;
            if (process.env.ENVIRONMENT == "LOCAL") {
                fetch_file = path_1.default.resolve(__dirname, `../../db_backups/${file_name}`);
            }
            else {
                fetch_file = path_1.default.resolve(__dirname, `../../../db_backups/${file_name}`);
            }
            // check file type
            let mime_type = yield mime_types_1.default.lookup(fetch_file);
            // read file
            let read_file = fs_1.default.readFileSync(fetch_file);
            let params = {
                Bucket: do_spaces_bucket_name,
                Key: `sharedecommerce/backup/${file_name}`,
                ACL: "public-read",
                Body: read_file,
                ContentType: mime_type,
            };
            let upload_file = yield upload_file_to_spaces(params);
            let { Location } = upload_file;
            // console.log("location ", location);
            if (Location != undefined) {
                // remove file from local
                fs_1.default.unlinkSync(fetch_file);
                // delete old record
                yield DAO.remove_data(Models.BackupLogs, { _id: _id });
                // add new record
                let response = yield save_backup_logs(data, file_name);
                return response;
            }
            else {
                throw yield (0, handler_1.handle_custom_error)("BACKUP_UPLOAD_FAILED", language);
            }
        }
        else {
            throw yield (0, handler_1.handle_custom_error)("BACKUP_UPLOAD_FAILED", language);
        }
    }
    catch (err) {
        throw err;
    }
});
const gen_backup_name = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let total_backups = yield fetch_total_backups();
        let unique_key = 1;
        let static_name = "sharedecommerce_db_backup";
        if (total_backups > 0) {
            let new_key = Number(unique_key) + Number(total_backups);
            unique_key = new_key;
        }
        let name = `${static_name}_${unique_key}`;
        return {
            name: name,
            unique_key: unique_key,
        };
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
const save_backup_logs = (data, location) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let current_date = (0, moment_1.default)().format("DD-MM-YYYY");
        let { name, unique_key } = data;
        let set_data = {
            name: name,
            unique_key: unique_key,
            date: current_date,
            file_url: location,
            created_at: +new Date(),
        };
        let response = yield DAO.save_data(Models.BackupLogs, set_data);
        return response;
    }
    catch (err) {
        throw err;
    }
});
const delete_backup = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = {
            Bucket: do_spaces_bucket_name,
            Key: key,
        };
        return new Promise((resolve, reject) => {
            try {
                s3.deleteObject(params, (err, data) => {
                    if (err) {
                        console.error("error", err);
                    }
                    else {
                        return resolve(data.Contents);
                    }
                });
            }
            catch (err) {
                return reject(err);
            }
        });
    }
    catch (err) {
        throw err;
    }
});
exports.delete_backup = delete_backup;
const fetch_oldest_backup = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        let projection = { __v: 0 };
        let options = { lean: true, sort: { _id: 1 }, limit: 1 };
        let fetch_data = yield DAO.get_data(Models.BackupLogs, query, projection, options);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
const fetch_total_backups = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let total_records = yield DAO.count_data(Models.BackupLogs, {});
        return total_records;
    }
    catch (err) {
        throw err;
    }
});
const backup_using_cron = (language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let total_count = yield fetch_total_backups();
        let response;
        if (total_count == 10) {
            console.log("case_1");
            let fetch_data = yield fetch_oldest_backup();
            if (fetch_data.length) {
                let { name } = fetch_data[0];
                // delete old record
                yield delete_backup(name);
                // add new record
                response = yield backup_case_2(fetch_data[0], language);
                console.log(` response >... `, response);
            }
        }
        else {
            console.log("case_2");
            response = yield backup_case_1(language);
            console.log(`2 backup response >... `, response);
        }
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.backup_using_cron = backup_using_cron;
