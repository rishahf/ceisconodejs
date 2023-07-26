import * as DAO from "../../DAO";
import * as express from 'express';
import * as Models from "../../models";
import * as email_services from "./email_services";
import * as search_products from './search_products';
import { handle_return, handle_catch, handle_custom_error, helpers } from "../../middlewares/index";

class product_add_module {
  static add_a_product = async (req: any) => {
    try {
      let { parent_id, name, description, size, colour, product_type, parcel_id, brand_id, category_id, subcategory_id, sub_subcategory_id, images, product_details, quantity, price, tax_percentage, discount_percantage, services, highlights, clone_product_id, language } = req.body;
      let { _id: seller_id } = req.user_data;

      let discount = 0, discount_price = 0;
      if (discount_percantage > 0) {
        discount = (Number(discount_percantage) / 100) * Number(price);
        discount_price = Number(price) - discount;
      } else if (discount_percantage == 0 || discount_percantage == undefined) {
        discount_price = price;
      }

      let random_product_id: string = await helpers.genrate_product_id();

      let data_to_save: any = {
        name: name,
        prodct_id: random_product_id,
        description: description,
        size: size,
        colour: colour,
        product_type: product_type,
        added_by: seller_id,
        parcel_id: parcel_id,
        brand_id: brand_id,
        category_id: category_id,
        subcategory_id: subcategory_id,
        sub_subcategory_id: sub_subcategory_id,
        images: images,
        quantity: quantity,
        price: price,
        tax_percentage: tax_percentage,
        discount_percantage: discount_percantage,
        discount: discount,
        discount_price: discount_price,
        language: language,
        updated_at: +new Date(),
        created_at: +new Date(),
      };

      if (!!parent_id) {
        await this.check_product_varient(parent_id)
        data_to_save.parent_id = parent_id
      }

      let response: any = await DAO.save_data(Models.Products, data_to_save);
      let { _id: product_id } = response;
      await this.save_product_details(product_details, product_id);
      await this.save_product_services(services, product_id);
      await this.save_product_highlights(highlights, product_id);
      if (!!clone_product_id) {
        await this.save_locations(clone_product_id, product_id);
      }
      return response;
    } catch (err) {
      throw err;
    }
  };

  static save_locations = async (clone_product_id: string, product_id: any) => {
    try {
      let options: any = {}
      let projections: any = { __v: 0 }
      let query: any = { product_id: clone_product_id };
      let get_locations: any = await DAO.get_data(Models.Delivery_Locations, query, projections, options)
      if (get_locations && get_locations.length) {
        for (let i = 0; i < get_locations.length; i++) {
          let { address, radius, units, delivery_time, location } = get_locations[i];
          // console.log('locatyion ',location)
          let save_data: any = {
            product_id: product_id,
            address: address,
            radius: radius,
            units: units,
            delivery_time: delivery_time,
            // location: {}
            location: { type: "Point", coordinates: [location.coordinates[0], location.coordinates[1]] },
            created_at: +new Date()
          };
          await DAO.save_data(Models.Delivery_Locations, save_data)
        }
      }
      return get_locations
    } catch (err) {
      throw err;
    }
  };

  static save_product_details = async (
    product_details: any,
    product_id: string
  ) => {
    try {
      if (product_details.length) {
        for (let i = 0; i < product_details.length; i++) {
          let { key, value } = product_details[i];
          let unique_number = await this.retrive_unique_number(product_id);
          let data_to_save = {
            product_id: product_id,
            key: key,
            value: value,
            unique_number: unique_number,
            created_at: +new Date(),
          };
          await DAO.save_data(Models.ProductDetails, data_to_save);
        }
      }
    } catch (err) {
      throw err;
    }
  };

  static retrive_unique_number = async (product_id: string) => {
    try {
      let query = { product_id: product_id };
      let total_count = await DAO.count_data(Models.ProductDetails, query);
      let unique_number = Number(total_count) + 1;
      return unique_number;
    } catch (err) {
      throw err;
    }
  };

