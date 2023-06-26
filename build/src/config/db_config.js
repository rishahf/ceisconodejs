"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const env = process.env.ENVIRONMENT;
let server_port = process.env.LOCAL_PORT;
if (env == 'PROD') {
    server_port = process.env.PROD_PORT;
}
const database = process.env.DATABASE;
const db_host = process.env.DB_HOST;
const db_port = process.env.DB_PORT;
const db_name = process.env.DB_NAME;
const db_config = {
    PORT: server_port,
    URI: `${database}://${db_host}:${db_port}/${db_name}`
};
exports.default = db_config;
