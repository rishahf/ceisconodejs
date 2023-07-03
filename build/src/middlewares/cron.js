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
Object.defineProperty(exports, "__esModule", { value: true });
exports.job = void 0;
var CronJob = require("cron").CronJob;
const order_module_1 = require("../modules/seller/order_module");
// const UserServices = require("../modules/user/user_services");
// import UserServices from "../modules/user/user_services";
// var update_data = new CronJob(
//   "0 0 * * *",
//   async function () {
//     console.log("Rides & Bookings Expired Update Everyday at 12 am");
//     // await UserServices.expiredRides();
//   },
//   null,
//   true,
//   "Asia/Kolkata"
// );
var job = new CronJob("0 11 * * *", function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("You will see this message at 11 am every morning");
        yield order_module_1.order_module.ordersDelivery();
    });
}, null, true, "Asia/Kolkata");
exports.job = job;
