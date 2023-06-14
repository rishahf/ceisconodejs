import { Request } from 'express';
import * as DAO from '../../DAO';
import * as Models from '../../models';
import moment_days from './moment_days';

class user_graph extends moment_days {

    static async retrive_graph(req: Request) {
        try {

            let { type : graph_type } = req.query, response: any = [];
            if (graph_type == 'DAILY') {
                response = await this.daily_graph()
            }
            if (graph_type == 'WEEKLY') {
                response = await this.weekly_graph()
            }
            if (graph_type == 'MONTHLY') {
                response = await this.monthly_graph()
            }
            if (graph_type == 'YEARLY') {
                response = await this.yearly_graph()
            }
            return {
                total_count: response.length,
                data: response
            }

        }
        catch (err) {
            throw err;
        }
    }

    static daily_graph = async () => {
        try {
            let graph_data = [];
            let days: any = await this.retrive_daily_data()
            if (days.length) {
                for (let value of days) {
                    let { hour, start_of_hour, end_of_hour } = value
                    let query: any = {
                        created_at: {
                            $gte: start_of_hour,
                            $lte: end_of_hour
                        }
                    }
                    let users: any = await DAO.count_data(Models.Users, query)
                    if (users > 0) {
                        graph_data.push({
                            hour: hour,
                            total_users: users
                        })
                    }
                }
            }
            return graph_data
        }
        catch (err) {
            throw err;
        }
    }

    static weekly_graph = async () => {
        try {
            let graph_data = [];
            let days: any = await this.retrive_weekly_data()
            if (days.length) {
                for (let value of days) {
                    let { day, start_of_day, end_of_day } = value
                    let query: any = {
                        created_at: {
                            $gte: start_of_day,
                            $lte: end_of_day
                        }
                    }
                    let users: any = await DAO.count_data(Models.Users, query)
                    if (users > 0) {
                        graph_data.push({
                            day: day,
                            total_users: users
                        })
                    }
                }
            }
            return graph_data
        }
        catch (err) {
            throw err;
        }
    }

    static monthly_graph = async () => {
        try {
            let graph_data = [];
            let days: any = await this.retrive_monthly_data()
            if (days.length) {
                for (let value of days) {
                    let { date, start_of_day, end_of_day } = value
                    let query: any = {
                        created_at: {
                            $gte: start_of_day,
                            $lte: end_of_day
                        }
                    }
                    let users: any = await DAO.count_data(Models.Users, query)
                    if (users > 0) {
                        graph_data.push({
                            date: date,
                            total_users: users
                        })
                    }
                }
            }
            return graph_data
        }
        catch (err) {
            throw err;
        }
    }

    static yearly_graph = async () => {
        try {
            let graph_data = [];
            let days: any = await this.retrive_yearly_data()
            if (days.length) {
                for (let value of days) {
                    let { month, start_of_month, end_of_month } = value
                    let query: any = {
                        created_at: {
                            $gte: start_of_month,
                            $lte: end_of_month
                        }
                    }
                    let users: any = await DAO.count_data(Models.Users, query)
                    if (users > 0) {
                        graph_data.push({
                          month: month,
                          total_users: users,
                        });
                    }
                }
            }
            return graph_data
        }
        catch (err) {
            throw err;
        }
    }

