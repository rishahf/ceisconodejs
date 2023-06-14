import * as DAO from "../../DAO";
import * as express from "express";
import * as Models from "../../models";
import * as user_services from "./user_services";
import * as user_helper from "./user_helper";
import * as email_services from "./email_services";
import { handle_success, handle_catch, handle_custom_error, helpers } from "../../middlewares/index";
import  Mongoose from "mongoose";
import { common_module }  from '../../middlewares/common';
import { send_notification_to_all } from "../../middlewares/index";

class add_review_module {

    static can_add_review = async(req: any) => {
        try {
            
            let { product_id } = req.query, { _id: user_id } = req.user_data;
            let query = {
              product_id: Mongoose.Types.ObjectId(product_id),
              user_id: Mongoose.Types.ObjectId(user_id),
              order_status: "DELIVERED",
            };
            console.log('query can add review ', query);
            
            let projection = { __v: 0 }
            let options = { lean: true }
            let response: any = await DAO.get_data(Models.OrderProducts, query, projection, options)
            console.log('can add ', response);
            
            if(response.length) {
                let retrive_data : any = await this.check_review_added(product_id, user_id)
                let can_review = retrive_data.length > 0 ? false : true
                return {
                    can_review : can_review
                }
            }
            else {
                let can_review = false
                return {
                    can_review : can_review
                }
            }

        }
        catch(err) {
            throw err;
        }
    }


    static add_review = async (req: any) => {
        try {

            let { product_id, title, description, ratings, images, order_product_id,order_id,language } = req.body;
            let { _id: user_id } = req.user_data;
            let product_info = await this.retrive_product_info(product_id)
            if(product_info.length) {
                let purchased_product:any = await this.check_product_purchased(product_id, user_id)
                if(purchased_product == null && undefined){
                    console.log("is purchased_product ", purchased_product);
                    throw 'You cannot add review'
                    // throw await handle_custom_error("YOU_CANNOT_ADD_REVIEW","ENGLISH")
                }
                let retrive_data : any = await this.check_review_added(product_id, user_id)
                if(retrive_data.length) {
                    throw await handle_custom_error("REVIEW_ALREADY_ADDED","ENGLISH")
                }
                else {
                    let { added_by } = product_info[0];
                    let data_to_save: any = {
                      user_id: user_id,
                      product_id: product_id,
                      seller_id: added_by,
                      // order_product_id:order_product_id,
                      title: title,
                      description: description,
                      ratings: ratings,
                      images: images,
                      language: language,
                      updated_at: +new Date(),
                      created_at: +new Date(),
                    };
                    if(order_product_id){
                        data_to_save.order_product_id = order_product_id
                    }
                    if (order_id) {
                      data_to_save.order_id = order_id;
                    }
                    let response = await DAO.save_data(Models.Reviews, data_to_save);
                    await this.update_count_in_product(product_id, ratings)

                    let projection = { __v:0 }
                    let options = { lean: true }
                    //email to seller 
                    let seller_detail = await DAO.get_data(Models.Sellers,{_id:added_by},projection,options)

                    //notification to seller
                    let seller_fcm_ids:any = await common_module.seller_fcms(added_by)
                    if (seller_fcm_ids && seller_fcm_ids.length) {
                        let notification_to_seller: any = {
                          type: "NEW_REVIEW",
                          title: "New Review",
                          message: "A new Review has been added on product.",
                          seller_id: added_by,
                        //   orderProduct_id: _id,
                          product_id:product_id,
                          created_at:+new Date(),
                        };
                        await DAO.save_data(Models.Notifications,notification_to_seller)
                        await send_notification_to_all(notification_to_seller,seller_fcm_ids);
                    }

                    return response
                }
            }
            else {
                throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLSIH")
            }
        }
        catch (err) {
            throw err;
        }
    }

    static retrive_product_info = async (product_id: string) => {
        try {
            let query = { _id: product_id }
            let projection = { __v: 0 }
            let options = { lean: true }
            let retrive_product: any = await DAO.get_data(Models.Products, query, projection, options)
            return retrive_product
        }
        catch (err) {
            throw err;
        }
    }

    static check_review_added = async (product_id: string, user_id : string) => {
        try {
            let query = { user_id: user_id, product_id: product_id };
            let projection = { __v: 0 }
            let options = { lean: true }
            let retrive_product: any = await DAO.get_data(Models.Products, query, projection, options)
            return retrive_product
        }
        catch (err) {
            throw err;
        }
    }

