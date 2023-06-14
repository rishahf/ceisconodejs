var CronJob = require("cron").CronJob;
import { order_module } from "../modules/seller/order_module";

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

var job = new CronJob("0 11 * * *",
  async function () {
    console.log("You will see this message at 11 am every morning");
    await order_module.ordersDelivery();
  },
  null,
  true,
  "Asia/Kolkata"
);
// var job2 = new CronJob("* * * * * *",function () {
//     console.log("You will see this message every second ");
//   },
//   null,
//   true,
//   "Asia/Kolkata"
// );



// every mid-night at 12 "0 0 * * *"
// every 1 hour "0 * * * *"
// for  afternoon 0 12 * * *
// for mid night at 00:00:00 time '0 0 * * *'
// for evry 10 sec '*/10 * * * * *'
// after every 5minutes '*/5 * * * *'
// everyday at 11 am '0 11 * * *'
export { job };
