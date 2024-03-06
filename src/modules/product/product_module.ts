import * as DAO from "../../DAO";
import * as Models from "../../models";
import Mongoose from "mongoose";
import { app_constant } from "../../config/index";
const user_scope = app_constant.scope.user;
import * as product_helper from './product_helper'
import {
  verify_token,
  helpers,
  handle_custom_error,
} from "../../middlewares/index";

export default class product_module {
  static details = async (req: any) => {
    try {
      let { _id } = req.query,
        { token } = req.headers;
      let user_id =
        token != undefined ? await this.fetch_token_data(token) : null;
      let query = { _id: _id, is_deleted: false };
      let projection = { __v: 0 };
      let options = { lean: true };
      let populate = [
        {
          path: "added_by",
          select: "name",
        },
        {
          path: "category_id",
          select: "name",
        },
        {
          path: "subcategory_id",
          select: "name",
        },
        {
          path: "sub_subcategory_id",
          select: "name",
        },
        {
          path: "brand_id",
          select: "name",
        },
        {
          path: "size_id",
          select: "size",
        },
      ];
      let retrive_data: any = await DAO.populate_data(Models.Products,query,projection,options,populate);
      console.log(retrive_data[0],'retrive_data');
      
      if (retrive_data.length) {
        let { _id: product_id } = retrive_data[0];
        let in_cart = await this.check_product_in_cart(product_id, user_id);
        let wishlisted = await this.check_wishlisted(product_id, user_id);
        // let can_review = await this.can_add_review(product_id, user_id)
        let product_details = await this.retrive_product_details(product_id);
        let product_services = await this.retrive_product_services(product_id);
        let product_highlights = await this.retrive_product_highlights(product_id);
        let product_variations = await this.retrive_product_variations(product_id);
        let product_faqs = await this.retrive_faq_products(product_id, user_id);
        let ratings = await this.retrive_product_ratings(product_id);
        let ordered_product:any = await this.retrive_order_product(product_id,user_id)

        retrive_data[0].in_cart = in_cart;
        retrive_data[0].wishlist = wishlisted;
        // retrive_data[0].can_review = can_review
        retrive_data[0].productdetails = product_details;
        retrive_data[0].product_services = product_services;
        retrive_data[0].product_highlights = product_highlights;
        retrive_data[0].product_variations = product_variations;
        retrive_data[0].faqs_products = product_faqs;
        retrive_data[0].ratings = ratings;

        if (ordered_product.length != 0) {
          let { _id, order_id } = ordered_product[0];
          retrive_data[0].order_product_id = _id;
          retrive_data[0].order_id = order_id;
        }

        return retrive_data[0];
      } else {
        throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH");
      }
    } catch (err) {
      throw err;
    }
  };

  static fetch_token_data = async (token: string) => {
    try {
      let language = "ENGLISH";
      let token_data: any = await verify_token(token, user_scope, language);
      if (token_data) {
        let { user_id } = token_data;
        return user_id;
      } else {
        throw await handle_custom_error("UNAUTHORIZED", language);
      }
    } catch (err) {
      throw err;
    }
  };