    static check_product_purchased = async (product_id: string, user_id : string) => {
        try {
            let query = { user_id: user_id, product_id : product_id, order_status:'DELIVERED' }
            let projection = { __v: 0 }
            let options = { lean: true }
            let retrive_product: any = await DAO.get_data(Models.OrderProducts, query, projection, options)
            return retrive_product
        }
        catch (err) {
            throw err;
        }
    }

    static update_count_in_product = async (product_id: string, ratings: number) => {
        try {

            let product_info = await this.retrive_product_info(product_id)
            if (product_info.length > 0) {
                let { total_reviews, total_ratings } = product_info[0];
                let cal_reviews = Number(total_reviews) + 1;
                let cal_ratings = Number(total_ratings) + Number(ratings);
                let average_ratings = Number(cal_ratings) / Number(cal_reviews);
                let fixed_ratings = Number(cal_ratings.toFixed(1));
                let fixed_avg_ratings = Number(average_ratings.toFixed(1));

                let query = { _id: product_id }
                let update: any = {
                    total_reviews: cal_reviews,
                    total_ratings: fixed_ratings,
                    average_rating: fixed_avg_ratings
                }
                if (ratings == 1 || ratings > 1 && ratings < 2) {
                    update.$inc = {
                        one_star_ratings: 1
                    }
                }
                else if (ratings == 2 || ratings > 2 && ratings < 3) {
                    update.$inc = {
                        two_star_ratings: 1
                    }
                }
                else if (ratings == 3 || ratings > 3 && ratings < 4) {
                    update.$inc = {
                        three_star_ratings: 1
                    }
                }
                else if (ratings == 4 || ratings > 4 && ratings < 5) {
                    update.$inc = {
                        four_star_ratings: 1
                    }
                }
                else if (ratings == 5) {
                    update.$inc = {
                        five_star_ratings: 1
                    }
                }
                let options = { new: true }
                await DAO.find_and_update(Models.Products, query, update, options)
            }
        }
        catch (err) {
            throw err;
        }
    }

}


class edit_review_module {

    static edit_review = async (req: any) => {
        try {

            let { _id, title, description, ratings, images } = req.body;
            let { _id: user_id } = req.user_data;

            let retrive_ratings = await this.retrive_old_ratings(_id)
            if (retrive_ratings.length > 0) {

                let { ratings: old_ratings } = retrive_ratings[0]

                let query = { _id: _id, user_id: user_id }
                let update: any = { updated_at: +new Date()}
                if (!!title) { update.title = title }
                if (!!description) { update.description = description }
                if (!!ratings) { update.ratings = ratings }
                if (!!images) { update.images = images }

                let options = { new: true }
                let response: any = await DAO.find_and_update(Models.Reviews, query, update, options)
                let { product_id } = response
                await this.update_ratings_in_product(product_id, ratings)
                await this.update_old_ratings_in_product(product_id, old_ratings)
                return response

            }
        }
        catch (err) {
            throw err;
        }
    }

    static retrive_old_ratings = async (_id: string) => {
        try {
            let query = { _id: _id }
            let projection = { __v: 0 }
            let options = { lean: true }
            let review: any = await DAO.get_data(Models.Reviews, query, projection, options)
            return review
        }
        catch (err) {
            throw err;
        }
    }

    static retrive_product_info = async (product_id: string) => {
        try {
            let query = { _id: product_id }
            let projection = { __v: 0 }
            let options = { lean: true }
            let retrive_product: any = await DAO.get_data(Models.Products, query, projection, options)
            return retrive_product
        }
        catch (err) {
            throw err;
        }
    }

    static cal_total_ratings = async (product_id: string) => {
        try {
            let query = { product_id: product_id }
            let projection = { __v: 0 }
            let options = { lean: true }
            let reviews: any = await DAO.get_data(Models.Reviews, query, projection, options)
            let total_ratings = 0;
            if (reviews.length) {
                for (let i = 0; i < reviews.length; i++) {
                    total_ratings += reviews[i].ratings
                }
            }
            return total_ratings
        }
        catch (err) {
            throw err;
        }
    }

