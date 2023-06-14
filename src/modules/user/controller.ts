import { Request, Response } from 'express';
import { handle_catch } from "../../middlewares/index";
import search_module from './search_module';
import listing_module from './listing_module';
import cart_module from './cart_module';
import profile_module from './profile_module';
import faqlike_module from './faq_like_module';

export default class controller {
  // forgot password
  static forgot_password = async (req: Request, res: Response) => {
    try {
      let response = await profile_module.forogot_password(req);
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

  // resend forgot passwordotp
  static resend_fp_otp = async (req: Request, res: Response) => {
    try {
      let response = await profile_module.resend_fp_otp(req);
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

  // verify_fp_otp
  static verify_fp_otp = async (req: Request, res: Response) => {
    try {
      let response = await profile_module.verify_fp_otp(req);
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

  // set_new_password
  static set_new_password = async (req: Request, res: Response) => {
    try {
      let response = await profile_module.set_new_password(req);
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

  // search module
  static search = async (req: Request, res: Response) => {
    try {
      let response = await search_module.search(req);
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
  static categories = async (req: Request, res: Response) => {
    try {
      let response = await listing_module.categories(req);
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

  // categories_details
  static categories_details = async (req: Request, res: Response) => {
    try {
      let response = await listing_module.categories_details(req);
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

  // list sub_categories
  static sub_categories = async (req: Request, res: Response) => {
    try {
      let response = await listing_module.sub_categories(req);
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

  // sub_categories_details
  static sub_categories_details = async (req: Request, res: Response) => {
    try {
      let response = await listing_module.sub_categories_details(req);
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

  // list sub_subcategories
  static sub_subcategories = async (req: Request, res: Response) => {
    try {
      let response = await listing_module.sub_subcategories(req);
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

  // sub_subcategories_details
  static sub_subcategories_details = async (req: Request, res: Response) => {
    try {
      let response = await listing_module.sub_subcategories_details(req);
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
  static brands = async (req: Request, res: Response) => {
    try {
      let response = await listing_module.brands(req);
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

  // brand details
  static brands_details = async (req: Request, res: Response) => {
    try {
      let response = await listing_module.brands_details(req);
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

  // nested_data
  static nested = async (req: Request, res: Response) => {
    try {
      let response = await listing_module.nested_data(req);
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

  // add_to_cart
  static add_to_cart = async (req: Request, res: Response) => {
    try {
      let response = await cart_module.add(req);
      // let message = "Success";
      let message = {
        title:"Item added",
        desc:"Item added to cart",
      }
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // edit cart
  static edit_cart = async (req: Request, res: Response) => {
    try {
      let response = await cart_module.edit(req);
      // let message = "Success";
      let message = {
        title:"Cart item edited",
        desc:"Item edited successfully",
      }
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // list cart
  static list_cart = async (req: Request, res: Response) => {
    try {
      let response = await cart_module.list(req);
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

  // remove from cart
  static remove_from_cart = async (req: Request, res: Response) => {
    try {
      let response = await cart_module.delete(req);
      // let message = "Success";
      let message = {
        title:"Item removed",
        desc:"Item removed from cart"
      }
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // price_details
  static price_details = async (req: Request, res: Response) => {
    try {
      let response = await cart_module.price_details(req);
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

  // like dislike module faqlike_module
  static faq_like_dislike = async (req: Request, res: Response) => {
    try {
      let response = await faqlike_module.like_dislike(req);
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

  // static faq_like = async (req: Request, res: Response) => {
  //     try {
  //         let response = await faqlike_module.like(req)
  //         let message = "Success";
  //         res.send({
  //             success: true,
  //             message: message,
  //             data: response
  //         });
  //     }
  //     catch (err) {
  //         handle_catch(res, err);
  //     }
  // }

  // static faq_dislike = async (req: Request, res: Response) => {
  //     try {
  //         let response = await faqlike_module.dislike(req)
  //         let message = "Success";
  //         res.send({
  //             success: true,
  //             message: message,
  //             data: response
  //         });
  //     }
  //     catch (err) {
  //         handle_catch(res, err);
  //     }
  // }

  static list_faqs = async (req: Request, res: Response) => {
    try {
      let response = await faqlike_module.list(req);
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

  //
  static searchDeliveryLocation = async (req: Request, res: Response) => {
    try {
      let response = await search_module.searchLocation(req);
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

