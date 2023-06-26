"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.update_email_otp = exports.get_Orders_data = exports.get_product_by_id = exports.verify_product = exports.edit_faqs = exports.verify_seller_info = exports.set_seller_data = exports.save_notification_data = exports.order_confirmation = exports.order_cancellation = exports.list_reviews = exports.make_orders_response = exports.fetch_order_detail = exports.fetch_Orders_data = exports.verify_user_info = exports.edit_products_data = exports.block_delete_data = exports.fetch_total_count = exports.product_details = exports.get_highlights = exports.get_services = exports.get_product_detail = exports.make_products_response = exports.save_deliverable_locations = exports.save_product_highlights = exports.save_product_services = exports.save_product_details = exports.get_variants_detail = exports.edit_productDetails = exports.edit_highlights = exports.edit_services = exports.edit_variants = exports.save_product_variants = exports.save_products = exports.make_subcategory_response = exports.make_brand_response = exports.make_seller_response = exports.generate_seller_token = exports.get_seller_data = void 0;
const DAO = __importStar(require("../../DAO/index"));
const Models = __importStar(require("../../models"));
const index_1 = require("../../config/index");
const index_2 = require("../../middlewares/index");
// import { save_data } from "../../../build/src/DAO";
const seller_scope = index_1.app_constant.scope.seller;
var pincodeDirectory = require('india-pincode-lookup');
const get_seller_data = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: _id };
        // console.log("QUERY ", query)
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_single_data(Models.Sellers, query, projection, options);
        // console.log("fetch_data ", fetch_data)
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.get_seller_data = get_seller_data;
const generate_seller_token = (_id, req_data, device_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token_data = {
            _id: _id,
            scope: seller_scope,
            collection: Models.Sellers,
            token_gen_at: +new Date(),
        };
        let access_token = yield (0, index_2.generate_token)(token_data);
        let response = yield save_session_data_seller(access_token, token_data, req_data, device_type);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.generate_seller_token = generate_seller_token;
const save_session_data_seller = (access_token, token_data, req_data, device_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: seller_id, token_gen_at } = token_data;
        let { fcm_token } = req_data;
        // let device_type: any = req_data.headers["user-agent"];
        // console.log("DEVICE TYPE  ----***** ----- ****  --- ", device_type);
        //  console.log(" req_data.headers ----***** ----- ****  --- ",  req_data.headers);
        let set_data = {
            type: "SELLER",
            seller_id: seller_id,
            fcm_token: fcm_token,
            access_token: access_token,
            token_gen_at: token_gen_at,
            created_at: +new Date(),
        };
        if (device_type != null || device_type != undefined) {
            set_data.device_type = device_type;
        }
        let response = yield DAO.save_data(Models.Sessions, set_data);
        return response;
    }
    catch (err) {
        throw err;
    }
});
const make_seller_response = (data, language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { seller_id, access_token, token_gen_at } = data;
        let query = { _id: seller_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Sellers, query, projection, options);
        if (fetch_data.length) {
            fetch_data[0].access_token = access_token;
            fetch_data[0].token_gen_at = token_gen_at;
            return fetch_data[0];
        }
        else {
            throw yield (0, index_2.handle_custom_error)("UNAUTHORIZED", language);
        }
    }
    catch (err) {
        throw err;
    }
});
exports.make_seller_response = make_seller_response;
const save_products = (data, seller_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, brand_id, subcategory_id, images, description, price, discount_percantage, quantity, sub_subcategory_id, deliverable_Locations } = data;
        let calculate_discount_price, calculate_discount;
        if (discount_percantage != "0") {
            calculate_discount = (discount_percantage / 100) * price;
            // console.log("Calculate_discount:-> ", calculate_discount)
            calculate_discount_price = price - calculate_discount;
            // console.log("calculate_price:-> ", calculate_discount_price)
        }
        let set_data = {
            name: name,
            brand_id: brand_id,
            subcategory_id: subcategory_id,
            sub_subcategory_id: sub_subcategory_id,
            images: images,
            quantity: quantity,
            description: description,
            price: price,
            discount_percantage: discount_percantage,
            discount: calculate_discount,
            discount_price: calculate_discount_price,
            added_by: seller_id,
            // deliverable_Locations: deliverable_Locations,
            created_at: +new Date(),
        };
        // console.log("SET DATA ADD", set_data)
        let response = yield DAO.save_data(Models.Products, set_data);
        return response;
    }
    catch (err) {
        // //console.log(err);
        throw err;
    }
});
exports.save_products = save_products;
const make_brand_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let response = yield DAO.get_data(Models.Brands, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.make_brand_response = make_brand_response;
const make_subcategory_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [{ path: "category_id", select: "name" }];
        let response = yield DAO.populate_data(Models.SubCategory, query, projection, options, populate);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.make_subcategory_response = make_subcategory_response;
// const save_product_details = async (data: any, product_id: any) => {
//     try {
//         console.log("data-->, ", data)
//         if (data.length) {
//             for (let product_info of data) {
//                 console.log("Product_Info-->, ", product_info[0])
//                 let query = { product_id: product_id }
//                 let total_count = await DAO.count_data(Models.ProductDetails, query)
//                 console.log("--total_count--", total_count)
//                 let { key, value } = product_info
//                 console.log("key-> ", key)
//                 console.log("value-> ", value)
//                 let data_to_save = {
//                     product_id: product_id,
//                     key: key,
//                     value: value,
//                     unique_number: Number(total_count) + 1,
//                     created_at: +new Date()
//                 }
//                 console.log("data _to _save _ --> ", data_to_save)
//                 let response: any = await DAO.save_data(Models.ProductDetails, data_to_save)
//                 let condition = { _id: product_id }
//                 let update = {
//                     "$push": { product_details: response._id }
//                 }
//                 let options = { new: true }
//                 let respone = await DAO.find_and_update(Models.Products, condition, update, options)
//                 console.log("--response_2---->", respone)
//                 return respone
//             }
//         }
//     } catch (err) {
//         console.log(err)
//         throw err;
//     }
// }
const save_product_details = (data, product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response;
        // console.log("DATA----->>>> " , data)
        if (data.length !== undefined || data.length !== null) {
            for (let product_info of data) {
                // console.log("###PRODUCT_INFO####: ",product_info)
                let { key, value } = product_info;
                let query = { product_id: product_id };
                let total_count = yield DAO.count_data(Models.ProductDetails, query);
                // console.log("--total_count--",total_count)
                // console.log("PRODUCT_INFO: ",product_info)
                let data_to_save = {
                    product_id: product_id,
                    key: key,
                    value: value,
                    unique_number: Number(total_count) + 1,
                    created_at: +new Date(),
                };
                // console.log("DATA TO SAVE: ", data_to_save);
                response = yield DAO.save_data(Models.ProductDetails, data_to_save);
                //   let condition = { _id: product_id };
                //   let update = {
                //     $push: { product_details: response._id },
                //   };
                //   let options = { new: true };
                // response = await DAO.find_and_update(Models.Products, condition, update, options);
                // console.log("@@@@@ response_product_details @@@@ ", respone);
                // return respone_product
            }
            return response;
        }
    }
    catch (err) {
        //console.log(err);
        throw err;
    }
});
exports.save_product_details = save_product_details;
const save_product_services = (data, product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response, respone_product;
        if (data.length !== undefined || data.length !== null) {
            for (let services_data of data) {
                let data_to_save = {
                    product_id: product_id,
                    content: services_data
                };
                response = yield DAO.save_data(Models.ProductServices, data_to_save);
                // let condition = { _id: product_id }, options = { new: true };;
                // let update = {
                //   $push: { services: save_Services._id },
                // };
                // response = await DAO.find_and_update(Models.Products, condition, update, options);
                // console.log("@@@@@ SERVICES @@@@@@ ", response)
            }
            return response;
        }
    }
    catch (err) {
        //console.log(err);
        throw err;
    }
});
exports.save_product_services = save_product_services;
const save_product_highlights = (data, product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response, respone_product;
        if (data.length !== undefined || data.length !== null) {
            for (let highlights_data of data) {
                let data_to_save = {
                    product_id: product_id,
                    content: highlights_data
                };
                response = yield DAO.save_data(Models.ProductHighlights, data_to_save);
                // let condition = { _id: product_id }, options = { new: true };;
                // let update = {
                //   $push: { highlights: save_highlights._id },
                // };
                // response = await DAO.find_and_update(Models.Products, condition, update, options);
                // console.log("@@@@@ HIGHLIGHTS @@@@@@ ", response)
            }
            return response;
        }
    }
    catch (err) {
        //console.log(err);
        throw err;
    }
});
exports.save_product_highlights = save_product_highlights;
const save_deliverable_locations = (data, product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let respone_product;
        if (data.length !== undefined) {
            for (let location of data) {
                let { city_name } = location;
                let check_city = yield check_city_exist(city_name, product_id);
                if (check_city == undefined || check_city == null) {
                    let data_to_save = {
                        product_id: product_id,
                        city_name: city_name,
                        created_at: +new Date(),
                    };
                    let response = yield DAO.save_data(Models.DeliverableLocations, data_to_save);
                    let condition = { _id: product_id };
                    let update = { $push: { deliverable_cities: response._id } };
                    let options = { new: true };
                    yield DAO.find_and_update(Models.Products, condition, update, options);
                    let city_id = response._id;
                    let get_pincode_data = yield pincodeDirectory.lookup(city_name);
                    for (let pin_codes of get_pincode_data) {
                        yield save_pincodes(pin_codes.pincode, city_id);
                    }
                }
                else {
                    // console.log(`------- ${city_name} CITY ALREADY EXIST------`)
                }
            }
            return respone_product;
        }
    }
    catch (err) {
        //console.log(err);
        throw err;
    }
});
exports.save_deliverable_locations = save_deliverable_locations;
const save_pincodes = (pincode, city_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data_to_save = {
            deliverable_location_id: city_id,
            pincode: pincode,
            created_at: +new Date(),
        };
        // console.log(" data to save --> ", data_to_save)
        let response = yield DAO.save_data(Models.PinCodes, data_to_save);
        return response;
    }
    catch (err) {
        throw err;
    }
});
const check_city_exist = (city, product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let query = { city_name: city, product_id: product_id }, options = { lean: true };
        let response = yield DAO.get_single_data(Models.DeliverableLocations, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
const make_products_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield DAO.aggregate_data(Models.Products, query, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.make_products_response = make_products_response;
const get_product_detail = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: "brand_id", select: "name" },
            { path: "subcategories_id", select: "name" },
            { path: "product_details", select: "key value" },
            // { path: "deliverable_cities", select: "city_name" },
            { path: "added_by", select: "name email phone_number" },
        ];
        let respone = yield DAO.populate_data(Models.Products, query, projection, options, populate);
        return respone;
    }
    catch (err) {
        throw err;
    }
});
exports.get_product_detail = get_product_detail;
const get_services = (_id, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { content: 1 };
        let query = { product_id: _id };
        let fetch_data = yield DAO.get_data(Models.ProductServices, query, projection, options);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.get_services = get_services;
const get_highlights = (_id, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { content: 1 };
        let query = { product_id: _id };
        let fetch_data = yield DAO.get_data(Models.ProductHighlights, query, projection, options);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.get_highlights = get_highlights;
const product_details = (_id, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { key: 1, value: 1, unique_number: 1 };
        let query = { product_id: _id };
        let fetch_data = yield DAO.get_data(Models.ProductDetails, query, projection, options);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.product_details = product_details;
const get_product_by_id = (_id, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let query = { _id: _id };
        let populate = [
            { path: 'brand_id', select: 'name' },
            { path: 'product_details', select: 'key value' },
            { path: 'services', select: 'content' },
            { path: 'highlights', select: 'content' },
            // { path: 'deliverable_cities', select: 'city_name' },
            {
                path: 'subcategory_id',
                select: '-__v',
                populate: [
                    { path: 'category_id', select: 'name' },
                ]
            },
            {
                path: 'sub_subcategory_id',
                select: '-__v',
                populate: [
                    { path: 'subcategory_id', select: 'name' },
                ]
            }
        ];
        let response = yield DAO.populate_data(Models.Products, query, projection, options, populate);
        // console.log("------RESPONSE-------",respone)
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.get_product_by_id = get_product_by_id;
const fetch_total_count = (collection, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield DAO.count_data(collection, query);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_total_count = fetch_total_count;
const block_delete_data = (data, collection) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, is_blocked, is_deleted } = data;
        let query = { _id: _id };
        let data_to_update = {};
        if (typeof is_blocked !== "undefined" && is_blocked !== null) {
            data_to_update.is_blocked = is_blocked;
        }
        if (typeof is_deleted !== "undefined" && is_deleted !== null) {
            data_to_update.is_deleted = is_deleted;
        }
        let options = { new: true };
        let response = yield DAO.find_and_update(collection, query, data_to_update, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.block_delete_data = block_delete_data;
const edit_products_data = (data, _id, deliverable_cities) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: _id };
        // let projection = { quantity: 1, price: 1, deliverable_cities: 1 };
        let projection = { __v: 0 };
        let options = { lean: true };
        let get_products = yield DAO.get_single_data(Models.Products, query, projection, options);
        let set_data = {};
        let old_quantity = get_products.quantity;
        if (data.name) {
            set_data.name = data.name;
        }
        if (data.price) {
            set_data.price = data.price;
            // console.log("Set data price:-> ", set_data.price);
        }
        if (data.discount_percantage) {
            set_data.discount_percantage = data.discount_percantage;
        }
        if (data.brand_id) {
            set_data.brand_id = data.brand_id;
        }
        if (data.subcategory_id) {
            set_data.subcategory_id = data.subcategory_id;
        }
        if (data.sub_subcategory_id) {
            set_data.sub_subcategory_id = data.sub_subcategory_id;
        }
        if (data.quantity) {
            (set_data.quantity = old_quantity + Number(data.quantity)),
                (set_data.sold = false);
        }
        if (data.quantity) {
            (set_data.quantity = old_quantity + Number(data.quantity)),
                (set_data.sold = false);
        }
        if (data.images) {
            let arr = [];
            let old_images = yield get_products.images;
            if (old_images == null) {
                // console.log("IMAGES ", data.images)
                let images_d = data.imaages;
                for (let value of data.images.split(",")) {
                    arr.push(value);
                }
                set_data.images = arr;
            }
            else {
                for (let value of data.images.split(",")) {
                    old_images.push(value);
                }
                set_data.images = old_images;
            }
        }
        if (data.description) {
            set_data.description = data.description;
        }
        // if (data.services) {
        //   // console.log("new data ", data.services);
        //   let arr = [];
        //   let old_services = await get_products.services;
        //   if (old_services == null) {
        //     for (let value of data.services.split(",")) {
        //       arr.push(value);
        //     }
        //     set_data.services = arr;
        //   } else {
        //     for (let value of data.services.split(",")) {
        //       old_services.push(value);
        //     }
        //     set_data.services = old_services;
        //     // console.log("Set data-> ", set_data.services);
        //   }
        // }
        // if (data.highlights) {
        //   // console.log(data.highlights);
        //   let arr = [];
        //   let old_highlights = await get_products.highlights;
        //   if (old_highlights == null) {
        //     for (let value of data.highlights.split(",")) {
        //       // console.log("value->", value);
        //       arr.push(value);
        //     }
        //     set_data.highlights = arr;
        //   } else {
        //     for (let value of data.highlights.split(",")) {
        //       old_highlights.push(value);
        //     }
        //     set_data.highlights = old_highlights;
        //     // console.log("Set data-> ", set_data.highlights);
        //   }
        // }
        // delivery cities edit 
        // if (deliverable_cities) {
        //   // let old_cities: any = await get_products.deliverable_cities;
        //   await save_deliverable_locations(deliverable_cities, get_products._id)
        // }
        // if (data.deliverable_Locations) {
        //   console.log(data.deliverable_Locations);
        //   let arr = [];
        //   ;
        //   if (old_locations == null) {
        //     for (let value of data.deliverable_Locations.split(",")) {
        // console.log("value->", value);
        //       arr.push(value);
        // console.log("arr-> ",arr)
        //     }
        //     set_data.deliverable_Locations = arr;
        //     // console.log("Set data-> ", set_data.deliverable_Locations)
        //   } else {
        //     for (let value of data.deliverable_Locations.split(",")) {
        //       old_locations.push(value);
        //     }
        //     // console.log("old updated-> ", old_locations )
        //     set_data.deliverable_Locations = old_locations;
        //     console.log("Set data-> ", set_data.deliverable_Locations);
        //   }
        // }
        return set_data;
    }
    catch (err) {
        throw err;
    }
});
exports.edit_products_data = edit_products_data;
const verify_user_info = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Sellers, query, projection, options);
        // console.log(fetch_data);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.verify_user_info = verify_user_info;
