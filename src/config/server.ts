import cors from "cors";
import express from "express";
import { config } from "dotenv";
config();
import http from "http";
import fs from "fs";
import https from "https";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import { connect_to_db, bootstrap_data } from "./index";
import admin_routes from "../modules/admin/admin_routes";
import user_routes from "../modules/user/user_routes";
import upload_routes from "../modules/uploads/upload_routes";
import seller_routes from "../modules/seller/seller_routes";
import product_routes from "../modules/product/product_routes";
import chat_routes from "../modules/chat/chat_routes";
import stripe_routes from '../modules/stripe/routes';
import homepage_routes from '../modules/homepage/routes';
import order_routes from '../modules/orders/routes';
import moment from "moment";
import swagger_ui from "swagger-ui-express";
import openapi_docs from "../../output.openapi.json";
import connect_socket from '../modules/chat/socket'
import {job  }from "../middlewares/cron";
import path from "path";

let shipped_date: any = moment(parseInt("1674474588830")).utc().format("ddd, MMM DD, YYYY HH:mm");
console.log('shiiippppeddd ', shipped_date)
const app = express();
const env = process.env.ENVIRONMENT;
const PORT = env == 'LOCAL' ? process.env.LOCAL_PORT : process.env.PROD_PORT;

job.start();
// job2.start();

app.use(cors({ origin: "*" }));
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req: any, res: any) => { res.send("Hello World!"); });
app.use("/Admin", admin_routes);
app.use("/Product", product_routes);
app.use("/User", user_routes);
app.use("/Seller", seller_routes);
app.use("/Upload", upload_routes);
app.use("/Chat", chat_routes);
app.use("/Stripe", stripe_routes);
app.use("/Homepage", homepage_routes);
app.use("/Order", order_routes);

// view engine setup
app.set("view engine", "hbs");
app.set("views",path.join(__dirname,'../../public/views'))

// const tomorrow = moment("2023-01-05").add(2, "day").format("DD MM YYYY");
// console.log('tommm --- ', tomorrow)

// make swagger documentation
let swagger_options = { customSiteTitle: "Shared Ecommerce Api Documentation" };
app.use("/docs", swagger_ui.serve, swagger_ui.setup(openapi_docs, swagger_options));
app.use(express.static(path.join(__dirname, "public")));
let server: any;

if (process.env.SSL == "true") {
  let key = fs.readFileSync(process.env.SSL_PRIV_KEY);
  let cert = fs.readFileSync(process.env.SSL_CERT);
  let options: any = { key: key, cert: cert }
  server = https.createServer(options, app);
  server.listen(PORT, () => { console.log(`Server running at port ${PORT}...`) })
}
else {
  server = http.createServer(app);
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

connect_to_db();
bootstrap_data();


// connect socket
connect_socket(server);