  static save_product_services = async (services: any, product_id: string) => {
    try {
      if (services.length) {
        for (let i = 0; i < services.length; i++) {
          let data_to_save = {
            product_id: product_id,
            content: services[i],
          };
          await DAO.save_data(Models.ProductServices, data_to_save);
        }
      }
    } catch (err) {
      throw err;
    }
  };

  static save_product_highlights = async (
    highlights: any,
    product_id: string
  ) => {
    try {
      if (highlights.length) {
        for (let i = 0; i < highlights.length; i++) {
          let data_to_save = {
            product_id: product_id,
            content: highlights[i],
          };
          await DAO.save_data(Models.ProductHighlights, data_to_save);
        }
      }
    } catch (err) {
      throw err;
    }
  };

  static check_product_varient = async (
    product_id: any,
  ) => {
    try {
      let query = {
        _id: product_id
      }
      let product: any = await DAO.get_data(Models.Products, query, {}, { lean: true })
      let { parent_id } = product[0]
      if (!!parent_id) {
        let err = { type: "CAN'T ADD PRODUCT", status_code: 400, error_message: "YOU CAN'T ADD PRODUCT VARIENT VARIENT" }
        throw err
      }
    } catch (err) {
      throw err;
    }
  };
}



class product_edit_module {

  static edit_a_product = async (req: any) => {
    try {

      let { _id: product_id, name, colour, description, size, product_type, parcel_id, brand_id, category_id, subcategory_id, sub_subcategory_id, images, quantity, price, discount_percantage, tax_percentage, product_details, services, highlights, sold, is_blocked, is_deleted, is_delivery_available } = req.body;

      // console.log("edit_a_product...",req.body)

      let { _id: seller_id } = req.user_data;

      let query = { _id: product_id, added_by: seller_id }
      let set_data: any = { updated_at: +new Date() }

      let discount = 0, discount_price = 0;
      if (discount_percantage == "" || discount_percantage == 0) {
        // discount = (Number(discount_percantage) / 100) * Number(price);
        discount_price = price;
        set_data.discount_percantage = discount_percantage;
        set_data.discount = 0;
        set_data.discount_price = discount_price;
      }
      if (!!discount_percantage && discount_percantage > 0) {
        discount = (Number(discount_percantage) / 100) * Number(price);
        discount_price = Number(price) - discount
        set_data.discount_percantage = discount_percantage
        set_data.discount = discount
        set_data.discount_price = discount_price
      }
      if (!!name) { set_data.name = name }
      if (!!description) { set_data.description = description }
      if (!!product_type) { set_data.product_type = product_type }
      if (!!size) { set_data.size = size }
      if (!!parcel_id) { set_data.parcel_id = parcel_id }
      if (!!brand_id) { set_data.brand_id = brand_id }
      if (!!category_id) { set_data.category_id = category_id }
      if (!!subcategory_id) { set_data.subcategory_id = subcategory_id }
      if (!!sub_subcategory_id) { set_data.sub_subcategory_id = sub_subcategory_id }
      if (!!images) { set_data.images = images }
      if (!!colour) { set_data.colour = colour }
      if (!!quantity) {
        set_data.quantity = quantity
        set_data.sold = quantity > 0 ? false : true
      }
      if (!!price) { set_data.price = price }
      if (is_delivery_available == true) {
        set_data.is_delivery_available = is_delivery_available;
        set_data.is_visible = is_delivery_available;
      }
      if (is_delivery_available == false) {
        set_data.is_delivery_available = false;
        set_data.is_visible = false;
      }
      if (!!tax_percentage) { set_data.tax_percentage = tax_percentage; }
      if (typeof sold !== undefined && sold !== null && sold !== undefined) {
        set_data.sold = sold
      }
      if (typeof is_blocked !== undefined && is_blocked !== null && is_blocked !== undefined) {
        set_data.is_blocked = is_blocked
      }
      if (typeof is_deleted !== undefined && is_deleted !== null && is_deleted !== undefined) {
        set_data.is_deleted = is_deleted;
        let query_to_remo: any = {};
        query_to_remo.$or = [
          { product_id_1: { $in: [product_id] } },
          { product_id_2: { $in: [product_id] } },
        ];
        console.log("P_Var query ---- ", query_to_remo);
        let get_data: any = await DAO.get_data(Models.Product_Variations, query_to_remo, { __v: 0 }, { lean: true })
        console.log("P_Varget data ----- ", get_data);
        if (get_data && get_data.length) {
          get_data.forEach(async (value: any) => {
            await DAO.remove_data(Models.Product_Variations, { _id: value._id });
          });
        }
      }

      // if (!!product_details) { await this.save_product_details(product_details, product_id) }
      // if (!!services) { await this.save_product_services(product_details, product_id) }
      // if (!!highlights) { await this.save_product_highlights(product_details, product_id) }

      let options = { new: true }
      let response = await DAO.find_and_update(Models.Products, query, set_data, options)
      return response;
    }
    catch (err) {
      throw err;
    }
  }