const save_product_variants = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { title, images, price, product_id, content } = data;
        let set_data = {
            title: title,
            images: images,
            price: price,
            product_id: product_id,
            // content: content,
        };
        // console.log('set ',set_data)
        let response = yield DAO.save_data(Models.Product_Variations, set_data);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.save_product_variants = save_product_variants;
const edit_variants = (data, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let set_data = {}, options = { new: true }, option = { lean: true }, projection = { __v: 0 };
        let get_prod_variants = yield DAO.get_single_data(Models.Product_Variations, query, projection, option);
        // console.log("OLD ", get_prod_variants)
        // console.log("OLD Images", get_prod_variants.images)
        if (data.images) {
            let old_images = yield get_prod_variants.images;
            // console.log("old_images  ", old_images.length)
            if (old_images == null) {
                // console.log("IMAGES ", data.images)
                // let images_d = data.imaages
                // for (let value of data.images.split(",")) {
                //   arr.push(value);
                // }
                set_data.images = data.images;
            }
            else {
                for (let value of data.images) {
                    old_images.push(value);
                }
                set_data.images = old_images;
            }
        }
        if (data.title) {
            set_data.title = data.title;
        }
        if (data.price) {
            set_data.price = data.price;
        }
        // //console.log("setdata ", set_data)
        let response = yield DAO.find_and_update(Models.Product_Variations, query, set_data, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.edit_variants = edit_variants;
const edit_services = (data, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let set_data = {}, options = { new: true };
        if (data.content) {
            set_data.content = data.content;
        }
        //console.log("setdata ", set_data)
        let response = yield DAO.find_and_update(Models.ProductServices, query, set_data, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.edit_services = edit_services;
const edit_highlights = (data, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let set_data = {}, options = { new: true };
        if (data.content) {
            set_data.content = data.content;
        }
        //console.log("setdata ", set_data)
        let response = yield DAO.find_and_update(Models.ProductHighlights, query, set_data, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.edit_highlights = edit_highlights;
const edit_productDetails = (data, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let set_data = {}, options = { new: true };
        if (data.key) {
            set_data.key = data.key;
        }
        if (data.value) {
            set_data.value = data.value;
        }
        //console.log("setdata ", set_data)
        let response = yield DAO.find_and_update(Models.ProductDetails, query, set_data, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.edit_productDetails = edit_productDetails;
const get_variants_detail = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        // let populate = [
        //     { path:"product_id", select:"name"}
        // ]
        let respone = yield DAO.get_data(Models.Product_Variations, query, projection, options);
        // console.log(respone)
        return respone;
    }
    catch (err) {
        throw err;
    }
});
exports.get_variants_detail = get_variants_detail;
const fetch_order_detail = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { order_status: 1, total_price: 1 };
        let populate = [
            { path: "product", select: "_id images name price" },
            { path: "user_id", select: "name profile_pic address phone_no " },
            { path: "address_id", select: "" },
            { path: "parcel_id", select: "" },
        ];
        let fetch_data = yield DAO.populate_data(Models.Orders, query, projection, options, populate);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_order_detail = fetch_order_detail;
const make_orders_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield DAO.aggregate_data(Models.Orders, query, options);
        // console.log("Response ", response)
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.make_orders_response = make_orders_response;
const list_reviews = (user_id, product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { user_id: user_id, product_id: product_id };
        let populate = [
            { path: "user_id", select: "name profile_pic address phone_no " },
        ];
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.populate_data(Models.Reviews, query, projection, options, populate);
        return response;
    }
    catch (err) {
        return err;
    }
});
exports.list_reviews = list_reviews;
const order_cancellation = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: _id };
        let data_to_update = {
            order_status: "CANCELLED",
            is_removed: true,
            cancellation_reason: "ORDER CANCELLED BY SELLER",
        };
        let options = { lean: true };
        let response = yield DAO.find_and_update(Models.Orders, query, data_to_update, options);
        //   console.log(response)
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.order_cancellation = order_cancellation;
const order_confirmation = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: _id };
        let data_to_update = {
            order_status: "CONFIRMED",
        };
        let options = { lean: true };
        let response = yield DAO.find_and_update(Models.Orders, query, data_to_update, options);
        //   console.log(response)
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.order_confirmation = order_confirmation;
const fetch_Orders_data = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: "product", select: "" },
            { path: "user_id", select: "name profile_pic" }
        ];
        // let response: any = await DAO.populate_data(Models.Orders, query, projection, options, populate);
        let response = yield DAO.get_data(Models.Orders, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_Orders_data = fetch_Orders_data;
const get_Orders_data = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let response = yield DAO.get_data(Models.Orders, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.get_Orders_data = get_Orders_data;
const save_notification_data = (set_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield DAO.save_data(Models.Notifications, set_data);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.save_notification_data = save_notification_data;
const set_seller_data = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, email, image, country_code, phone_number, password, language } = data;
        // bycryt password
        let hassed_password = yield index_2.helpers.bcrypt_password(password);
        let otp = yield index_2.helpers.generate_otp();
        // fetch otp
        let data_to_save = {
            name: name,
            email: email.toLowerCase(),
            email_otp: otp,
            country_code: country_code,
            phone_number: phone_number,
            password: hassed_password,
            image: image,
            language: language,
            created_at: +new Date(),
        };
        let response = yield DAO.save_data(Models.Sellers, data_to_save);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.set_seller_data = set_seller_data;
const verify_seller_info = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Sellers, query, projection, options);
        // console.log(fetch_data);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.verify_seller_info = verify_seller_info;
const update_email_otp = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // generate otp
        let otp = yield index_2.helpers.generate_otp();
        let query = { _id: user_id };
        let update = { email_otp: otp, email_verified: false };
        let options = { new: true };
        return yield DAO.find_and_update(Models.Sellers, query, update, options);
    }
    catch (err) {
        throw err;
    }
});
exports.update_email_otp = update_email_otp;
const edit_faqs = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let set_data = {};
        if (data.question) {
            set_data.question = data.question;
        }
        if (data.answer) {
            set_data.answer = data.answer;
        }
        return set_data;
    }
    catch (err) {
        throw err;
    }
});
exports.edit_faqs = edit_faqs;
const verify_product = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Products, query, projection, options);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.verify_product = verify_product;
