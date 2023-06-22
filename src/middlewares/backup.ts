import AWS, { FSx } from "aws-sdk";
import { config } from "dotenv";
config();
import fs from "fs";
import path from "path";
import moment from "moment";
import mime from "mime-types";
import * as DAO from "../DAO";
import * as Models from "../models";
import { error } from "../config/index";
import { db_config } from "../config";
import { exec } from "child_process";
import { handle_custom_error } from "./handler";

const do_spaces_endpoint = process.env.DO_SPACES_ENDPOINT;
let do_spaces_key = process.env.DO_SPACES_KEY;
let do_spaces_secret = process.env.DO_SPACES_SECRET;
let do_spaces_bucket_name = process.env.DO_SPACES_NAME;

const spacesEndpoint = new AWS.Endpoint(do_spaces_endpoint);
const s3: any = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: do_spaces_key,
  secretAccessKey: do_spaces_secret,
});

const create_backup = async (backup_name: string, gzip: boolean) => {
  try {
    let { URI } = db_config;
    // change path
    let dump_path: any;
    if (process.env.ENVIRONMENT == "LOCAL") {
      dump_path = path.resolve(__dirname, `../../db_backups/${backup_name}`);
    } else {
      dump_path = path.resolve(__dirname, `../../../db_backups/${backup_name}`);
    }
    // let dump_path = path.resolve(__dirname, `../../db_backups/${backup_name}`);
    let command = `mongodump --uri="${URI}" ${
      gzip ? " --gzip" : ""
    } --archive="${dump_path}"`;
    let gen_backup_file = await exexute_backup_command(command);
    return gen_backup_file;
  } catch (err) {
    throw err;
  }
};

const exexute_backup_command = (command: string) => {
  return new Promise((resolve, reject) => {
    try {
      exec(command, (err) => {
        if (err) {
          console.error("uploading error", err);
        } else {
          console.log("-----backup_file_created--");
          let message = "BACKUP_CREATED";
          return resolve(message);
        }
      });
    } catch (err) {
      return reject(err);
    }
  });
};

// if backup count is less than 10
const backup_case_1 = async (language: string) => {
  try {
    let fetch_data: any = await gen_backup_name();
    let { name } = fetch_data;

    console.log("__dirname....", __dirname);
    let file_name = `${name}.gz`;
    let gen_backup = await create_backup(file_name, true);

    if (gen_backup == "BACKUP_CREATED") {
      // fetch file from folder
      console.log("__dirname....", __dirname);
      let fetch_file: any;
      if (process.env.ENVIRONMENT == "LOCAL") {
        fetch_file = path.resolve(__dirname, `../../db_backups/${file_name}`);
      } else {
        fetch_file = path.resolve(__dirname,`../../../db_backups/${file_name}`);
      }
      console.log("fetch_file....", fetch_file);
      // check file type
      let mime_type = await mime.lookup(fetch_file);
      // read file
      let read_file = fs.readFileSync(fetch_file);

      let params = {
        Bucket: do_spaces_bucket_name,
        Key: `sharedecommerce/backup/${file_name}`,
        ACL: "public-read",
        Body: read_file,
        ContentType: mime_type,
      };
      console.log('params ----- ', params)
      let upload_file: any = await upload_file_to_spaces(params);
      let { Location } = upload_file;
      // console.log('location ---- ', location)
      if (Location != undefined) {
        // remove file from local
        fs.unlinkSync(fetch_file);
        console.log("inside ---- location ---- ");
        let response = await save_backup_logs(fetch_data, file_name);
        console.log('response ----- ', response)
        return response;
      } else {
        throw await handle_custom_error("BACKUP_UPLOAD_FAILED", language);
      }
    } else {
      throw await handle_custom_error("BACKUP_UPLOAD_FAILED", language);
    }
  } catch (err) {
    throw err;
  }
};