  // static retrive_unique_number = async (product_id: string) => {
  //     try {
  //         let query = { product_id: product_id };
  //         let total_count = await DAO.count_data(Models.ProductDetails, query);
  //         let unique_number = Number(total_count) + 1
  //         return unique_number
  //     }
  //     catch (err) {
  //         throw err;
  //     }
  // }

  // static save_product_details = async (product_details: any, product_id: string) => {
  //     try {
  //         if (product_details.length) {
  //             let query = { product_id: product_id }
  //             await DAO.remove_many(Models.ProductDetails, query)
  //             for (let i = 0; i < product_details.length; i++) {
  //                 let { key, value } = product_details[i];
  //                 let unique_number = await this.retrive_unique_number(product_id)
  //                 let data_to_save = {
  //                     product_id: product_id,
  //                     key: key,
  //                     value: value,
  //                     unique_number: unique_number,
  //                     created_at: +new Date()
  //                 }
  //                 await DAO.save_data(Models.ProductDetails, data_to_save)
  //             }
  //         }
  //     }
  //     catch (err) {
  //         throw err;
  //     }
  // }

  // static save_product_services = async (services: any, product_id: string) => {
  //     try {
  //         if (services.length) {
  //             let query = { product_id: product_id }
  //             await DAO.remove_many(Models.ProductServices, query)
  //             for (let i = 0; i < services.length; i++) {
  //                 let data_to_save = {
  //                     product_id: product_id,
  //                     content: services[i]
  //                 }
  //                 await DAO.save_data(Models.ProductServices, data_to_save)
  //             }
  //         }
  //     }
  //     catch (err) {
  //         throw err;
  //     }
  // }

  // static save_product_highlights = async (highlights: any, product_id: string) => {
  //     try {
  //         if (highlights.length) {
  //             let query = { product_id: product_id }
  //             await DAO.remove_many(Models.ProductHighlights, query)
  //             for (let i = 0; i < highlights.length; i++) {
  //                 let data_to_save = {
  //                     product_id: product_id,
  //                     content: highlights[i]
  //                 }
  //                 await DAO.save_data(Models.ProductHighlights, data_to_save)
  //             }
  //         }
  //     }
  //     catch (err) {
  //         throw err;
  //     }
  // }


}


class product_list_module {

  static list = async (req: any) => {
    try {
      let { _id: seller_id } = req.user_data;
      let query = [
        await search_products.match_data(seller_id),
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
        await search_products.sort_data1(req.query),
        await search_products.skip_data(req.query),
        await search_products.limit_data(req.query)
      ]
      let options = { lean: true }
      let Products = await DAO.aggregate_data(Models.Products, query, options);

      let query_count = [
        await search_products.match_data(seller_id),
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
        await search_products.sort_data1(req.query)
      ]
      let CountProducts: any = await DAO.aggregate_data(Models.Products, query_count, options);
      let response = {
        total_count: CountProducts.length,
        data: Products
      };
      return response

    }
    catch (err) {
      throw err;
    }
  }


