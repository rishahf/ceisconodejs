import { Request, Response } from 'express';
import { handle_success, handle_catch } from "../../middlewares/index";
import { product_add_module, product_edit_module, product_list_module } from './product_module';
import product_details from './product_details';
import product_services from './product_services';
import product_highlights from './product_highlights';
import product_variations from './product_variations';
import product_faq_module from './product_faqs';
import product_delivery_locations_module from './product_delivery_locations'
import coupons_module from './coupons';
import dashboard_module from './dashboard';
import product_graph from './product_graph';
import sales_graph from './sales_graph';
import { order_module, cancel_order_module } from './order_module'
import { common_module } from "../../middlewares/common";

export default class controller {
  // dashboard
  static dashboard = async (req: Request, res: Response) => {
    try {
      let response = await dashboard_module.count(req);
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

  // product graph
  static product_graph = async (req: Request, res: Response) => {
    try {
      let response = await product_graph.retrive_graph(req);
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

  // sales graph
  static sales_graph = async (req: Request, res: Response) => {
    try {
      let response = await sales_graph.retrive_graph(req);
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

  // add or edit a product
  static add_a_product = async (req: Request, res: Response) => {
    try {
      let response = await product_add_module.add_a_product(req);
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

  // add or edit a product
  static edit_a_product = async (req: Request, res: Response) => {
    try {
      let response = await product_edit_module.edit_a_product(req);
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

  // list a product
  static list_product = async (req: Request, res: Response) => {
    try {
      let response = await product_list_module.list(req);
      handle_success(res, response);
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // list a product details
  static list_product_details = async (req: Request, res: Response) => {
    try {
      // console.log("req ", req);

      let response = await product_list_module.details(req);
      handle_success(res, response);
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // add product_details
  static add_product_details = async (req: Request, res: Response) => {
    try {
      let response = await product_details.add(req);
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

  // edit product details
  static edit_product_details = async (req: Request, res: Response) => {
    try {
      let response = await product_details.edit(req);
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

  // list product details
  static list_p_details = async (req: Request, res: Response) => {
    try {
      let response = await product_details.list(req);
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

  // delete a product details
  static delete_product_details = async (req: Request, res: Response) => {
    try {
      let response = await product_details.delete(req);
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

  // add product_services
  static add_product_services = async (req: Request, res: Response) => {
    try {
      let response = await product_services.add(req);
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

  // edit product services
  static edit_product_services = async (req: Request, res: Response) => {
    try {
      let response = await product_services.edit(req);
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

  // list product services
  static list_product_services = async (req: Request, res: Response) => {
    try {
      let response = await product_services.list(req);
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

  // delete a product services
  static delete_product_services = async (req: Request, res: Response) => {
    try {
      let response = await product_services.delete(req);
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

  // add product highlights
  static add_product_highlights = async (req: Request, res: Response) => {
    try {
      let response = await product_highlights.add(req);
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

  // edit product highlights
  static edit_product_highlights = async (req: Request, res: Response) => {
    try {
      let response = await product_highlights.edit(req);
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

  // list product highlights
  static list_product_highlights = async (req: Request, res: Response) => {
    try {
      let response = await product_highlights.list(req);
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

  // delete a product highlights
  static delete_product_highlights = async (req: Request, res: Response) => {
    try {
      let response = await product_highlights.delete(req);
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

  // add product variations
  static add_pv = async (req: Request, res: Response) => {
    try {
      let response = await product_variations.add(req);
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

  // edit product variations
  static edit_pv = async (req: Request, res: Response) => {
    try {
      let response = await product_variations.edit(req);
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

  // list product variations
  static list_pv = async (req: Request, res: Response) => {
    try {
      let response = await product_variations.list(req);
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

  // delete a product variation
  static delete_pv = async (req: Request, res: Response) => {
    try {
      let response = await product_variations.delete(req);
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

  //
  static list_product_variants_to_add = async (req: Request, res: Response) => {
    try {
      let response = await product_variations.list_variants_to_add(req);
      handle_success(res, response);
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // add product faq module
  static add_product_faq = async (req: Request, res: Response) => {
    try {
      let response = await product_faq_module.add(req);
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

  // edit product_faq
  static edit_product_faq = async (req: Request, res: Response) => {
    try {
      let response = await product_faq_module.edit(req);
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

  // list product_faq
  static list_product_faq = async (req: Request, res: Response) => {
    try {
      let response = await product_faq_module.faq_list(req);
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

  // delete a product_faq
  static delete_product_faq = async (req: Request, res: Response) => {
    try {
      let response = await product_faq_module.delete(req);
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

  //add delivery location
  static add_delivery_location = async (req: Request, res: Response) => {
    try {
      let response = await product_delivery_locations_module.add(req);
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

  //edit deliver location
  static edit_delivery_location = async (req: Request, res: Response) => {
    try {
      let response = await product_delivery_locations_module.edit(req);
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

  //list delivery location
  static list_delivery_location = async (req: Request, res: Response) => {
    try {
      let response = await product_delivery_locations_module.list(req);
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

  // delete a product_faq
  static delete_delivery_location = async (req: Request, res: Response) => {
    try {
      let response = await product_delivery_locations_module.delete(req);
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
      let response = await coupons_module.add(req);
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
      let response = await coupons_module.edit(req);
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
      let response = await coupons_module.list(req);
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
      let response = await coupons_module.details(req);
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
      let response = await coupons_module.delete(req);
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

  static order_status_change = async (req: Request, res: Response) => {
    try {
      let response = await order_module.order_status(req);
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

  //order invoice
  static order_invoice_details = async (req: Request, res: Response) => {
    try {
      let response = await order_module.invoice_details(req);
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

  static approve_cancel_request = async (req: Request, res: Response) => {
    try {
      let response = await cancel_order_module.approve_cancellation_request(req);
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

  static list_orders_transactions = async (req: Request, res: Response) => {
    try {
      let response = await order_module.list_transactions(req);
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

  static list_notifications = async (req: Request, res: Response) => {
    try {
      let response = await order_module.listNotifications(req);
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

  static mark_read_notifications = async (req: Request, res: Response) => {
    try {
      let response = await order_module.markReadNotifications(req);
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

  static clear_notifications = async (req: Request, res: Response) => {
    try {
      let response = await order_module.clearNotifications(req);
      console.log('res ',req.body);
      
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

  static read_notification = async (req: Request, res: Response) => {
    try {
      let response = await order_module.ReadNotification(req);
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

  //list order reviews

  // list orders
  static list_orders_reviews = async (req: Request, res: Response) => {
    try {
      let response = await order_module.list_order_reviews(req);
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
  
  static checking_orders = async (req: Request, res: Response) => {
    try {
      let response = await order_module.ordersDelivery();
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

