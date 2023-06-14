import * as DAO from "../../DAO/index";
import * as Models from "../../models";
import * as seller_helper from "./seller_helper";
import { app_constant } from "../../config/index";
import { generate_token, handle_custom_error, helpers } from "../../middlewares/index";
import { send_email } from "../../middlewares";
import { send_notification } from "../../middlewares";
import console from "console";
// import { save_data } from "../../../build/src/DAO";


const seller_scope = app_constant.scope.seller;
var pincodeDirectory = require('india-pincode-lookup');

const get_seller_data = async (_id: any) => {
  try {
    let query = { _id: _id };
    // console.log("QUERY ", query)
    let projection = { __v: 0 };
    let options = { lean: true };
    let fetch_data: any = await DAO.get_single_data(Models.Sellers, query, projection, options);
    // console.log("fetch_data ", fetch_data)
    return fetch_data
  } catch (err) {
    throw err;
  }
};

const generate_seller_token = async (_id: string, req_data: any,device_type:any) => {
  try {
    let token_data = {
      _id: _id,
      scope: seller_scope,
      collection: Models.Sellers,
      token_gen_at: +new Date(),
    };
    let access_token: any = await generate_token(token_data);
    let response = await save_session_data_seller(access_token, token_data, req_data, device_type);
    return response;
  } catch (err) {
    throw err;
  }
};

const save_session_data_seller = async (access_token: string, token_data: any, req_data: any, device_type:any) => {
  try {
    let { _id: seller_id, token_gen_at } = token_data;
    let {fcm_token} = req_data;
    // let device_type: any = req_data.headers["user-agent"];
    // console.log("DEVICE TYPE  ----***** ----- ****  --- ", device_type);
    //  console.log(" req_data.headers ----***** ----- ****  --- ",  req_data.headers);
    let set_data: any = {
      type: "SELLER",
      seller_id: seller_id,
      fcm_token:fcm_token,
      access_token: access_token,
      token_gen_at: token_gen_at,
      created_at: +new Date(),
    };
    if(device_type != null || device_type != undefined){
      set_data.device_type = device_type
    }
    let response = await DAO.save_data(Models.Sessions, set_data);

    return response;
  } catch (err) {
    throw err;
  }
};

const make_seller_response = async (data: any, language: string) => {
  try {
    let { seller_id, access_token, token_gen_at } = data;

    let query = { _id: seller_id };
    let projection = { __v: 0 };
    let options = { lean: true };
    let fetch_data: any = await DAO.get_data(Models.Sellers, query, projection, options);
   
    if (fetch_data.length) {
      fetch_data[0].access_token = access_token;
      fetch_data[0].token_gen_at = token_gen_at;

      return fetch_data[0];
    } else {
      throw await handle_custom_error("UNAUTHORIZED", language);
    }
  } catch (err) {
    throw err;
  }
};