  static details = async (req: any) => {
    try {

      let { _id } = req.params, { _id: user_id } = req.user_data;

      let query = { _id: _id, added_by: user_id }
      let projection = { __v: 0 }
      let options = { lean: true }
      let populate = [
        {
          path: 'added_by',
          select: 'name'
        },
        {
          path: 'category_id',
          select: 'name'
        },
        {
          path: 'subcategory_id',
          select: 'name'
        },
        {
          path: 'sub_subcategory_id',
          select: 'name'
        },
        {
          path: 'brand_id',
          select: 'name'
        }
      ]
      let retrive_data: any = await DAO.populate_data(Models.Products, query, projection, options, populate)
      if (retrive_data.length) {
        let { _id: product_id } = retrive_data[0]
        let product_details = await this.retrive_product_details(product_id)
        let product_services = await this.retrive_product_services(product_id)
        let product_highlights = await this.retrive_product_highlights(product_id)
        let product_variations = await this.retrive_product_variations(product_id)
        let product_faqs = await this.retrive_faq_products(product_id)
        let ratings = await this.retrive_product_ratings(product_id)

        retrive_data[0].productdetails = product_details
        retrive_data[0].product_services = product_services
        retrive_data[0].product_highlights = product_highlights
        retrive_data[0].product_variations = product_variations
        retrive_data[0].faqs_products = product_faqs
        retrive_data[0].ratings = ratings
        return retrive_data[0]
      }
      else {
        throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH")
      }

    }
    catch (err) {
      throw err;
    }
  }


  static retrive_product_details = async (product_id: string) => {
    try {

      let query = { product_id: product_id }
      let projection = { __v: 0 }
      let options = { lean: true }
      let response = await DAO.get_data(Models.ProductDetails, query, projection, options)
      return response

    }
    catch (err) {
      throw err;
    }
  }

  static retrive_product_services = async (product_id: string) => {
    try {

      let query = { product_id: product_id }
      let projection = { __v: 0 }
      let options = { lean: true }
      let response = await DAO.get_data(Models.ProductServices, query, projection, options)
      return response

    }
    catch (err) {
      throw err;
    }
  }

  static retrive_product_highlights = async (product_id: string) => {
    try {

      let query = { product_id: product_id }
      let projection = { __v: 0 }
      let options = { lean: true }
      let response = await DAO.get_data(Models.ProductHighlights, query, projection, options)
      return response

    }
    catch (err) {
      throw err;
    }
  }

  static retrive_product_variations = async (product_id: string) => {
    try {

      let query = { product_id: product_id }
      let projection = { __v: 0 }
      let options = { lean: true }
      let response = await DAO.get_data(Models.Product_Variations, query, projection, options)
      return response

    }
    catch (err) {
      throw err;
    }
  }

  static retrive_faq_products = async (product_id: string) => {
    try {

      let query = { product_id: product_id }
      let projection = { __v: 0 }
      let options = { lean: true }
      let response = await DAO.get_data(Models.FaqsProducts, query, projection, options)
      return response

    }
    catch (err) {
      throw err;
    }
  }

  static retrive_product_ratings = async (product_id: string) => {
    try {

      let query = { product_id: product_id }
      let projection = { __v: 0 }
      let options = { lean: true, sort: { updated_at: -1 } }
      let populate = [
        {
          path: "user_id",
          select: "profile_pic name"
        }
      ]
      let response = await DAO.populate_data(Models.Reviews, query, projection, options, populate)
      return response

    }
    catch (err) {
      throw err;
    }
  }

}


export {
  product_add_module,
  product_edit_module,
  product_list_module
}