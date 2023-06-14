import { Request } from 'express';
import * as DAO from '../../DAO';
import * as Models from '../../models';
import moment_days from './moment_days';

class product_graph extends moment_days {

    static async retrive_graph(req: any) {
        try {

            let { type: graph_type } = req.query;
            let { _id: seller_id } = req.user_data;
            let response: any = [];

            if (graph_type == 'DAILY') {
                response = await this.daily_graph(seller_id)
            }
            if (graph_type == 'WEEKLY') {
                response = await this.weekly_graph(seller_id)
            }
            if (graph_type == 'MONTHLY') {
                response = await this.monthly_graph(seller_id)
            }
            if (graph_type == 'YEARLY') {
                response = await this.yearly_graph(seller_id)
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

    static daily_graph = async (seller_id : string) => {
        try {
            let graph_data = [];
            let days: any = await this.retrive_daily_data()
            if (days.length) {
                for (let value of days) {
                    let { hour, start_of_hour, end_of_hour } = value
                    let query: any = {
                        added_by : seller_id,
                        created_at: {
                            $gte: start_of_hour,
                            $lte: end_of_hour
                        }
                    }
                    let users: any = await DAO.count_data(Models.Products, query)
                    if (users > 0) {
                        graph_data.push({
                            hour: hour,
                            start_of_hour:start_of_hour,
                            end_of_hour:end_of_hour,
                            total_products: users
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

    static weekly_graph = async (seller_id : string) => {
        try {
            let graph_data = [];
            let days: any = await this.retrive_weekly_data()
            if (days.length) {
                for (let value of days) {
                    let { day, start_of_day, end_of_day , hour} = value
                    let query: any = {
                        added_by : seller_id,
                        created_at: {
                            $gte: start_of_day,
                            $lte: end_of_day
                        }
                    }
                    let users: any = await DAO.count_data(Models.Products, query)
                    if (users > 0) {
                        graph_data.push({
                          day: day,
                          total_products: users,
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

    static monthly_graph = async (seller_id : string) => {
        try {
            let graph_data = [];
            let days: any = await this.retrive_monthly_data()
            if (days.length) {
                for (let value of days) {
                    let { date, start_of_day, end_of_day } = value
                    let query: any = {
                        added_by : seller_id,
                        created_at: {
                            $gte: start_of_day,
                            $lte: end_of_day
                        }
                    }
                    let users: any = await DAO.count_data(Models.Products, query)
                    if (users > 0) {
                        graph_data.push({
                            date: date,
                            total_products: users
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

    static yearly_graph = async (seller_id : string) => {
        try {
            let graph_data = [];
            let days: any = await this.retrive_yearly_data()
            if (days.length) {
                for (let value of days) {
                    let { month, start_of_month, end_of_month } = value
                    let query: any = {
                        added_by : seller_id,
                        created_at: {
                            $gte: start_of_month,
                            $lte: end_of_month
                        }
                    }
                    let users: any = await DAO.count_data(Models.Products, query)
                    if (users > 0) {
                        graph_data.push({
                            month: month,
                            total_products: users
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

}

export default product_graph