const save_products = async (data: any, seller_id: any) => {
  try {
    let { name, brand_id, subcategory_id, images, description, price, discount_percantage, quantity,
      sub_subcategory_id, deliverable_Locations } = data;

    let calculate_discount_price: any, calculate_discount: any;

    if (discount_percantage != "0") {
      calculate_discount = (discount_percantage / 100) * price;
      // console.log("Calculate_discount:-> ", calculate_discount)
      calculate_discount_price = price - calculate_discount;
      // console.log("calculate_price:-> ", calculate_discount_price)
    }
    let set_data: any = {
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
    let response = await DAO.save_data(Models.Products, set_data);
    return response;
  } catch (err) {
    // //console.log(err);
    throw err;
  }
};

const make_brand_response = async (query: any, options: any) => {
  try {
    let projection = { __v: 0 };

    let response = await DAO.get_data(Models.Brands, query, projection, options);
    return response;
  } catch (err) {
    throw err;
  }
};

const make_subcategory_response = async (query: any, options: any) => {
  try {
    let projection = { __v: 0 };
    let populate = [{ path: "category_id", select: "name" }];
    let response = await DAO.populate_data(Models.SubCategory, query, projection, options, populate);
    return response;
  } catch (err) {
    throw err;
  }
};

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

const save_product_details = async (data: any, product_id: any) => {
  try {
    let response: any;
    // console.log("DATA----->>>> " , data)
    if (data.length !== undefined || data.length !== null) {
      for (let product_info of data) {
        // console.log("###PRODUCT_INFO####: ",product_info)
        let { key, value } = product_info;

        let query = { product_id: product_id };
        let total_count = await DAO.count_data(Models.ProductDetails, query);
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

        response = await DAO.save_data(Models.ProductDetails, data_to_save);
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
  } catch (err) {
    //console.log(err);
    throw err;
  }
};

const save_product_services = async (data: any, product_id: any) => {
  try {
    let response:any, respone_product: any;

    if (data.length !== undefined || data.length !== null) {
      for (let services_data of data) {

        let data_to_save = {
          product_id:product_id,
          content: services_data
        }

        response =  await DAO.save_data(Models.ProductServices, data_to_save)

        // let condition = { _id: product_id }, options = { new: true };;
        // let update = {
        //   $push: { services: save_Services._id },
        // };
        
        // response = await DAO.find_and_update(Models.Products, condition, update, options);
        // console.log("@@@@@ SERVICES @@@@@@ ", response)
      }
      return response
    }
  } catch (err) {
    //console.log(err);
    throw err;
  }
};

const save_product_highlights = async (data: any, product_id: any) => {
  try {
    let response:any, respone_product: any;

    if (data.length !== undefined || data.length !== null) {
      for (let highlights_data of data) {

        let data_to_save = {
          product_id:product_id,
          content: highlights_data
        }

        response = await DAO.save_data(Models.ProductHighlights, data_to_save)

        // let condition = { _id: product_id }, options = { new: true };;
        // let update = {
        //   $push: { highlights: save_highlights._id },
        // };
        
        // response = await DAO.find_and_update(Models.Products, condition, update, options);
        // console.log("@@@@@ HIGHLIGHTS @@@@@@ ", response)

      }
      return response

    }
  } catch (err) {
    //console.log(err);
    throw err;
  }
};

const save_deliverable_locations = async (data: any, product_id: any) => {
  try {
    let respone_product: any;

    if (data.length !== undefined) {
      for (let location of data) {
        let { city_name } = location;

        let check_city: any = await check_city_exist(city_name, product_id)

        if (check_city == undefined || check_city == null) {

          let data_to_save = {
            product_id: product_id,
            city_name: city_name,
            created_at: +new Date(),
          };

          let response: any = await DAO.save_data(Models.DeliverableLocations, data_to_save);

          let condition = { _id: product_id };
          let update = { $push: { deliverable_cities: response._id } };
          let options = { new: true };
          await DAO.find_and_update(Models.Products, condition, update, options);

          let city_id = response._id
          let get_pincode_data = await pincodeDirectory.lookup(city_name);

          for (let pin_codes of get_pincode_data) {
            await save_pincodes(pin_codes.pincode, city_id)
          }
        } else {
          // console.log(`------- ${city_name} CITY ALREADY EXIST------`)
        }
      }
      return respone_product;
    }
  } catch (err) {
    //console.log(err);
    throw err;
  }
};

const save_pincodes = async (pincode: any, city_id: any) => {
  try {

    let data_to_save = {
      deliverable_location_id: city_id,
      pincode: pincode,
      created_at: +new Date(),
    };
    // console.log(" data to save --> ", data_to_save)
    let response: any = await DAO.save_data(Models.PinCodes, data_to_save);
    return response;
  } catch (err) {
    throw err;
  }
};

const check_city_exist = async (city: any, product_id: any) => {
  try {

    let projection = { __v: 0 }
    let query = { city_name: city, product_id: product_id }, options = { lean: true };
    let response: any = await DAO.get_single_data(Models.DeliverableLocations, query, projection, options);
    return response;
  } catch (err) {
    throw err;
  }
};

const make_products_response = async (query: any, options: any) => {
  try {
    let response: any = await DAO.aggregate_data(Models.Products, query, options);
    return response;
  } catch (err) {
    throw err;
  }
};

const get_product_detail = async (query: any, options: any) => {
  try {
    let projection = { __v: 0 };
    let populate = [
      { path: "brand_id", select: "name" },
      { path: "subcategories_id", select: "name" },
      { path: "product_details", select: "key value" },
      // { path: "deliverable_cities", select: "city_name" },
      { path: "added_by", select: "name email phone_number" },
    ];
    let respone = await DAO.populate_data(Models.Products, query, projection, options, populate);
    return respone;
  } catch (err) {
    throw err;
  }
};

const get_services = async (_id: any, options: any) => {
  try {
    let projection = { content:1 };
    
    let query = { product_id: _id }
    let fetch_data = await DAO.get_data(Models.ProductServices, query, projection, options);
    return fetch_data;
  } catch (err) {
    throw err;
  }
};

const get_highlights= async (_id: any, options: any) => {
  try {
    let projection = { content: 1 };
    let query = { product_id: _id }
    let fetch_data = await DAO.get_data(Models.ProductHighlights, query, projection, options);
    return fetch_data;
  } catch (err) {
    throw err;
  }
};

const product_details = async (_id: any, options: any) => {
  try {
    let projection = { key:1, value:1, unique_number:1};
    let query = { product_id: _id }
    let fetch_data = await DAO.get_data(Models.ProductDetails, query, projection, options);
    return fetch_data;
  } catch (err) {
    throw err;
  }
};


const get_product_by_id = async (_id: any, options: any) => {
  try {

    let projection = { __v: 0 }
    let query: any = { _id: _id };
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
    ]
    let response = await DAO.populate_data(Models.Products, query, projection, options, populate)
    // console.log("------RESPONSE-------",respone)

    return response

  }
  catch (err) {
    throw err;
  }
}

const fetch_total_count = async (collection: any, query: any) => {
  try {
    let response = await DAO.count_data(collection, query);
    return response;
  } catch (err) {
    throw err;
  }
};

const block_delete_data = async (data: any, collection: any) => {
  try {
    let { _id, is_blocked, is_deleted } = data;

    let query = { _id: _id };
    let data_to_update: any = {};

    if (typeof is_blocked !== "undefined" && is_blocked !== null) {
      data_to_update.is_blocked = is_blocked;
    }
    if (typeof is_deleted !== "undefined" && is_deleted !== null) {
      data_to_update.is_deleted = is_deleted;
    }

    let options = { new: true };
    let response = await DAO.find_and_update(collection, query, data_to_update, options);

    return response;
  } catch (err) {
    throw err;
  }
};

const edit_products_data = async (data: any, _id: any, deliverable_cities: any) => {
  try {
    
    let query = { _id: _id };
    // let projection = { quantity: 1, price: 1, deliverable_cities: 1 };
    let projection = { __v: 0 }
    let options = { lean: true };

    let get_products: any = await DAO.get_single_data(Models.Products, query, projection, options);
    let set_data: any = {};
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
      let old_images = await get_products.images;

      if (old_images == null) {
        // console.log("IMAGES ", data.images)
        let images_d = data.imaages
        for (let value of data.images.split(",")) {
          arr.push(value);
        }
        set_data.images = arr;

      } else {
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
  } catch (err) {
    throw err;
  }
};

const verify_user_info = async (query: any) => {
  try {
    let projection = { __v: 0 };
    let options = { lean: true };
    let fetch_data = await DAO.get_data(Models.Sellers, query, projection, options);
    // console.log(fetch_data);
    return fetch_data;
  } catch (err) {
    throw err;
  }
};

const save_product_variants = async (data: any) => {
  try {

    let { title, images, price, product_id, content } = data;

    let set_data: any = {
      title:title,
      images:images,
      price:price,
      product_id: product_id,
      // content: content,
    };
    // console.log('set ',set_data)
    let response: any = await DAO.save_data(Models.Product_Variations, set_data);
    return response;
    
  } catch (err) {
    throw err;
  }
};


const edit_variants = async (data: any, query: any) => {
  try {
    let set_data: any = {}, options = { new: true }, option = {lean: true }, projection = { __v:0 }

    let get_prod_variants:any = await DAO.get_single_data(Models.Product_Variations,query, projection, option)
    // console.log("OLD ", get_prod_variants)
    // console.log("OLD Images", get_prod_variants.images)

    if (data.images) {
      let old_images = await get_prod_variants.images;
      // console.log("old_images  ", old_images.length)

      if (old_images == null) {
        // console.log("IMAGES ", data.images)
        // let images_d = data.imaages
        // for (let value of data.images.split(",")) {
        //   arr.push(value);
        // }
        set_data.images = data.images;

      } else {
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
    let response: any = await DAO.find_and_update(Models.Product_Variations, query, set_data, options);
    return response;
  } catch (err) {
    throw err;
  }
};

const edit_services = async (data: any, query: any) => {
  try {
    let set_data: any = {}, options = { new: true };

    if (data.content) {
      set_data.content = data.content;
    }
    //console.log("setdata ", set_data)
    let response: any = await DAO.find_and_update(Models.ProductServices, query, set_data, options);
    return response;
  } catch (err) {
    throw err;
  }
};

const edit_highlights = async (data: any, query: any) => {
  try {
    let set_data: any = {}, options = { new: true };

    if (data.content) {
      set_data.content = data.content;
    }
    //console.log("setdata ", set_data)
    let response: any = await DAO.find_and_update(Models.ProductHighlights, query, set_data, options);
    return response;
  } catch (err) {
    throw err;
  }
};

const edit_productDetails = async (data: any, query: any) => {
  try {
    let set_data: any = {}, options = { new: true };

    if (data.key) {
      set_data.key = data.key;
    }
    if (data.value) {
      set_data.value = data.value;
    }

    //console.log("setdata ", set_data)
    let response: any = await DAO.find_and_update(Models.ProductDetails, query, set_data, options);
    return response;
  } catch (err) {
    throw err;
  }
};

const get_variants_detail = async (query: any, options: any) => {
  try {

    let projection = { __v: 0 }
    // let populate = [
    //     { path:"product_id", select:"name"}
    // ]
    let respone = await DAO.get_data(Models.Product_Variations, query, projection, options)
    // console.log(respone)
    return respone

  }
  catch (err) {
    throw err;
  }
}

const fetch_order_detail = async (query: any, options: any) => {
  try {
    let projection = { order_status: 1, total_price: 1 };

    let populate = [
      { path: "product", select: "_id images name price" },
      { path: "user_id", select: "name profile_pic address phone_no " },
      { path: "address_id", select: "" },
      { path: "parcel_id", select: "" },
    ];

    let fetch_data: any = await DAO.populate_data(Models.Orders, query, projection, options, populate);

    return fetch_data;
  } catch (err) {
    throw err;
  }
};

const make_orders_response = async (query: any, options: any) => {
  try {
    let response: any = await DAO.aggregate_data(Models.Orders, query, options);
    // console.log("Response ", response)
    return response;
  } catch (err) {
    throw err;
  }
};


const list_reviews = async (user_id: any, product_id: any) => {
  try {
    let query: any = { user_id: user_id, product_id: product_id };
    let populate = [
      { path: "user_id", select: "name profile_pic address phone_no " },

    ];
    let projection = { __v: 0 };
    let options = { lean: true };
    let response = await DAO.populate_data(Models.Reviews, query, projection, options, populate);

    return response;
  } catch (err) {
    return err;
  }
};

const order_cancellation = async (_id: any) => {
  try {
    let query = { _id: _id };

    let data_to_update: any = {
      order_status: "CANCELLED",
      is_removed: true,
      cancellation_reason: "ORDER CANCELLED BY SELLER",
    };

    let options = { lean: true };
    let response = await DAO.find_and_update(Models.Orders, query, data_to_update, options);
    //   console.log(response)
    return response;
  } catch (err) {
    throw err;
  }
};

const order_confirmation = async (_id: any) => {
  try {
    let query = { _id: _id };

    let data_to_update: any = {
      order_status: "CONFIRMED",
    };

    let options = { lean: true };
    let response = await DAO.find_and_update(Models.Orders, query, data_to_update, options);
    //   console.log(response)
    return response;
  } catch (err) {
    throw err;
  }
};

const fetch_Orders_data = async (query: any, options: any) => {
  try {
    let projection = { __v: 0 };
    let populate = [
      { path: "product", select: "" },
      { path: "user_id", select: "name profile_pic" }
    ];
    // let response: any = await DAO.populate_data(Models.Orders, query, projection, options, populate);
    let response: any = await DAO.get_data(Models.Orders, query, projection, options);
    return response;
  } catch (err) {
    throw err;
  }
};
const get_Orders_data = async (query: any, options: any) => {
  try {
    let projection = { __v: 0 };
    let response: any = await DAO.get_data(Models.Orders, query, projection, options);
    return response;
  } catch (err) {
    throw err;
  }
};

const save_notification_data = async (set_data: any) => {
  try {
    let response = await DAO.save_data(Models.Notifications, set_data);
    return response;
  } catch (err) {
    throw err;
  }
};

const set_seller_data = async (data: any) => {
  try {
    let { name, email, image, country_code, phone_number, password,language } = data;

    // bycryt password
    let hassed_password = await helpers.bcrypt_password(password);
    let otp = await helpers.generate_otp();
    // fetch otp

    let data_to_save: any = {
      name: name,
      email: email.toLowerCase(),
      email_otp:otp,
      country_code: country_code,
      phone_number: phone_number,
      password: hassed_password,
      image: image,
      language:language,
      created_at: +new Date(),
    };

    let response: any = await DAO.save_data(Models.Sellers, data_to_save);
    return response;
  } catch (err) {
    throw err;
  }
};

const verify_seller_info = async (query: any) => {
  try {
    let projection = { __v: 0 };
    let options = { lean: true };
    let fetch_data = await DAO.get_data(Models.Sellers, query, projection, options);
    // console.log(fetch_data);
    return fetch_data;
  } catch (err) {
    throw err;
  }
};

const update_email_otp = async (user_id: string) => {
    try {
        // generate otp
        let otp = await helpers.generate_otp();
        let query = { _id: user_id };
        let update = { email_otp: otp,email_verified:false };
        let options = { new: true };
        return await DAO.find_and_update(Models.Sellers, query, update, options);
    } catch (err) {
        throw err;
    }
};

const edit_faqs = async (data: any) => {
  try {
    let set_data: any = {};
    if (data.question) {
      set_data.question = data.question;
    }
    if (data.answer) {
      set_data.answer = data.answer;
    }

    return set_data;
  } catch (err) {
    throw err;
  }
};



const verify_product = async (query: any) => {
  try {
    let projection = { __v: 0 };
    let options = { lean: true };
    let fetch_data = await DAO.get_data(Models.Products, query, projection, options);
    return fetch_data;
  } catch (err) {
    throw err;
  }
};


export {
  get_seller_data,
  generate_seller_token,
  make_seller_response,
  make_brand_response,
  make_subcategory_response,
  save_products,
  save_product_variants,
  edit_variants,
  edit_services,
  edit_highlights,
  edit_productDetails,
  get_variants_detail,
  save_product_details,
  save_product_services,
  save_product_highlights,
  save_deliverable_locations,
  make_products_response,
  get_product_detail,
  get_services,
  get_highlights,
  product_details,
  fetch_total_count,
  block_delete_data,
  edit_products_data,
  verify_user_info,
  fetch_Orders_data,
  fetch_order_detail,
  make_orders_response,
  list_reviews,
  order_cancellation,
  order_confirmation,
  save_notification_data,
  set_seller_data,
  verify_seller_info,
  edit_faqs,
  verify_product,
  get_product_by_id,
  get_Orders_data,
  update_email_otp,
};