    // static last_7_days_graph = async (req: Request) => {
    //     try {
    //         let { _id: nft_id } = req.params, graph_data = [];
    //         let days: any = await this.retrive_last_7_days()
    //         if (days.length) {
    //             for (let value of days) {
    //                 let { day, start_of_day, end_of_day } = value
    //                 let query: any = {
    //                     created_at: {
    //                         $gte: start_of_day,
    //                         $lte: end_of_day
    //                     }
    //                 }
    //                 if (!!nft_id) { query.nft_id = nft_id }
    //                 let projection = { __v: 0 }
    //                 let options = { lean: true, sort: { _id: -1 }, limit: 1 }
    //                 let PurchaseLogs: any = await DAO.get_data(Models.PurchaseLogs, query, projection, options)
    //                 if (PurchaseLogs.length) {
    //                     PurchaseLogs.forEach((value: any, index: any) => {
    //                         let { created_at, price } = value
    //                         graph_data.push({
    //                             date: day,
    //                             price: price
    //                         })
    //                     });
    //                 }
    //             }
    //         }
    //         return graph_data
    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }

    // static last_14_days_graph = async (req: Request) => {
    //     try {
    //         let { _id: nft_id } = req.params, graph_data = []
    //         let days: any = await this.retrive_last_14_days()
    //         if (days.length) {
    //             for (let value of days) {
    //                 let { day, start_of_day, end_of_day } = value
    //                 let query: any = {
    //                     created_at: {
    //                         $gte: start_of_day,
    //                         $lte: end_of_day
    //                     }
    //                 }
    //                 if (!!nft_id) { query.nft_id = nft_id }
    //                 let projection = { __v: 0 }
    //                 let options = { lean: true, sort: { _id: -1 }, limit: 1 }
    //                 let PurchaseLogs: any = await DAO.get_data(Models.PurchaseLogs, query, projection, options)
    //                 if (PurchaseLogs.length) {
    //                     PurchaseLogs.forEach((value: any, index: any) => {
    //                         let { created_at, price } = value
    //                         graph_data.push({
    //                             date: day,
    //                             price: price
    //                         })
    //                     });
    //                 }
    //             }
    //         }
    //         return graph_data
    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }

    // static last_30_days_graph = async (req: Request) => {
    //     try {
    //         let { _id: nft_id } = req.params, graph_data = []
    //         let days: any = await this.retrive_last_30_days()
    //         if (days.length) {
    //             for (let value of days) {
    //                 let { date, start_of_day, end_of_day } = value
    //                 let query: any = {
    //                     created_at: {
    //                         $gte: start_of_day,
    //                         $lte: end_of_day
    //                     }
    //                 }
    //                 if (!!nft_id) { query.nft_id = nft_id }
    //                 let projection = { __v: 0 }
    //                 let options = { lean: true, sort: { _id: -1 }, limit: 1 }
    //                 let PurchaseLogs: any = await DAO.get_data(Models.PurchaseLogs, query, projection, options)
    //                 if (PurchaseLogs.length) {
    //                     PurchaseLogs.forEach((value: any, index: any) => {
    //                         let { created_at, price } = value
    //                         graph_data.push({
    //                             date: date,
    //                             // date_in_string: full_date,
    //                             price: price
    //                         })
    //                     });
    //                 }
    //             }
    //         }
    //         return graph_data
    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }

    // static last_60_days_graph = async (req: Request) => {
    //     try {
    //         let { _id: nft_id } = req.params, graph_data = []
    //         let days: any = await this.retrive_last_60_days()
    //         if (days.length) {
    //             for (let value of days) {
    //                 let { date, start_of_day, end_of_day } = value
    //                 let query: any = {
    //                     created_at: {
    //                         $gte: start_of_day,
    //                         $lte: end_of_day
    //                     }
    //                 }
    //                 if (!!nft_id) { query.nft_id = nft_id }
    //                 let projection = { __v: 0 }
    //                 let options = { lean: true, sort: { _id: -1 }, limit: 1 }
    //                 let PurchaseLogs: any = await DAO.get_data(Models.PurchaseLogs, query, projection, options)
    //                 if (PurchaseLogs.length) {
    //                     PurchaseLogs.forEach((value: any, index: any) => {
    //                         let { created_at, price } = value
    //                         graph_data.push({
    //                             date: date,
    //                             // date_in_string: full_date,
    //                             price: price
    //                         })
    //                     });
    //                 }
    //             }
    //         }
    //         return graph_data
    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }

    // static last_90_days_graph = async (req: Request) => {
    //     try {
    //         let { _id: nft_id } = req.params, graph_data = []
    //         let days: any = await this.retrive_last_90_days()
    //         if (days.length) {
    //             for (let value of days) {
    //                 let { date, start_of_day, end_of_day } = value
    //                 let query: any = {
    //                     created_at: {
    //                         $gte: start_of_day,
    //                         $lte: end_of_day
    //                     }
    //                 }
    //                 if (!!nft_id) { query.nft_id = nft_id }
    //                 let projection = { __v: 0 }
    //                 let options = { lean: true, sort: { _id: -1 }, limit: 1 }
    //                 let PurchaseLogs: any = await DAO.get_data(Models.PurchaseLogs, query, projection, options)
    //                 if (PurchaseLogs.length) {
    //                     PurchaseLogs.forEach((value: any, index: any) => {
    //                         let { created_at, price } = value
    //                         graph_data.push({
    //                             date: date,
    //                             // date_in_string: full_date,
    //                             price: price
    //                         })
    //                     });
    //                 }
    //             }
    //         }
    //         return graph_data
    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }

    // static last_year_graph = async (req: Request) => {
    //     try {
    //         let { _id: nft_id } = req.params, graph_data = []
    //         let days: any = await this.retrive_last_year()
    //         if (days.length) {
    //             for (let value of days) {
    //                 let { month, start_of_month, end_of_month } = value
    //                 let query: any = {
    //                     created_at: {
    //                         $gte: start_of_month,
    //                         $lte: end_of_month
    //                     }
    //                 }
    //                 if (!!nft_id) { query.nft_id = nft_id }
    //                 let projection = { __v: 0 }
    //                 let options = { lean: true, sort: { _id: -1 }, limit: 1 }
    //                 let PurchaseLogs: any = await DAO.get_data(Models.PurchaseLogs, query, projection, options)
    //                 if (PurchaseLogs.length) {
    //                     PurchaseLogs.forEach((value: any, index: any) => {
    //                         let { created_at, price } = value
    //                         graph_data.push({
    //                             date: month,
    //                             // date_in_string: full_date,
    //                             price: price
    //                         })
    //                     });
    //                 }
    //             }
    //         }
    //         return graph_data
    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }

    // // static all_time_graph = async (req: Request) => {
    // //     try {
    // //         let { _id: nft_id } = req.params, graph_data = []
    // //         let query: any = {}
    // //         if (!!nft_id) { query.nft_id = nft_id }
    // //         let projection = { __v: 0 }
    // //         let options = { lean: true, sort: { _id: -1 }, limit : 1 }
    // //         let PurchaseLogs: any = await DAO.get_data(Models.PurchaseLogs, query, projection, options)
    // //         if (PurchaseLogs.length) {
    // //             PurchaseLogs.forEach((value: any, index: any) => {
    // //                 let { created_at, price } = value
    // //                 let date = Moment.utc(created_at, "x").format('DD MMM');
    // //                 graph_data.push({
    // //                     date: date,
    // //                     price: price
    // //                 })
    // //             });
    // //         }
    // //         return graph_data
    // //     }
    // //     catch (err) {
    // //         throw err;
    // //     }
    // // }


    // static all_time_graph = async (req: Request) => {
    //     try {

    //         let start_date = await this.retrive_start_date()
    //         let end_date = await this.retrive_end_date()

    //         // console.log("start_date...",start_date)
    //         // console.log("end_date...",end_date)

    //         let { _id: nft_id } = req.params, graph_data = []
    //         let days: any = await this.retrive_all_time_days(start_date, end_date)
    //         // console.log("days...",days)
    //         if (days.length) {
    //             for (let value of days) {
    //                 let { date, start_of_day, end_of_day } = value
    //                 let query: any = {
    //                     // nft_id: nft_id,
    //                     created_at: {
    //                         $gte: start_of_day,
    //                         $lte: end_of_day
    //                     }
    //                 }
    //                 if (!!nft_id) { query.nft_id = nft_id }
    //                 let projection = { __v: 0 }
    //                 let options = { lean: true, sort: { _id: -1 }, limit: 1 }
    //                 let PurchaseLogs: any = await DAO.get_data(Models.PurchaseLogs, query, projection, options)
    //                 if (PurchaseLogs.length) {
    //                     PurchaseLogs.forEach((value: any, index: any) => {
    //                         let { created_at, price } = value
    //                         graph_data.push({
    //                             date: date,
    //                             // date_in_string: full_date,
    //                             price: price
    //                         })
    //                     });
    //                 }
    //             }
    //         }
    //         return graph_data
    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }

    // static retrive_start_date = async () => {
    //     try {
    //         let query = {}
    //         let projection = { created_at: 1 }
    //         let options = { lean: true, sort: { _id: 1 }, limit: 1 }
    //         let PurchaseLogs: any = await DAO.get_data(Models.PurchaseLogs, query, projection, options)
    //         let start_date = PurchaseLogs.length > 0 ? PurchaseLogs[0].created_at : null;
    //         return start_date
    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }

    // static retrive_end_date = async () => {
    //     try {
    //         let query = {}
    //         let projection = { created_at: 1 }
    //         let options = { lean: true, sort: { _id: -1 }, limit: 1 }
    //         let PurchaseLogs: any = await DAO.get_data(Models.PurchaseLogs, query, projection, options)
    //         let end_date = PurchaseLogs.length > 0 ? PurchaseLogs[0].created_at : null;
    //         return end_date
    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }


}

export default user_graph