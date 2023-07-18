import * as DAO from "../../DAO";
import * as express from "express";
import * as Models from "../../models";
import * as product_services from "./product_services";
import * as product_helper from "./product_helper";
import * as search_products from './search_products';
import * as filter_products from './filter_products';
import product_module from './product_module'
import {
    handle_success,
    handle_catch,
    handle_custom_error,
    helpers,
} from "../../middlewares/index";


const list_products = async (req: any, res: express.Response) => {
    try {

        let query = [
            await search_products.remove_deleted(),
            await search_products.lookup_brands(),
            await search_products.unwind_brands(),
            await search_products.lookup_categories(),
            await search_products.unwind_categories(),
            await search_products.lookup_subcategories(),
            await search_products.unwind_subcategories(),
            await search_products.lookup_sub_subcategories(),
            await search_products.unwind_sub_subcategories(),
            await search_products.lookup_seller(),
            await search_products.unwind_seller(),
            await search_products.filter_data(req.query),
            await search_products.group_data(),
            await search_products.sort_data(),
            await search_products.skip_data(req.query),
            await search_products.limit_data(req.query)
        ]
        let options = { lean: true }
        let Products: any = await DAO.aggregate_data(Models.Products, query, options);

        let count_query = [
            await search_products.remove_deleted(),
            await search_products.lookup_brands(),
            await search_products.unwind_brands(),
            await search_products.lookup_categories(),
            await search_products.unwind_categories(),
            await search_products.lookup_subcategories(),
            await search_products.unwind_subcategories(),
            await search_products.lookup_sub_subcategories(),
            await search_products.unwind_sub_subcategories(),
            await search_products.lookup_seller(),
            await search_products.unwind_seller(),
            await search_products.filter_data(req.query),
            await search_products.group_data(),
            await search_products.sort_data()
        ]
        let Count_Products: any = await DAO.aggregate_data(Models.Products, count_query, options);
        let response = {
            total_count: Count_Products.length,
            data: Products
        };
        handle_success(res, response);

    }
    catch (err) {
        handle_catch(res, err);
    }
}

const list_related_products = async (req: any, res: express.Response) => {
    try {

        let { product_id } = req.query;
        let product_data = await retrive_product_data(product_id)
        let { subcategory_id } = product_data

        let query = [
            await search_products.match(product_id, subcategory_id),
            await search_products.lookup_brands(),
            await search_products.unwind_brands(),
            await search_products.lookup_categories(),
            await search_products.unwind_categories(),
            await search_products.lookup_subcategories(),
            await search_products.unwind_subcategories(),
            await search_products.lookup_sub_subcategories(),
            await search_products.unwind_sub_subcategories(),
            await search_products.lookup_seller(),
            await search_products.unwind_seller(),
            // await search_products.filter_data(req.query),
            await search_products.group_data(),
            await search_products.sort_data(),
            await search_products.skip_data(req.query),
            await search_products.limit_data(req.query)
        ]
        let options = { lean: true }
        let Products: any = await DAO.aggregate_data(Models.Products, query, options);

        let count_query = [
            await search_products.match(product_id, subcategory_id),
            await search_products.lookup_brands(),
            await search_products.unwind_brands(),
            await search_products.lookup_categories(),
            await search_products.unwind_categories(),
            await search_products.lookup_subcategories(),
            await search_products.unwind_subcategories(),
            await search_products.lookup_sub_subcategories(),
            await search_products.unwind_sub_subcategories(),
            await search_products.lookup_seller(),
            await search_products.unwind_seller(),
            // await search_products.filter_data(req.query),
            await search_products.group_data(),
            await search_products.sort_data()
        ]
        let Count_Products: any = await DAO.aggregate_data(Models.Products, count_query, options);
        let response = {
            total_count: Count_Products.length,
            data: Products
        };
        handle_success(res, response);

    }
    catch (err) {
        handle_catch(res, err);
    }
}

const retrive_product_data = async (product_id: string) => {
    try {

        let query = { _id: product_id }
        let projection = { __v: 0 }
        let options = { lean: true }
        let response: any = await DAO.get_data(Models.Products, query, projection, options)
        if (response.length) {
            return response[0]
        }
        else {
            throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH")
        }

    }
    catch (err) {
        throw err;
    }
}

const product_details = async (req: any, res: express.Response) => {
    try {

        let response = await product_module.details(req)
        handle_success(res, response);

    }
    catch (err) {
        handle_catch(res, err);
    }
};

