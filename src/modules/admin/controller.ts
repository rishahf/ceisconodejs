import { Request, Response } from 'express';
import { handle_catch, handle_success } from "../../middlewares/index";
import coupon_module from './coupon_module';
import { category, sub_category, sub_sub_category, brand, fees_module } from './admin_module';
import { product_list_module } from './product_module';
import { order_module, cancel_order_module } from './order_module'

export default class controller {
  // add a category
  static add_a_category = async (req: Request, res: Response) => {
    try {
      let response = await category.add(req);
      handle_success(res, response);
      // let message = "Success";
      // res.send({
      //     success: true,
      //     message: message,
      //     data: response
      // });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // edit a category
  static edit_a_category = async (req: Request, res: Response) => {
    try {
      let response = await category.edit(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // list categories
  static list_categories = async (req: Request, res: Response) => {
    try {
      let response = await category.list(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static get_category = async (req: Request, res: Response) => {
    try {
      let response = await category.category(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // add a sub_category
  static add_a_subcategory = async (req: Request, res: Response) => {
    try {
      let response = await sub_category.add(req);
      handle_success(res, response);
      // let message = "Success";
      // res.send({
      //     success: true,
      //     message: message,
      //     data: response
      // });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // edit a subcategory
  static edit_a_subcategory = async (req: Request, res: Response) => {
    try {
      let response = await sub_category.edit(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // list subcategory
  static list_subcategory = async (req: Request, res: Response) => {
    try {
      let response = await sub_category.list(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // list subcategory
  static get_subcategory = async (req: Request, res: Response) => {
    try {
      let response = await sub_category.subcategory(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // add a sub sub_category
  static add_a_sub_subcategory = async (req: Request, res: Response) => {
    try {
      let response = await sub_sub_category.add(req);
      handle_success(res, response);
      // let message = "Success";
      // res.send({
      //     success: true,
      //     message: message,
      //     data: response
      // });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // edit a sub subcategory
  static edit_a_sub_subcategory = async (req: Request, res: Response) => {
    try {
      let response = await sub_sub_category.edit(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // list sub subcategory
  static list_sub_subcategory = async (req: Request, res: Response) => {
    try {
      let response = await sub_sub_category.list(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static get_sub_subcategory = async (req: Request, res: Response) => {
    try {
      let response = await sub_sub_category.sub_subcategory(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // add a brand
  static add_a_brand = async (req: Request, res: Response) => {
    try {
      let response = await brand.add(req);
      handle_success(res, response);
      // let message = "Success";
      // res.send({
      //     success: true,
      //     message: message,
      //     data: response
      // });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // edit a brand
  static edit_a_brand = async (req: Request, res: Response) => {
    try {
      let response = await brand.edit(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // list brands
  static list_brands = async (req: Request, res: Response) => {
    try {
      let response = await brand.list(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static get_brands = async (req: Request, res: Response) => {
    try {
      let response = await brand.brands(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // add a coupon_module
  static add_a_coupon = async (req: Request, res: Response) => {
    try {
      let response = await coupon_module.add(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // edit a coupon
  static edit_a_coupon = async (req: Request, res: Response) => {
    try {
      let response = await coupon_module.edit(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // list coupon
  static list_coupons = async (req: Request, res: Response) => {
    try {
      let response = await coupon_module.list(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // list coupon details
  static list_coupon_details = async (req: Request, res: Response) => {
    try {
      let response = await coupon_module.details(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // delete_a_coupon
  static delete_a_coupon = async (req: Request, res: Response) => {
    try {
      let response = await coupon_module.delete(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  //homepagecoupon
  static set_homepage_coupon = async (req: Request, res: Response) => {
    try {
      let response = await coupon_module.homepage_coupon(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // fees_module
  static add_fees = async (req: Request, res: Response) => {
    try {
      let response = await fees_module.add(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // edit a coupon
  static edit_fees = async (req: Request, res: Response) => {
    try {
      let response = await fees_module.edit(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // list coupon
  static list_fees = async (req: Request, res: Response) => {
    try {
      let response = await fees_module.list(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // product_list_module
  static product_details = async (req: Request, res: Response) => {
    try {
      let response = await product_list_module.details(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // list orders
  static list_orders = async (req: Request, res: Response) => {
    try {
      let response = await order_module.list(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // details
  static order_details = async (req: Request, res: Response) => {
    try {
      let response = await order_module.details(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // details
  static user_orders = async (req: Request, res: Response) => {
    try {
      let response = await order_module.user_orders(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // cancel_order
  static cancel_order = async (req: Request, res: Response) => {
    try {
      let response = await cancel_order_module.cancel(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // reviews
  static list_orders_reviews = async (req: Request, res: Response) => {
    try {
      let response = await order_module.list_orderReviews(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static invoice_data = async (req: Request, res: Response) => {
    try {
      let response = await order_module.invoiceData(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static ordered_products_detail = async (req: Request, res: Response) => {
    try {
      let response = await order_module.order_products_details(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };
}