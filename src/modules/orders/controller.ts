import { Request, Response } from 'express';
import { handle_catch } from "../../middlewares/index";
import { order_module, order_listing_module, cancel_order_module } from './order_module_2';


export default class controller {
  // create order
  static create_order = async (req: Request, res: Response) => {
    try {
      let response = await order_module.create(req);
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

  // user list orders
  static user_list_orders = async (req: Request, res: Response) => {
    try {
      let response: any = await order_listing_module.list(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        total_count: response.total_count,
        data: response.data,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // order details
  static order_details = async (req: Request, res: Response) => {
    try {
      let response = await order_listing_module.details(req);
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
      let response = await order_listing_module.order_products_details(req);
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

  static ordered_products_invoice = async (req: Request, res: Response) => {
    try {
      let response = await order_listing_module.order_products_invoice_details(req);
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
        data: response.message,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // order cancel request
  static cancel_cancellation_request = async (req: Request, res: Response) => {
    try {
      let response = await cancel_order_module.cancelRequest(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response.message,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // order payment status
  static order_payment_status = async (req: Request, res: Response) => {
    try {
      let response = await order_listing_module.payment_status(req);
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

  static check_coupon_availability = async (req: Request, res: Response) => {
    try {
      let response: any = await order_module.check_coupon(req);
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

  static check_delivery_availability = async (req: Request, res: Response) => {
    try {
      let response: any = await order_module.check_delivery(req)
      console.log('req.query 1 ', req.query);
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