const list_reviews = async (req: express.Request, res: express.Response) => {
    try {
        let { _id: product_id, pagination, limit } = req.query;
        let product = DAO.get_data(Models.Products, { _id: product_id }, {}, { lean: true })
        let { parent_id } = product[0]
        let query: any = { product_id: product_id }
        if (!!parent_id) {
            query.$or = [{ product_id: product_id }, { product_id: parent_id }]
        }

        let populate = [
            { path: "user_id", select: "name profile_pic" }
        ]

        let projection = { __v: 0 };
        let options = await helpers.set_options(pagination, limit);
        let fetch_data = await DAO.populate_data(Models.Reviews, query, projection, options, populate);
        let fetch_product = await DAO.get_data(Models.Products, { _id: product_id }, projection, options);
        let {
            total_reviews,
            total_ratings,
            average_rating,
            one_star_ratings,
            two_star_ratings,
            three_star_ratings,
            four_star_ratings,
            five_star_ratings
        } = fetch_product[0];
        // fetch total count
        let total_count = await product_services.fetch_total_count(Models.Reviews, query);

        let response = {
            total_count: total_count,
            total_reviews: total_reviews,
            total_ratings: total_ratings,
            average_rating: average_rating,
            one_star_ratings: one_star_ratings,
            two_star_ratings: two_star_ratings,
            three_star_ratings: three_star_ratings,
            four_star_ratings: four_star_ratings,
            five_star_ratings: five_star_ratings,
            data: fetch_data,
        };

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_faqs = async (req: express.Request, res: express.Response) => {
    try {
        let { search, pagination, limit } = req.query;
        let query: any = { is_deleted: false };
        if (search != undefined) {
            query.$or = [
                { question: { $regex: search, $options: 'i' } },
                { answer: { $regex: search, $options: 'i' } }
            ]
        }
        let projection = { __v: 0 };
        let options = await helpers.set_options(pagination, limit)
        let fetch_data: any = await DAO.get_data(Models.Faqs, query, projection, options);

        // fetch total orders
        let total_count = fetch_data.length

        let response = {
            total_count: total_count,
            data: fetch_data,
        };

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_product_faqs = async (req: express.Request, res: express.Response) => {
    try {
        let { _id: product_id, pagination, limit } = req.query

        let product = DAO.get_data(Models.Products, { _id: product_id }, {}, { lean: true })
        let { parent_id } = product[0]
        let query: any = { product_id: product_id }
        if (!!parent_id) {
            query.$or = [{ product_id: product_id }, { product_id: parent_id }]
        }

        let projection = { __v: 0 };
        let options = await helpers.set_options(pagination, limit);
        let populate: any = [
            { path: "seller_id", select: "name" }
        ]
        let fetch_data: any = await DAO.populate_data(Models.FaqsProducts, query, projection, options, populate);

        // fetch total count
        let total_count = fetch_data.length;

        let response = {
            total_count: total_count,
            data: fetch_data,
        };

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_categories = async (req: any, res: express.Response) => {
    try {

        let { _id, pagination, limit } = req.query;

        let query: any = { is_deleted: false }
        if (!!_id) { query._id = _id }

        let options = await helpers.set_options(pagination, limit);
        let fetch_data = await product_services.make_category_response(query, options);
        let total_count = await product_services.fetch_total_count(Models.Category, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        handle_success(res, response);
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const list_sub_categories = async (req: any, res: express.Response) => {
    try {

        let { _id, category_id, search, pagination, limit } = req.query

        let query: any = { is_deleted: false }
        if (!!_id) { query._id = _id }
        if (!!category_id) { query.category_id = category_id }
        if (!!search) { query.name = { $regex: search, $options: "i" } }

        let options = await helpers.set_options(pagination, limit)
        let fetch_data = await product_services.make_subcategory_response(query, options)
        let total_count = await product_services.fetch_total_count(Models.SubCategory, query)
        let response = {
            total_count: total_count,
            data: fetch_data
        }
        handle_success(res, response)

    }
    catch (err) {
        handle_catch(res, err);
    }
};

const list_sub_subcategories = async (req: any, res: express.Response) => {
    try {

        let { _id, subcategory_id, search, pagination, limit } = req.query;

        let query: any = { is_deleted: false }
        if (!!_id) { query._id = _id }
        if (!!subcategory_id) { query.subcategory_id = subcategory_id }
        if (!!search) { query.name = { $regex: search, $options: "i" } }

        let options = await helpers.set_options(pagination, limit);
        let fetch_data = await product_services.make_Sub_subcategories(query, options);
        let total_count = await product_services.fetch_total_count(Models.Sub_subcategories, query);
        let response = {
            total_count: total_count,
            data: fetch_data
        }
        handle_success(res, response)
    }
    catch (err) {
        handle_catch(res, err);
    }
};



const list_brands = async (req: any, res: express.Response) => {
    try {
        let { search, pagination, limit } = req.query;

        let query: any = { is_deleted: false };
        // if (_id != undefined) { query._id = _id }
        if (search != undefined) {
            query.name = { $regex: search, $options: "i" };
        }
        // if (_id != undefined) { query._id = _id }

        let options = await helpers.set_options(pagination, limit);
        let fetch_data = await product_services.make_brand_response(query, options);
        options.sort = { name: 1 }
        // fetch total count
        let total_count = await product_services.fetch_total_count(Models.Brands, query);

        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // //console.log(response);

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_banners = async (req: any, res: express.Response) => {
    try {
        let { _id, pagination, limit } = req.query;

        let query: any = {};

        let options = await helpers.set_options(pagination, limit);
        let fetch_data = await product_services.make_banners_response(query, options);

        // fetch total count
        let total_count = await product_services.fetch_total_count(Models.Banners, query);

        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // //console.log(response);

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_product_variants = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.query;
        let query: any = { product_id: _id };
        let options = { lean: true };
        let response = await product_services.get_variants_detail(query, options);
        // //console.log(response);
        // return response
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_deals_of_the_day = async (req: any, res: express.Response) => {
    try {
        let { _id, pagination, limit } = req.query;

        let query: any = {};

        let options = await helpers.set_options(pagination, limit);
        let fetch_data = await product_services.make_deals_response(query, options);

        // fetch total count
        let total_count = await product_services.fetch_total_count(Models.Deals_of_the_day, query);

        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // //console.log(response);

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const listing_deals_of_the_day_products = async (
    req: any,
    res: express.Response
) => {
    try {
        let { _id } = req.query;
        let query: any = { _id: _id };
        let options = { lean: true };
        let projection = { __v: 0 };
        let response: any = await product_services.get_deals_detail(query, options);
        let subCategories_id = response[0].subcategory_id._id;
        // console.log("-------check SUB-------", subCategories_id);
        let query_data = { subcategory_id: subCategories_id };
        let fetch_product_data = await DAO.get_data(Models.Products, query_data, projection, options);
        handle_success(res, fetch_product_data);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_hot_deals = async (req: any, res: express.Response) => {
    try {
        let { _id, pagination, limit } = req.query;

        let query: any = {};

        let options = await helpers.set_options(pagination, limit);
        let fetch_data = await product_services.make_hot_deals_response(query, options);

        // fetch total count
        let total_count = await product_services.fetch_total_count(Models.Hot_deals, query);

        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // //console.log(response);

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const listing_hot_deals_products = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.query;
        let query: any = { _id: _id };
        let options = { lean: true };
        let projection = { __v: 0 };
        let response: any = await product_services.get_hotdeals_detail(query, options);
        let subCategories_id = response[0].subcategory_id._id;
        // console.log("-------check SUB-------", subCategories_id);
        let query_data = { subcategory_id: subCategories_id };
        let fetch_product_data = await DAO.get_data(Models.Products, query_data, projection, options);
        handle_success(res, fetch_product_data);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_fashion_deals = async (req: any, res: express.Response) => {
    try {
        let { _id, pagination, limit } = req.query;

        let query: any = {};

        let options = await helpers.set_options(pagination, limit);
        let fetch_data = await product_services.make_fashion_deals_response(
            query,
            options
        );

        // fetch total count
        let total_count = await product_services.fetch_total_count(Models.FashionDeals, query);

        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        //console.log(response);

        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const listing_fashion_deals_products = async (
    req: any,
    res: express.Response
) => {
    try {
        let { _id } = req.query;
        let query: any = { _id: _id };
        let options = { lean: true };
        let projection = { __v: 0 };
        let response: any = await product_services.get_fashiondeals_detail(
            query,
            options
        );
        let brand_id = response[0].brand_id._id;
        // console.log("-------check SUB-------", brand_id);
        let query_data = { brand_id: brand_id };
        let fetch_product_data = await DAO.get_data(Models.Products, query_data, projection, options);
        handle_success(res, fetch_product_data);
    } catch (err) {
        handle_catch(res, err);
    }
};

// const list_products_filter = async (req: any, res: express.Response) => {
//     try {
//         let { subcategory_id, sub_subcategory_id, brand_id, min_price, max_price, discount_available, ratings, pagination, limit, } = req.query;
//         let fetch_data: any, total_count: any;
//         // console.log('**** req.query **** ',req.query)

//         let query: any = [
//             await product_helper.redact_filter_data(req.query),
//             // await product_helper.redact_filter_data(sub_subcategory_id,"$sub_subcategory_id"),
//             // await product_helper.redact_filter_data(brand_id, "$brand_id"),
//             await product_helper.redact_match_price(min_price, max_price),

//             await product_helper.redact_match_data(discount_available, "$discount_percantage"),
//             await product_helper.redact_match_data(ratings, "$average_rating"),

//             await product_helper.lookup_data("subcategories", "$subcategory_id"),
//             await product_helper.unwind_data("$subcategory_id"),
//             await product_helper.lookup_data("sub_subcategories", "$sub_subcategory_id"),
//             await product_helper.unwind_data("$sub_subcategory_id"),
//             await product_helper.lookup_data("brands", "$brand_id"),
//             await product_helper.unwind_data("$brand_id"),

//             await product_helper.lookup_data("sellers", "$added_by"),
//             await product_helper.unwind_data("$added_by"),

//             await product_helper.sort_by_price(),
//             await product_helper.sort_data(),
//             await product_helper.skip_data(pagination, limit),
//             await product_helper.limit_data(limit)
//         ];

//         let options = { lean: true };
//         fetch_data = await DAO.aggregate_data(Models.Products, query, options);
//         total_count = await fetch_data.length;

//         // console.log(fetch_data);
//         let response = { total_count: total_count, data: fetch_data, };

//         // return data
//         handle_success(res, response);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

const retrive_filter_products = async (req: any, res: express.Response) => {
    try {

        let { token } = req.headers;
        let user_id = token != undefined ? await product_module.fetch_token_data(token) : null;
        console.log('filters req-query ', req.query)

        let query: any = [
            await filter_products.match_data(),
            await filter_products.filter_data(req.query),
            await filter_products.lookup_brands(),
            await filter_products.unwind_brands(),
            await filter_products.lookup_categories(),
            await filter_products.unwind_categories(),
            await filter_products.lookup_subcategories(),
            await filter_products.unwind_subcategories(),
            await filter_products.lookup_sub_subcategories(),
            await filter_products.unwind_sub_subcategories(),
            await filter_products.lookup_seller(),
            await filter_products.unwind_seller(),
            await filter_products.product_highlights(),
            await filter_products.wishlists(user_id),
            await filter_products.set_data(),
            await filter_products.group_data(),
            await filter_products.sort_data(req.query),
            await filter_products.skip_data(req.query),
            await filter_products.limit_data(req.query)
        ]
        let options = { lean: true }
        let retrive_data = await DAO.aggregate_data(Models.Products, query, options)

        query.push(await filter_products.sort_highest_price())
        let retrive_highest_price_data = await DAO.aggregate_data(Models.Products, query, options)
        console.log("retrive_price_data --- ", retrive_highest_price_data[0])
        let count_query = [
            await filter_products.match_data(),
            await filter_products.filter_data(req.query),
            await filter_products.lookup_brands(),
            await filter_products.unwind_brands(),
            await filter_products.lookup_categories(),
            await filter_products.unwind_categories(),
            await filter_products.lookup_subcategories(),
            await filter_products.unwind_subcategories(),
            await filter_products.lookup_sub_subcategories(),
            await filter_products.unwind_sub_subcategories(),
            await filter_products.lookup_seller(),
            await filter_products.unwind_seller(),
            await filter_products.product_highlights(),
            await filter_products.wishlists(user_id),
            await filter_products.set_data(),
            await filter_products.group_data()
        ]
        let count_data: any = await DAO.aggregate_data(Models.Products, count_query, options)
        let response = {
            total_count: count_data.length,
            max_price: retrive_highest_price_data != undefined ? Math.ceil(retrive_highest_price_data[0]?.discount_price) : 0,
            data: retrive_data
        }
        handle_success(res, response);

    }
    catch (err) {
        throw err;
    }
}

const searchDeliveryLocation = async (req: any, res: express.Response) => {
    try {

        let { token } = req.headers;
        let response: any;
        let user_id = token != undefined ? await product_module.fetch_token_data(token) : null;
        response = await product_module.searchLocation(req.query)
        handle_success(res, response);

    }
    catch (err) {
        throw err;
    }
}


export {
    list_products,
    list_related_products,
    product_details,
    list_reviews,
    list_faqs,
    list_product_faqs,
    list_categories,
    list_sub_categories,
    list_sub_subcategories,
    list_brands,
    list_banners,
    list_product_variants,
    list_deals_of_the_day,
    listing_deals_of_the_day_products,
    list_hot_deals,
    list_fashion_deals,
    listing_hot_deals_products,
    listing_fashion_deals_products,
    retrive_filter_products,
    searchDeliveryLocation,
};