"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const index_1 = require("./index");
const admin_routes_1 = __importDefault(require("../modules/admin/admin_routes"));
const user_routes_1 = __importDefault(require("../modules/user/user_routes"));
const upload_routes_1 = __importDefault(require("../modules/uploads/upload_routes"));
const seller_routes_1 = __importDefault(require("../modules/seller/seller_routes"));
const product_routes_1 = __importDefault(require("../modules/product/product_routes"));
const chat_routes_1 = __importDefault(require("../modules/chat/chat_routes"));
const routes_1 = __importDefault(require("../modules/stripe/routes"));
const routes_2 = __importDefault(require("../modules/homepage/routes"));
const routes_3 = __importDefault(require("../modules/orders/routes"));
const moment_1 = __importDefault(require("moment"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const output_openapi_json_1 = __importDefault(require("../../output.openapi.json"));
const socket_1 = __importDefault(require("../modules/chat/socket"));
const cron_1 = require("../middlewares/cron");
const path_1 = __importDefault(require("path"));
let shipped_date = (0, moment_1.default)(parseInt("1674474588830")).utc().format("ddd, MMM DD, YYYY HH:mm");
console.log('shiiippppeddd ', shipped_date);
const app = (0, express_1.default)();
const env = process.env.ENVIRONMENT;
const PORT = env == 'LOCAL' ? process.env.LOCAL_PORT : process.env.PROD_PORT;
cron_1.job.start();
// job2.start();
app.use((0, cors_1.default)({ origin: "*" }));
app.use((0, express_fileupload_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.get("/", (req, res) => { res.send("Hello World!"); });
app.use("/Admin", admin_routes_1.default);
app.use("/Product", product_routes_1.default);
app.use("/User", user_routes_1.default);
app.use("/Seller", seller_routes_1.default);
app.use("/Upload", upload_routes_1.default);
app.use("/Chat", chat_routes_1.default);
app.use("/Stripe", routes_1.default);
app.use("/Homepage", routes_2.default);
app.use("/Order", routes_3.default);
// view engine setup
app.set("view engine", "hbs");
app.set("views", path_1.default.join(__dirname, '../../public/views'));
// const tomorrow = moment("2023-01-05").add(2, "day").format("DD MM YYYY");
// console.log('tommm --- ', tomorrow)
// make swagger documentation
let swagger_options = { customSiteTitle: "Shared Ecommerce Api Documentation" };
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(output_openapi_json_1.default, swagger_options));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
let server;
if (process.env.SSL == "true") {
    let key = fs_1.default.readFileSync(process.env.SSL_PRIV_KEY);
    let cert = fs_1.default.readFileSync(process.env.SSL_CERT);
    let options = { key: key, cert: cert };
    server = https_1.default.createServer(options, app);
    server.listen(PORT, () => { console.log(`Server running at port ${PORT}...`); });
}
else {
    server = http_1.default.createServer(app);
    server.listen(PORT, () => { console.log(`Server running at port at ${PORT}...`); });
}
// function onError(error: any) {
//   if (error.syscall !== "listen") {
//     throw error;
//   }
//   var bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;
//   // handle specific listen errors with friendly messages
//   switch (error.code) {
//     case "EACCES":
//       console.error(bind + " requires elevated privileges");
//       process.exit(1);
//       break;
//     case "EADDRINUSE":
//       console.error(bind + " is already in use");
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// }
// function onListening() {
//   var addr = server.address();
//   var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
//   console.log('bind ', bind)
// }
// server.on("error", onError);
// server.on("listening", onListening);
// console.log(`port running ${PORT}`);
// server.listen(port);
(0, index_1.connect_to_db)();
(0, index_1.bootstrap_data)();
// connect socket
(0, socket_1.default)(server);
