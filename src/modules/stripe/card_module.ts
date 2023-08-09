import axios from 'axios';
import * as DAO from '../../DAO';
import * as Models from '../../models';
import { Request, Response } from 'express';
import { app_constant } from '../../config/index';
import { config } from 'dotenv';
config();
import Stripe from 'stripe';
const STRIPE_KEY = process.env.STRIPE_KEY;
const stripe_options: any = { apiVersion: '2020-08-27' }
const stripe = new Stripe(STRIPE_KEY, stripe_options);

import { helpers } from '../../middlewares/index'

class card_module {

    static generate_token = async (req: Request) => {
        try {
            const paymentMethod = await stripe.paymentMethods.create({
                type: 'card',
                card: {
                    number: '4242424242424242',
                    exp_month: 12,
                    exp_year: 2023,
                    cvc: '314',
                },
            });
            return paymentMethod
        }
        catch (err) {
            throw err;
        }
    }

    static create_card = async (req: any) => {
        try {
            let { payment_method } = req.body;
            let { customer_id } = req.user_data;
            let attach_pm = await stripe.paymentMethods.attach(payment_method, { customer: customer_id });
            console.log("attach_pm...",attach_pm)
            await this.update_customer(payment_method, customer_id);
            return await this.save_card_details(req, attach_pm);
        }
        catch (err) {
            throw err;
        }
    }

    static check_card_exist = async (req: any) => {
        try {
            let { _id } = req.user_data;
            let query = { user_id: _id }
            let projection = { __v: 0 }
            let options = { lean: true }
            let response: any = await DAO.get_data(Models.Cards, query, projection, options)
            return response
        }
        catch (err) {
            throw err;
        }
    }

    // static create_customer = async (req: any) => {
    //     try {
    //         let { name, email } = req.user_data;
    //         let customer_data = {
    //             description: email,
    //             email: email,
    //             name: name,
    //             // source: token,
    //         }
    //         let create_a_customer = await stripe.customers.create(customer_data);
    //         return create_a_customer
    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }

    static update_customer = async (payment_method: string, customer_id: string) => {
        try {
            await stripe.customers.update(
                customer_id,
                {
                    invoice_settings: {
                        default_payment_method: payment_method
                    }
                }
            );
        }
        catch (err) {
            throw err;
        }
    }

    static save_card_details = async (req: any, retrieve_source: any) => {
        try {
            let { payment_method, card_number, card_holder_name, is_saved } = req.body;
            let { _id } = req.user_data;
            let { card : { brand, exp_month, exp_year, last4, fingerprint } } = retrieve_source;
            let card_details: any = {
                user_id: _id,
                payment_method: payment_method,
                brand: brand,
                exp_month: exp_month,
                exp_year: exp_year,
                last4: last4,
                fingerprint: fingerprint,
                is_default: true,
                is_saved:is_saved,
                created_at: +new Date()
            }
            let create_a_card = await DAO.save_data(Models.Cards, card_details)
            return create_a_card
        }
        catch (err) {
            throw err;
        }
    }

    // static update_card_details = async (req: Request, card_details: any) => {
    //     try {
    //         let { payment_method } = req.body, { _id } = card_details;
    //         let query = { _id: _id }
    //         let update = { payment_method: payment_method }
    //         let options = { new: true }
    //         let update_card = await DAO.find_and_update(Models.Cards, query, update, options)
    //         return update_card
    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }

    static retrive_cards = async (req: any) => {
        try {
            let { _id } = req.user_data, { pagination, limit } = req.query;
            let query = { user_id : _id, is_saved:true }
            let projection = { __v : 0 }
            let options = await helpers.set_options(pagination, limit)
            let cards = await DAO.get_data(Models.Cards, query, projection, options)
            let total_count = await DAO.count_data(Models.Cards, query)
            return {
                total_count : total_count,
                data : cards
            }
        }
        catch (err) {
            throw err;
        }
    }

    static deleteCard = async (req:any) =>{
        try{
            let { _id:user_id } = req.user_data, {_id} = req.params;
            console.log(req.params);
            
            // const deleted = await stripe.customers.deleteSource(
            //     'cus_9BoKyB2Km2T7TE', //custmor_id
            //     'card_1M6Vta2eZvKYlo2CBV1QJK3b' //cardid
            // );
            let  query:any = { _id:_id,user_id:user_id }, data:any ;
            console.log('query ', query);
            
            let response:any = await DAO.remove_many(Models.Cards,query)
            if (response.deletedCount > 0) {
                data = `Card deleted successfully...`
            }
            return data
        }catch (err) {
            throw err;
        }
    }



}

export default card_module;