  static check_product_in_cart = async (
    product_id: string,
    user_id: string
  ) => {
    try {
      let set_cart = false;
      if (user_id == null) {
        return set_cart;
      } else {
        let query = { product_id: product_id, user_id: user_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response: any = await DAO.get_data(
          Models.Cart,
          query,
          projection,
          options
        );
        set_cart = response.length > 0 ? true : false;
      }
      return set_cart;
    } catch (err) {
      throw err;
    }
  };

  static can_add_review = async (product_id: string, user_id: string) => {
    try {
      let can_review = false;
      if (user_id == null) {
        return can_review;
      } else {
        let query = {
          product_id: product_id,
          user_id: user_id,
          order_status: "DELIVERED",
        };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response: any = await DAO.get_data(
          Models.OrderProducts,
          query,
          projection,
          options
        );
        can_review = response.length > 0 ? true : false;
      }
      return can_review;
    } catch (err) {
      throw err;
    }
  };

  static check_wishlisted = async (product_id: string, user_id: string) => {
    try {
      let wishlisted = false;
      if (user_id == null) {
        return wishlisted;
      } else {
        let query = { product_id: product_id, user_id: user_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response: any = await DAO.get_data(
          Models.Wishlist,
          query,
          projection,
          options
        );
        wishlisted = response.length > 0 ? true : false;
      }
      return wishlisted;
    } catch (err) {
      throw err;
    }
  };

  static retrive_product_details = async (product_id: string) => {
    try {
      let query = { product_id: product_id };
      let projection = { __v: 0 };
      let options = { lean: true };
      let response = await DAO.get_data(
        Models.ProductDetails,
        query,
        projection,
        options
      );
      return response;
    } catch (err) {
      throw err;
    }
  };

  static retrive_product_services = async (product_id: string) => {
    try {
      let query = { product_id: product_id };
      let projection = { __v: 0 };
      let options = { lean: true };
      let response = await DAO.get_data(Models.ProductServices,query,projection,options);
      return response;
    } catch (err) {
      throw err;
    }
  };

  static retrive_product_highlights = async (product_id: string) => {
    try {
      let query = { product_id: product_id };
      let projection = { __v: 0 };
      let options = { lean: true };
      let response = await DAO.get_data(Models.ProductHighlights,query,projection,options);
      return response;
    } catch (err) {
      throw err;
    }
  };

  static retrive_product_variations = async (product_id: string) => {
    try {
      // let query = { product_id: product_id };
      let projection = { __v: 0 };
      let options = { lean: true };

      let query = [
        await product_helper.match_variant_product_id(product_id),
        await product_helper.lookup_variants(),
        await product_helper.unwind_variants(),
        await product_helper.group_variants_data()
      ];

      let response = await DAO.aggregate_data(Models.Product_Variations,query,options,);
      // let response = await DAO.get_data(Models.Product_Variations,query,projection,options);
      return response;
    } catch (err) {
      throw err;
    }
  };

  static retrive_faq_products = async (product_id: string, user_id: string) => {
    try {
      let query = { product_id: product_id };
      let projection = { __v: 0 };
      let options = { lean: true };
      let response: any = await DAO.get_data(Models.FaqsProducts,query,projection,options);
      for (let value of response) {
        let faqs_likes: any = await DAO.count_data(Models.FaqLikes, {
          faq_id: value._id,
          type: "LIKE",
        });
        let faq_dislikes: any = await DAO.count_data(Models.FaqLikes, {
          faq_id: value._id,
          type: "DISLIKE",
        });
        value.likes_count = faqs_likes;
        value.dislikes_count = faq_dislikes;
        console.log("faq_likes ", faqs_likes, "faq_dislikes", faq_dislikes);

        if (user_id == null) {
          value.liked_by_you = false;
          value.disliked_by_you = false;
        } else {
          let likes_by_u: any = await DAO.count_data(Models.FaqLikes, {
            faq_id: value._id,
            type: "LIKE",
            user_id: user_id,
          });
          let dislikes_by_u: any = await DAO.count_data(Models.FaqLikes, {
            faq_id: value._id,
            type: "DISLIKE",
            user_id: user_id,
          });
          value.liked_by_you = likes_by_u == 0 ? false : true;
          value.disliked_by_you = dislikes_by_u == 0 ? false : true;
        }
      }

      return response;
    } catch (err) {
      throw err;
    }
  };

  static retrive_order_product = async(product_id:string,user_id:string)=>{
    try {
      let query = { product_id: product_id, user_id:user_id };
      let projection = { __v: 0 };
      let options = { lean: true };
      let response = await DAO.get_data(Models.OrderProducts,query,projection,options);
      return response;
    } catch (err) {
      throw err;
    }
  }

  static retrive_product_ratings = async (product_id: string) => {
    try {
      let product = await DAO.get_data(Models.Products, { _id: product_id }, {}, { lean: true })
      let { parent_id } = product[0]
      let query: any = { product_id: product_id }
      if (!!parent_id) {
          query = { product_id: parent_id }
      }
      let projection = { __v: 0 };
      let options = { lean: true, sort:{updated_at:-1} };
     
      let populate = [
        {
          path: "user_id",
          select: "profile_pic name",
        },
      ];
      let response = await DAO.populate_data(Models.Reviews,query,projection,options,populate);
      return response;
    } catch (err) {
      throw err;
    }
  };

  static searchLocation1 = async (req: any) => {
    try {
      let { product_id, lat, lng } = req;
      let query: any = [
        await this.match_product_id(product_id),
        await this.find_nearest(lng, lat, null),
      ];
      let response: any = await DAO.aggregate_data(
        Models.Delivery_Locations,
        query,
        { lean: true }
      );
      // console.log(response);

      if (response && response.length) {
        let query_new: any = [
          await this.match_product_id(product_id),
          await this.find_nearest(lng, lat, response[0].radius),
        ];
        let get_data: any = await DAO.aggregate_data(
          Models.Delivery_Locations,
          query_new,
          { lean: true }
        );
        return get_data[0];
      } else {
        return "Delivery not available";
      }
    } catch (err) {
      throw err;
    }
  };

  static searchLocation = async (req: any) => {
    try {
      let { product_id, lat, lng, country } = req;
      let query: any = [
        await this.match_product_id(product_id),
        await this.find_nearest(lng, lat, null),
      ];
      let response: any = await DAO.aggregate_data(Models.Delivery_Locations,query,{ lean: true });
      console.log("search location response 1 --- ", response);

      let get_product:any = await DAO.get_data(Models.Products,{_id:product_id}, {__v:0}, {lean: true} )
      let { is_delivery_available } = get_product[0];
      console.log(' is delivery avail ---- ', is_delivery_available)
   
      if(is_delivery_available == true){
         console.log("world open delivery avaialable ----------");
        let response = {
          delivery_time: 7,
          is_delivery_available:true,
        };
        return response;
      }else{
         console.log("ELSE PART ---------- 2");
         if (response && response.length) {
          console.log("IF PART ---------- response 3");
          let query_new: any = [
          // await this.match_product_id(product_id),
          // await this.find_nearest(lng, lat, response[0].radius),
          await this.find_geo_near(lng,lat,Number(response[0].radius),product_id),
          ];
          let get_data: any = await DAO.aggregate_data(Models.Delivery_Locations,query_new,{ lean: true });
          console.log("search location response 2 --- ", get_data);
        
          if (get_data.length) {
            console.log("ELSE PART ---------- 4");
            return  response[0];
          } else {
            console.log("ELSE PART ---------- 5");
            // console.log("response[0] ----------- ", response[0]);
            return "Delivery not available";   
          }
        } else {
          if(country){
            console.log("getting country ----------",country);
            let query: any = [
              await this.match_product_and_Country(product_id,country),
            ];
            let get_data: any = await DAO.aggregate_data(Models.Delivery_Locations,query,{ lean: true });
            if(get_data && get_data.length > 0){
              console.log("IF PART country ----------");
  
              return  get_data[0];
            }else{
              console.log("ELSE PART country----------");
              return "Delivery not available";
            }
          }else{
            console.log("ELSE  ---------- END");
            return "Delivery not available";
          }
          
        }
      }
    } catch (err) {
      throw err;
    }
  };

  static match_product_id = async (product_id: string) => {
    return {
      $match: {
        product_id: Mongoose.Types.ObjectId(product_id),
      },
    };
  };

  static match_product_and_Country = async (product_id: string,country:string) => {
    let countryData = country.split(','); 
    let country_data=(countryData[countryData.length-1]).trim().toLowerCase()
    return {
      $match: {
        product_id: Mongoose.Types.ObjectId(product_id),
        address: country_data,
      },
    };
  };

  static async find_nearest(long_from: any, lat_from: any, get_kms: number) {
    try {
      console.log("get_kms ", get_kms);

      var earthRadiusInMiles = 3963.19;

      let result: any = 100 / earthRadiusInMiles;

      let cal_radius: number = Number(get_kms) * 0.621371;
      let set_miles = 5;
      console.log("cal_radius -- ", cal_radius);
      let radius: any =
        get_kms == null || 0 ? result : cal_radius / earthRadiusInMiles;

      console.log("geoWithin -- ", radius);
      console.log("lat_from, long_from -- ", lat_from, long_from);

      return {
        $match: {
          "location.coordinates": {
            $geoWithin: {
              $centerSphere: [[Number(long_from), Number(lat_from)], radius],
            },
          },
        },
      };
    } catch (err) {
      throw err;
    }
  }

  static async find_geo_near(long: number,lat: number,get_kms: any,product_id: string) {
    try {
      console.log("get_kms...", get_kms);
      let radius = Number(get_kms) * 1000;
      console.log("radius...", radius);
      return {
        $geoNear: {
          near: { type: "Point", coordinates: [Number(long), Number(lat)] },
          key: "location",
          distanceField: "distance",
          maxDistance: radius, //in meters
          spherical: true,
          query: {
            product_id: Mongoose.Types.ObjectId(product_id),
          },
        },
      };
    } catch (err) {
      throw err;
    }
  }
}