    static update_ratings_in_product = async (product_id: string, ratings: number) => {
        try {

            let product_info = await this.retrive_product_info(product_id)
            let total_ratings = await this.cal_total_ratings(product_id)
            if (product_info.length > 0) {

                let { total_reviews } = product_info[0];
                let average_ratings = Number(total_ratings) / Number(total_reviews);
                let fixed_ratings = Number(total_ratings.toFixed(1));
                let fixed_avg_ratings = Number(average_ratings.toFixed(1));

                let query = { _id: product_id }
                let update: any = {
                    total_ratings: fixed_ratings,
                    average_rating: fixed_avg_ratings
                }

                if (ratings == 1 || ratings > 1 && ratings < 2) {
                    update.$inc = {
                        one_star_ratings: 1
                    }
                }
                if (ratings == 2 || ratings > 2 && ratings < 3) {
                    update.$inc = {
                        two_star_ratings: 1
                    }
                }
                if (ratings == 3 || ratings > 3 && ratings < 4) {
                    update.$inc = {
                        three_star_ratings: 1
                    }
                }
                if (ratings == 4 || ratings > 4 && ratings < 5) {
                    update.$inc = {
                        four_star_ratings: 1
                    }
                }
                if (ratings == 5) {
                    update.$inc = {
                        five_star_ratings: 1
                    }
                }

                let options = { new: true }
                await DAO.find_and_update(Models.Products, query, update, options)
            }
        }
        catch (err) {
            throw err;
        }
    }

    static update_old_ratings_in_product = async (product_id: string, old_ratings: number) => {
        try {

            let query = { _id: product_id }
            let update: any = {}
            if (old_ratings == 1 || old_ratings > 1 && old_ratings < 2) {
                update.$inc = {
                    one_star_ratings: -1
                }
            }
            if (old_ratings == 2 || old_ratings > 2 && old_ratings < 3) {
                update.$inc = {
                    two_star_ratings: -1
                }
            }
            if (old_ratings == 3 || old_ratings > 3 && old_ratings < 4) {
                update.$inc = {
                    three_star_ratings: -1
                }
            }
            if (old_ratings == 4 || old_ratings > 4 && old_ratings < 5) {
                update.$inc = {
                    four_star_ratings: -1
                }
            }
            if (old_ratings == 5) {
                update.$inc = {
                    five_star_ratings: -1
                }
            }
            let options = { new: true }
            await DAO.find_and_update(Models.Products, query, update, options)

        }
        catch (err) {
            throw err;
        }
    }

}


class list_review_module {

    static list_reviews = async (req: any) => {
        try {

            let { _id, product_id, pagination, limit } = req.query;

            let query: any = {}
            if (!!_id) { query._id = _id }
            if (!!product_id) { query.product_id = product_id }

            let projection = { __v: 0 }
            let options = await helpers.set_options(pagination, limit)
            let populate = [
                {
                    path: 'product_id',
                    select: 'name images discount_price average_rating'
                }
            ]
            let reviews: any = await DAO.populate_data(Models.Reviews, query, projection, options, populate)
            let total_count = await DAO.count_data(Models.Reviews, query)
            return {
                total_count: total_count,
                data: reviews
            }
        }
        catch (err) {
            throw err;
        }
    }

    static list_my_reviews = async (req: any) => {
        try {

            let { _id, product_id, pagination, limit } = req.query;
            let { _id: user_id } = req.user_data

            let query: any = { user_id: user_id }
            if (!!_id) { query._id = _id }
            if (!!product_id) { query.product_id = product_id }

            let projection = { __v: 0 }
            let options = await helpers.set_options(pagination, limit)
            let populate = [
                {
                    path: 'product_id',
                    select: 'name images discount_price average_rating'
                }
            ]
            let reviews: any = await DAO.populate_data(Models.Reviews, query, projection, options, populate)
            let total_count = await DAO.count_data(Models.Reviews, query)
            return {
                total_count: total_count,
                data: reviews
            }

        }
        catch (err) {
            throw err;
        }
    }

    static my_review_details = async (req: any) => {
        try {

            let { _id } = req.params;
            let { _id: user_id } = req.user_data;

            let query: any = { _id : _id, user_id: user_id }
            let projection = { __v: 0 }
            let options = { lean : true }
            let populate = [
                {
                    path: 'product_id',
                    select: 'name images discount_price average_rating'
                }
            ]
            let reviews: any = await DAO.populate_data(Models.Reviews, query, projection, options, populate)
            if(reviews.length) {
                return reviews[0]
            }
            else {
                throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH")
            }

        }
        catch (err) {
            throw err;
        }
    }

}



export {
    add_review_module,
    edit_review_module,
    list_review_module
}