// if backup count is greater than 10
const backup_case_2 = async (data: any, language: string) => {
  try {
    let { _id, name } = data;

    let file_name = `${name}.gz`;
    let gen_backup = await create_backup(file_name, true);

    console.log("__dirname....", __dirname);

    if (gen_backup == "BACKUP_CREATED") {
      // fetch file from folder
      console.log("__dirname....", __dirname);
      let fetch_file: any;
      if (process.env.ENVIRONMENT == "LOCAL") {
        fetch_file = path.resolve(__dirname, `../../db_backups/${file_name}`);
      } else {
        fetch_file = path.resolve(
          __dirname,
          `../../../db_backups/${file_name}`
        );
      }

      // check file type
      let mime_type = await mime.lookup(fetch_file);

      // read file
      let read_file = fs.readFileSync(fetch_file);

      let params = {
        Bucket: do_spaces_bucket_name,
        Key: `sharedecommerce/backup/${file_name}`,
        ACL: "public-read",
        Body: read_file,
        ContentType: mime_type,
      };

      let upload_file: any = await upload_file_to_spaces(params);
      let { Location } = upload_file;
      // console.log("location ", location);
      if (Location != undefined) {
        // remove file from local
        fs.unlinkSync(fetch_file);

        // delete old record
        await DAO.remove_data(Models.BackupLogs, { _id: _id });

        // add new record
        let response = await save_backup_logs(data, file_name);
        return response;
      } else {
        throw await handle_custom_error("BACKUP_UPLOAD_FAILED", language);
      }
    } else {
      throw await handle_custom_error("BACKUP_UPLOAD_FAILED", language);
    }
  } catch (err) {
    throw err;
  }
};

const gen_backup_name = async () => {
  try {
    let total_backups = await fetch_total_backups();
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
  } catch (err) {
    throw err;
  }
};

const upload_file_to_spaces = (params: any) => {
  return new Promise((resolve, reject) => {
    try {
      s3.upload(params, (err: any, data: any) => {
        if (err) {
          console.error("uploading error", err);
        } else {
          console.error("uploading sucessfull", data);
          return resolve(data);
        }
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const save_backup_logs = async (data: any, location: string) => {
  try {
    let current_date = moment().format("DD-MM-YYYY");
    let { name, unique_key } = data;

    let set_data = {
      name: name,
      unique_key: unique_key,
      date: current_date,
      file_url: location,
      created_at: +new Date(),
    };
    let response = await DAO.save_data(Models.BackupLogs, set_data);
    return response;
  } catch (err) {
    throw err;
  }
};

const delete_backup = async (key: string) => {
  try {
    let params = {
      Bucket: do_spaces_bucket_name,
      Key: key,
    };

    return new Promise((resolve, reject) => {
      try {
        s3.deleteObject(params, (err: any, data: any) => {
          if (err) {
            console.error("error", err);
          } else {
            return resolve(data.Contents);
          }
        });
      } catch (err) {
        return reject(err);
      }
    });
  } catch (err) {
    throw err;
  }
};

const fetch_oldest_backup = async () => {
  try {
    let query = {};
    let projection = { __v: 0 };
    let options = { lean: true, sort: { _id: 1 }, limit: 1 };
    let fetch_data = await DAO.get_data(
      Models.BackupLogs,
      query,
      projection,
      options
    );
    return fetch_data;
  } catch (err) {
    throw err;
  }
};

const fetch_total_backups = async () => {
  try {
    let total_records : any = await DAO.count_data(Models.BackupLogs, {});
    return total_records;
  } catch (err) {
    throw err;
  }
};

const backup_using_cron = async (language: string) => {
  try {
    let total_count = await fetch_total_backups();

    let response: any;
    if (total_count == 10) {
      console.log("case_1");
      let fetch_data: any = await fetch_oldest_backup();
      if (fetch_data.length) {
        let { name } = fetch_data[0];

        // delete old record
        await delete_backup(name);

        // add new record
        response = await backup_case_2(fetch_data[0], language);
        console.log(` response >... `, response);
      }
    } else {
      console.log("case_2");
      response = await backup_case_1(language);
      console.log(`2 backup response >... `, response);
    }

    return response;
  } catch (err) {
    throw err;
  }
};

export { backup_using_cron, delete_backup };
